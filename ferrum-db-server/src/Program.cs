using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using api_server;
using ferrum_db;
using ferrum_db_server.src;
using Newtonsoft.Json;

class Config {
    public string ip;
    public int port;
    public string dbFolder;
    public bool stdout;
    public string fileOut;
    public string logLevel;

}

namespace ferrum_db_server {
    class Program {
        static void Main(string[] args) {
            Thread.CurrentThread.Name = "Main";
            Config? config = LoadConfig(args);
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            Logger.Info($"Starting Database Server");
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            FerrumDb ferrumDb = new FerrumDb(Path.Join(config.dbFolder, "ferrum_db_server.mr"));
            stopWatch.Stop();
            new Thread(() => {
                new APIServer(IPAddress.Parse(config.ip), config.port, ferrumDb);
            }).Start();
            Logger.Info($"Starting DB took {stopWatch.ElapsedMilliseconds}ms");
            Logger.Info($"Ferrum DB Running @ {config.ip}:{config.port}");
        }

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs args) {
            Exception e = (Exception)args.ExceptionObject;
            Logger.Error($"Unhandled Exception: {e.Message + '\n' + e.StackTrace}");
        }

        private static Config LoadConfig(string[] args) {
            Config? config = JsonConvert.DeserializeObject<Config>(File.ReadAllText("config.json"));

            if (Array.Exists(args, x => x == "--loglevel")) {
                config!.logLevel = args[Array.IndexOf(args, "--loglevel") + 1];
            }

            if (Array.Exists(args, x => x == "--stdout")) {
                config!.stdout = true;
            }

            if (Array.Exists(args, x => x == "--fileout")) {
                config!.fileOut = args[Array.IndexOf(args, "--fileout") + 1];
            }

            if (Array.Exists(args, (item) => item == "--port")) {
                config!.port = int.Parse(args[Array.IndexOf(args, "--port") + 1]);
                Console.WriteLine($"Port overriden by command line flag: {config.port}");
            }

            if (Array.Exists(args, (item) => item == "--db")) {
                config!.dbFolder = args[Array.IndexOf(args, "--db") + 1];
                Console.WriteLine($"Db folder overriden by command line flag: {config.dbFolder}");
            }

            if (Array.Exists(args, (item) => item == "--ip")) {
                config!.ip = args[Array.IndexOf(args, "--ip") + 1];
                Console.WriteLine($"Ip overriden by command line flag: {config.ip}");
            }

            Logger.stdOut = config.stdout;
            Logger.fileOut = config.fileOut;

            switch (config.logLevel.ToUpper()) {
                case "DEBUG":
                    Logger.logLevel = LogLevel.DEBUG;
                    break;
                case "INFO":
                    Logger.logLevel = LogLevel.INFO;
                    break;
                case "WARN":
                    Logger.logLevel = LogLevel.WARN;
                    break;
                case "ERROR":
                    Logger.logLevel = LogLevel.ERROR;
                    break;
                default:
                    Logger.logLevel = LogLevel.INFO;
                    break;
            }

            return config;
        }
    }
}
