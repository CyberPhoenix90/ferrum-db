using ferrum_db_engine;
using ferrum_transaction_engine;
using System;
using System.Threading;
using Microsoft.ClearScript;
using Microsoft.ClearScript.V8;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ClearScript.JavaScript;

namespace ferrum_query_engine
{
    public class ExecutionEngine
    {
        private DatabaseEngine databaseEngine;
        private TransactionEngine transactionEngine;
        private QueryEngineConfig queryEngineConfig;

        public bool isBusy { get; private set; }
        public Query? currentQuery { get; private set; }
        private Dictionary<string, string> transpileCache = [];

        public ExecutionEngine(DatabaseEngine databaseEngine, TransactionEngine transactionEngine, QueryEngineConfig queryEngineConfig)
        {
            this.databaseEngine = databaseEngine;
            this.transactionEngine = transactionEngine;
            this.queryEngineConfig = queryEngineConfig;
        }

        public void AssignAndExecuteQuery(Query query)
        {
            if (isBusy)
            {
                throw new InvalidOperationException("Cannot assign a new query while the engine is busy.");
            }

            currentQuery = query;
            isBusy = true;

            ThreadPool.QueueUserWorkItem(ExecuteQueryAsync);
        }

        private async void ExecuteQueryAsync(object state)
        {
            if (this.currentQuery == null)
            {
                throw new InvalidOperationException("Cannot execute a query without a query assigned.");
            }

            try
            {
                QueryResult result = await ExecuteQuery(currentQuery, new CancellationToken());

                // Do something with the query result

                this.currentQuery.Complete(result);
                // Reset the engine state
                currentQuery = null;
                isBusy = false;
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occurred during query execution
                Console.WriteLine($"An error occurred while executing the query {currentQuery.query}: {ex.Message}");

                this.currentQuery.Complete(new QueryResult
                {
                    code = Code.SERVER_ERROR,
                    error = ex.Message
                });
                // Reset the engine state
                currentQuery = null;
                isBusy = false;
            }
        }

        private async Task<string> Transpile(string typescriptCode)
        {
            var hash = this.HashString(typescriptCode);
            if (transpileCache.ContainsKey(hash))
            {
                return transpileCache[hash];
            }
            else
            {
                ProcessStartInfo startInfo = new ProcessStartInfo();
                var swcPath = Path.Combine(Directory.GetCurrentDirectory(), "swc");
                // pick correct swc binary based on platform and architecture (x64 or arm64)
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows) && RuntimeInformation.OSArchitecture == Architecture.X64)
                {
                    startInfo.FileName = Path.Combine(swcPath, "swc-win32-x64-msvc.exe");
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && RuntimeInformation.OSArchitecture == Architecture.X64)
                {
                    startInfo.FileName = Path.Combine(swcPath, "swc-linux-x64-gnu");
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows) && RuntimeInformation.OSArchitecture == Architecture.Arm64)
                {
                    startInfo.FileName = Path.Combine(swcPath, "swc-win32-arm64-msvc.exe");
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) && RuntimeInformation.OSArchitecture == Architecture.Arm64)
                {
                    startInfo.FileName = Path.Combine(swcPath, "swc-linux-arm64-gnu");
                }
                else
                {
                    throw new Exception("Unsupported platform or architecture");
                }

                startInfo.Arguments = $"compile --config-file=.swcrc";
                startInfo.RedirectStandardInput = true;
                startInfo.RedirectStandardOutput = true;
                startInfo.WorkingDirectory = swcPath;
                var process = Process.Start(startInfo);
                process.StandardInput.WriteLine(typescriptCode);
                process.StandardInput.Close();

                var lines = process.StandardOutput.ReadToEnd().Split("\n");

                var transpiledCode = string.Join("\n", lines[1..^1]);

                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    throw new Exception("Failed to transpile code");
                }
                else
                {
                    transpileCache[hash] = transpiledCode;

                }

                return transpiledCode;
            }
        }


        private string HashString(string str)
        {
            var sha256 = SHA256.Create();
            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
            return BitConverter.ToString(hash);
        }


        private async Task<QueryResult> ExecuteQuery(Query query, CancellationToken cancellationToken)
        {
            var timeout = query.overrideMaxQueryTime ?? queryEngineConfig.defaultMaxQueryTime;
            var script = await Transpile(query.query);
            using var engine = new V8ScriptEngine(V8ScriptEngineFlags.EnableTaskPromiseConversion | V8ScriptEngineFlags.AddPerformanceObject | V8ScriptEngineFlags.EnableDynamicModuleImports);
            DefineSetTimeout(engine, cancellationToken);
            DefineSetInterval(engine, cancellationToken);
            RegisterConsoleMethods(engine);

            cancellationToken.Register(() =>
            {
                engine.Interrupt();
                engine.Dispose();
            });

            // Timer timer = new Timer(_ =>
            // {
            //     engine.Interrupt();
            //     engine.Dispose();
            // }, null, timeout, Timeout.Infinite);
            engine.DocumentSettings.AccessFlags = DocumentAccessFlags.EnableFileLoading;
            var path = "/home/phoenix/GitHub/ferrum-db/ferrum-query-api/dist/index.mjs";
            var info = new DocumentInfo(new Uri(path)) { Category = ModuleCategory.Standard };
            engine.DocumentSettings.AddSystemDocument("ferrum-query-api", new StringDocument(info, File.ReadAllText(path)));
            engine.DocumentSettings.AddSystemDocument("query.js", ModuleCategory.Standard, script);

            engine.Evaluate(new DocumentInfo
            {
                Category = ModuleCategory.Standard,
            },
             "globalThis.query = (await import('query.js')).default");

            if (engine.Script.query is null)
            {
                return new QueryResult
                {
                    code = Code.SERVER_ERROR,
                    error = "Query returned null"
                };
            }


            var queryResult = await engine.Script.query(query.parameters);

            // timer.Dispose();

            var result = new QueryResult
            {
                code = (Code)(queryResult.code ?? (int)Code.OK),
                data = queryResult.data is Undefined || queryResult.data is null ? null : BitConverter.GetBytes(queryResult.data),
            };

            engine.Dispose();

            return result;

        }

        private static void RegisterConsoleMethods(V8ScriptEngine engine)
        {
            engine.AddHostObject("console", new
            {
                log = new Action<object>(Console.WriteLine),
                error = new Action<object>(Console.Error.WriteLine),
                debug = new Action<object>(Console.WriteLine),
                info = new Action<object>(Console.WriteLine),
                warn = new Action<object>(Console.WriteLine),
                trace = new Action<object>(Console.WriteLine),
                dir = new Action<object>(Console.WriteLine),
            });
        }

        private static void DefineSetInterval(V8ScriptEngine engine, CancellationToken cancellationToken)
        {
            var setIntervalIds = new HashSet<int>();
            var nextIntervalId = 0;
            engine.AddHostObject("setInterval", new Func<Action, int, Task>(async (callback, milliseconds) =>
            {
                var id = nextIntervalId++;
                setIntervalIds.Add(id);
                while (true)
                {
                    if (cancellationToken.IsCancellationRequested)
                    {
                        return;
                    }
                    await Task.Delay(milliseconds);
                    if (cancellationToken.IsCancellationRequested)
                    {
                        return;
                    }
                    if (setIntervalIds.Contains(id))
                    {
                        callback();
                    }
                    else
                    {
                        break;
                    }
                }
            }));
        }

        private static void DefineSetTimeout(V8ScriptEngine engine, CancellationToken cancellationToken)
        {
            var setTimeoutIds = new HashSet<int>();
            var nextTimeoutId = 0;
            engine.AddHostObject("setTimeout", new Func<Action, int, Task>(async (callback, milliseconds) =>
            {
                var id = nextTimeoutId++;
                setTimeoutIds.Add(id);
                if (cancellationToken.IsCancellationRequested)
                {
                    return;
                }
                await Task.Delay(milliseconds);
                if (cancellationToken.IsCancellationRequested)
                {
                    return;
                }
                if (setTimeoutIds.Contains(id))
                {
                    setTimeoutIds.Remove(id);
                    callback();
                }
            }));
        }
    }

}
