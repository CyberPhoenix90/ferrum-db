using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_transaction_engine;
using Microsoft.ClearScript;
using Microsoft.ClearScript.JavaScript;
using Microsoft.ClearScript.V8;

namespace ferrum_query_engine;

public class ExecutionEngine {
    private readonly DatabaseEngine databaseEngine;
    private readonly QueryEngineConfig queryEngineConfig;
    private TransactionEngine transactionEngine;
    private readonly Dictionary<string, string> transpileCache = [];

    public ExecutionEngine(DatabaseEngine databaseEngine, TransactionEngine transactionEngine,
        QueryEngineConfig queryEngineConfig) {
        this.databaseEngine = databaseEngine;
        this.transactionEngine = transactionEngine;
        this.queryEngineConfig = queryEngineConfig;
    }

    public bool isBusy { get; private set; }
    public Query? currentQuery { get; private set; }

    public void AssignAndExecuteQuery(Query query) {
        if (isBusy) throw new InvalidOperationException("Cannot assign a new query while the engine is busy.");

        currentQuery = query;
        isBusy = true;

        ThreadPool.QueueUserWorkItem(ExecuteQueryAsync);
    }

    private async void ExecuteQueryAsync(object state) {
        if (currentQuery == null)
            throw new InvalidOperationException("Cannot execute a query without a query assigned.");

        try {
            var result = await ExecuteQuery(currentQuery, new CancellationToken());

            // Do something with the query result

            currentQuery.Complete(result);
            // Reset the engine state
            currentQuery = null;
            isBusy = false;
        }
        catch (Exception ex) {
            // Handle any exceptions that occurred during query execution
            Console.WriteLine($"An error occurred while executing the query {currentQuery.query}: {ex.Message}");

            currentQuery.Complete(new QueryResult { code = Code.SERVER_ERROR, error = ex.Message });
            // Reset the engine state
            currentQuery = null;
            isBusy = false;
        }
    }

    private async Task<string> Transpile(string typescriptCode) {
        var hash = HashString(typescriptCode);
        if (transpileCache.ContainsKey(hash)) return transpileCache[hash];

        var startInfo = new ProcessStartInfo();
        var swcPath = Path.Combine(Directory.GetCurrentDirectory(), "swc");
        // pick correct swc binary based on platform and architecture (x64 or arm64)
        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows) &&
            RuntimeInformation.OSArchitecture == Architecture.X64)
            startInfo.FileName = Path.Combine(swcPath, "swc-win32-x64-msvc.exe");
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) &&
                 RuntimeInformation.OSArchitecture == Architecture.X64)
            startInfo.FileName = Path.Combine(swcPath, "swc-linux-x64-gnu");
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows) &&
                 RuntimeInformation.OSArchitecture == Architecture.Arm64)
            startInfo.FileName = Path.Combine(swcPath, "swc-win32-arm64-msvc.exe");
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux) &&
                 RuntimeInformation.OSArchitecture == Architecture.Arm64)
            startInfo.FileName = Path.Combine(swcPath, "swc-linux-arm64-gnu");
        else
            throw new Exception("Unsupported platform or architecture");

        startInfo.Arguments = "compile --config-file=.swcrc";
        startInfo.RedirectStandardInput = true;
        startInfo.RedirectStandardOutput = true;
        startInfo.WorkingDirectory = swcPath;
        var process = Process.Start(startInfo);
        process.StandardInput.WriteLine(typescriptCode);
        process.StandardInput.Close();

        var lines = process.StandardOutput.ReadToEnd().Split("\n");

        var transpiledCode = string.Join("\n", lines[1..^1]);

        await process.WaitForExitAsync();

        if (process.ExitCode != 0) throw new Exception("Failed to transpile code");

        transpileCache[hash] = transpiledCode;

        return transpiledCode;
    }

    private string HashString(string str) {
        var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
        return BitConverter.ToString(hash);
    }

    private async Task<QueryResult> ExecuteQuery(Query query, CancellationToken cancellationToken) {
        var timeout = query.overrideMaxQueryTime ?? queryEngineConfig.defaultMaxQueryTime;
        var script = await Transpile(query.query);

        V8ScriptEngineFlags config;

        var port = GetAvailablePort();

        if (query.debugMode)
            config = V8ScriptEngineFlags.EnableTaskPromiseConversion | V8ScriptEngineFlags.AddPerformanceObject |
                     V8ScriptEngineFlags.EnableDynamicModuleImports | V8ScriptEngineFlags.EnableDebugging |
                     V8ScriptEngineFlags.AwaitDebuggerAndPauseOnStart | V8ScriptEngineFlags.EnableRemoteDebugging;
        else
            config = V8ScriptEngineFlags.EnableTaskPromiseConversion | V8ScriptEngineFlags.AddPerformanceObject |
                     V8ScriptEngineFlags.EnableDynamicModuleImports;

        using var engine = new V8ScriptEngine(config, port);
        DefineSetTimeout(engine, cancellationToken);
        DefineSetInterval(engine, cancellationToken);
        RegisterConsoleMethods(engine);

        cancellationToken.Register(() => {
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
        engine.DocumentSettings.AddSystemDocument("ferrum-query-api",
            new StringDocument(info, File.ReadAllText(path)));
        engine.DocumentSettings.AddSystemDocument("query.js", ModuleCategory.Standard, script);
        engine.AddHostObject("api", databaseEngine);

        engine.Evaluate(new DocumentInfo { Category = ModuleCategory.Standard },
            $@"const func = (await import('query.js')).default
             if(func != null) {{
                globalThis.query = async (parameters) => {{
                    {(query.debugMode ? "debug(func)" : "")}
                    const result = await func(parameters)
                    if(typeof result !== 'object' || result === null) {{
                        return {{ code: 5, error: 'Query did not return an object' }}
                    }}

                    const data = result.data;

                    if(typeof data === 'string') {{
                        return {{ code: result.code, data: data, encoding: 0 }};
                    }} else if(data instanceof Uint8Array) {{
                        return {{ code: result.code, data: btoa(data), encoding: 2 }};
                    }} else if(typeof data === 'object') {{
                        return {{ code: result.code, data: JSON.stringify(data), encoding: 1 }};
                    }} else if(data == undefined) {{
                        return {{ code: result.code, data: undefined, encoding: 3 }};
                    }} else {{
                        return {{ code: 5, error: `Invalid data type. Expected string, object or binary and got ${{typeof data}}` }};
                    }}
                }}
             }}");

        if (engine.Script.query is null)
            return new QueryResult { code = Code.SERVER_ERROR, error = "Query did not export a default function" };

        var queryResult = await engine.Script.query(query.parameters);

        // timer.Dispose();

        var result = new QueryResult {
            code = (Code)(queryResult.code ?? (int)Code.OK),
            data = queryResult.data is Undefined || queryResult.data is null ? null :
                queryResult.data is string ? queryResult.data : throw new Exception("Invalid data type"),
            encoding = (QueryDataEncoding)(queryResult.encoding ?? (int)QueryDataEncoding.NO_DATA)
        };

        engine.Dispose();

        return result;
    }

    private int GetAvailablePort() {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }

    private static void RegisterConsoleMethods(V8ScriptEngine engine) {
        engine.AddHostObject("console",
            new {
                log = new Action<object>(Console.WriteLine),
                error = new Action<object>(Console.Error.WriteLine),
                debug = new Action<object>(Console.WriteLine),
                info = new Action<object>(Console.WriteLine),
                warn = new Action<object>(Console.WriteLine),
                trace = new Action<object>(Console.WriteLine),
                dir = new Action<object>(Console.WriteLine)
            });
    }

    private static void DefineSetInterval(V8ScriptEngine engine, CancellationToken cancellationToken) {
        var setIntervalIds = new HashSet<int>();
        var nextIntervalId = 0;
        engine.AddHostObject("setInterval", new Func<Action, int, Task>(async (callback, milliseconds) => {
            var id = nextIntervalId++;
            setIntervalIds.Add(id);
            while (true) {
                if (cancellationToken.IsCancellationRequested) return;

                await Task.Delay(milliseconds);
                if (cancellationToken.IsCancellationRequested) return;

                if (setIntervalIds.Contains(id))
                    callback();
                else
                    break;
            }
        }));
    }

    private static void DefineSetTimeout(V8ScriptEngine engine, CancellationToken cancellationToken) {
        var setTimeoutIds = new HashSet<int>();
        var nextTimeoutId = 0;
        engine.AddHostObject("setTimeout", new Func<Action, int, Task>(async (callback, milliseconds) => {
            var id = nextTimeoutId++;
            setTimeoutIds.Add(id);
            if (cancellationToken.IsCancellationRequested) return;

            await Task.Delay(milliseconds);
            if (cancellationToken.IsCancellationRequested) return;

            if (setTimeoutIds.Contains(id)) {
                setTimeoutIds.Remove(id);
                callback();
            }
        }));
    }
}