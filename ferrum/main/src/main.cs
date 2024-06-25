using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using ferrum_api;
using ferrum_db_engine;
using ferrum_io_engine;
using ferrum_transaction_engine;
using ferrum_logger;
using ferrum_query_engine;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace ferrum;

class Program
{
    async static Task Main(string[] args)
    {
        if (args.Contains("--help") || args.Contains("-h"))
        {
            printHelp();
            return;
        }

        Thread.CurrentThread.Name = "Main";
        Config config = loadConfig(args);

        if (config.dbFolder == null)
        {
            throw new Exception("dbFolder is required");
        }

        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

        Logger.Info($"Starting Database Server");
        var ioEngine = new IOEngine();
        DatabaseEngine ferrumDb = new DatabaseEngine(new DatabaseEngineConfig
        {
            databasePath = config.dbFolder
        }, ioEngine);

        var transactionEngine = new TransactionEngine(ferrumDb);

        var queryEngine = new QueryEngine(ferrumDb, transactionEngine);
        await queryEngine.ExecuteQuery("add(2, 33);");

        Logger.Info($"Starting API");
        new API(ferrumDb, transactionEngine, queryEngine, new APIConfig
        {
            ip = config.ip,
            port = config.port,
            sslCertificate = config.sslCertificate,
            sslPassword = config.sslPassword,
            grpcMaxMessageLength = config.grpcMaxMessageLength,
        });
        Logger.Info($"Ferrum DB Server Running with API @ {config.ip}:{config.port}");

        // All work happens in background threads. Prevent the main thread from exiting until interrupt signal is received
        var waitHandle = new ManualResetEvent(false);
        Console.CancelKeyPress += (sender, eventArgs) =>
        {
            eventArgs.Cancel = true;
            waitHandle.Set();
        };
        waitHandle.WaitOne();
    }

    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs args)
    {
        Exception e = (Exception)args.ExceptionObject;
        Logger.Error($"Unhandled Exception: {e.Message + '\n' + e.StackTrace}");
    }

    private static void printHelp()
    {
        Console.WriteLine("Ferrum NoSQL Database Server");
        Console.WriteLine("Options:");
        Console.WriteLine("  --config=<path>    Path to config file");
        Console.WriteLine("  --ip=<ip>          IP to bind to");
        Console.WriteLine("  --port=<port> Port to bind to for GRPC API");
        Console.WriteLine("  --db-folder=<path> Path to folder to store database files");
        Console.WriteLine("  --stdout           Log to stdout");
        Console.WriteLine("  --file-out=<path>  Log to file");
        Console.WriteLine("  --log-level=<level> Log level (DEBUG, INFO, WARN, ERROR)");
        Console.WriteLine("  --ssl-certificate=<path> Path to SSL certificate");
        Console.WriteLine("  --ssl-password=<password> Password for SSL certificate");
        Console.WriteLine("  --grpc-max-message-length=<length> Max message length in MB");
        Console.WriteLine("  --garbage-collector-aggressiveness=<aggressiveness> Value from 0 to 100, 0 disables the garbage collector, 100 collects immediately as soon as any data is deleted");
        Console.WriteLine("  --preloaded-collections=<collections> Collections that should be preloaded on startup and kept in memory");
        Console.WriteLine("  --collection-idle-timeout=<timeout> The amount of time in seconds a collection can be idle before being unloaded from memory, 0 means never unload. Collections listed in preloadedCollections are never unloaded");
        Console.WriteLine("  --write-cache-size=<size> The amount of data that can be cached in memory before being written to disk in MB");
        Console.WriteLine("  --read-cache-size=<size> The amount of data that can be kept in memory in case it is needed again in MB");
        Console.WriteLine("  --max-file-handles=<handles> Max number of file handles to keep open");
        Console.WriteLine("  --max-query-vms=<vms> Sets how many queries can be run in parallel");
        Console.WriteLine("  --max-query-vm-memory=<memory> Max heap size of VMs in MB");
        Console.WriteLine("  --default-max-query-time=<time> Max time in seconds a query can run before being killed");
        return;
    }

    private static Config loadConfig(string[] args)
    {
        Dictionary<string, dynamic> normalizedArgs = normalizeArgs(args);
        var configFilePath = normalizedArgs.ContainsKey("config") ? normalizedArgs["config"] : "config.json";

        if (File.Exists(configFilePath))
        {
            Config? config = JsonConvert.DeserializeObject<Config>(File.ReadAllText("config.json")) ?? throw new Exception($"Config file at {configFilePath} is invalid");

            foreach (var arg in normalizedArgs)
            {
                if (arg.Key == "config")
                {
                    continue;
                }

                var property = config.GetType().GetProperty(arg.Key);
                if (property != null)
                {
                    property.SetValue(config, arg.Value);
                }
                else
                {
                    throw new Exception($"Unknown config property {arg.Key}");
                }
            }

            Logger.logLevel = config.logLevel.ToUpper() switch
            {
                "DEBUG" => LogLevel.DEBUG,
                "INFO" => LogLevel.INFO,
                "WARN" => LogLevel.WARN,
                "ERROR" => LogLevel.ERROR,
                _ => LogLevel.INFO,
            };

            Logger.stdOut = config.stdout;
            Logger.fileOut = config.fileOut ?? "";

            return config;
        }
        else
        {
            throw new Exception($"Config file not found at {configFilePath}. Please create a config.json file or pass the path to a config file with --config=<path>");
        }
    }

    private static Dictionary<string, dynamic> normalizeArgs(string[] args)
    {
        args = args.SelectMany(x => x.Contains('=') ? x.Split("=") : [x]).ToArray();

        Dictionary<string, dynamic> normalizedArgs = [];
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i].StartsWith("--"))
            {
                var key = kebabCaseToCamelCase(args[i][2..]);
                if (i + 1 < args.Length && !args[i + 1].StartsWith("--"))
                {
                    if (args[1 + i].StartsWith('[') && args[1 + i].EndsWith(']'))
                    {
                        normalizedArgs[key] = args[i + 1][1..^1].Split(",");
                    }
                    else
                    {
                        normalizedArgs[key] = args[i + 1];
                    }
                    i++;
                }
                else
                {
                    normalizedArgs[key] = true;
                }
            }
        }

        return normalizedArgs;
    }

    private static string kebabCaseToCamelCase(string str)
    {
        return string.Join("", str.Split("-").Select((x, i) => i == 0 ? x : char.ToUpper(x[0]) + x[1..]));
    }
}
