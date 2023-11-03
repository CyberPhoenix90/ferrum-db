using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using api_server;
using ferrum_db;
using ferrum_db_server.src;
using ferrum_db_server.src.server.grpc_api;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

class Config
{
    public string? ip;
    public int? tcpPort;
    public int? grpcPort;
    public int? grpcMaxMessageLength;
    public string? dbFolder;
    public bool? stdout;
    public string? fileOut;
    public string? logLevel;

}

namespace ferrum_db_server
{
    class Program
    {
        static void Main(string[] args)
        {
            Thread.CurrentThread.Name = "Main";
            Config? config = LoadConfig(args);
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

            Logger.Info($"Starting Database Server");
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            FerrumDb ferrumDb = new FerrumDb(Path.Join(config.dbFolder, "ferrum_db_server.mr"));
            stopWatch.Stop();
            new Thread(() =>
            {
                new GRPCServer(config.ip, (int)config.grpcPort, ferrumDb, (int)config.grpcMaxMessageLength);
            }).Start();
            new Thread(() =>
            {
                new APIServer(IPAddress.Parse(config.ip), (int)config.tcpPort, ferrumDb);
            }).Start();
            Logger.Info($"Starting DB took {stopWatch.ElapsedMilliseconds}ms");
            Logger.Info($"Ferrum DB Server Running with TCP API @ {config.ip}:{config.tcpPort} and GRPC API @ {config.ip}:{config.grpcPort}");
        }

        private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs args)
        {
            Exception e = (Exception)args.ExceptionObject;
            Logger.Error($"Unhandled Exception: {e.Message + '\n' + e.StackTrace}");
        }

        private static Config LoadConfig(string[] args)
        {
            args = args.SelectMany(x => x.Contains('=') ? x.Split("=") : new string[] { x }).ToArray();

            Config? config;
            if (File.Exists("config.json"))
            {
                config = JsonConvert.DeserializeObject<Config>(File.ReadAllText("config.json"));
            }
            else
            {
                config = new Config();
            }
            config.ip = config.ip ?? "127.0.0.1";
            config.grpcMaxMessageLength = config.grpcMaxMessageLength ?? 134217728;
            config.tcpPort = config.tcpPort ?? 3000;
            config.grpcPort = config.grpcPort ?? 3001;
            config.stdout = config.stdout ?? true;
            config.logLevel = config.logLevel ?? "INFO";
            config.stdout = config.stdout ?? true;

            if (Array.Exists(args, x => x == "--loglevel"))
            {
                config!.logLevel = args[Array.IndexOf(args, "--loglevel") + 1];
            }

            if (Array.Exists(args, x => x == "--grpcmaxmessagelength"))
            {
                config!.grpcMaxMessageLength = int.Parse(args[Array.IndexOf(args, "--grpcmaxmessagelength") + 1]);
            }

            if (Array.Exists(args, x => x == "--stdout"))
            {
                config!.stdout = true;
            }

            if (Array.Exists(args, x => x == "--fileout"))
            {
                config!.fileOut = args[Array.IndexOf(args, "--fileout") + 1];
            }

            if (Array.Exists(args, (item) => item == "--grpcport"))
            {
                config!.grpcPort = int.Parse(args[Array.IndexOf(args, "--grpcport") + 1]);
                Console.WriteLine($"Port overriden by command line flag: {config.grpcPort}");
            }

            if (Array.Exists(args, (item) => item == "--tcpport"))
            {
                config!.tcpPort = int.Parse(args[Array.IndexOf(args, "--tcpport") + 1]);
                Console.WriteLine($"Port overriden by command line flag: {config.tcpPort}");
            }

            if (Array.Exists(args, (item) => item == "--db"))
            {
                config!.dbFolder = args[Array.IndexOf(args, "--db") + 1];
                Console.WriteLine($"Db folder overriden by command line flag: {config.dbFolder}");
            }

            if (Array.Exists(args, (item) => item == "--ip"))
            {
                config!.ip = args[Array.IndexOf(args, "--ip") + 1];
                Console.WriteLine($"Ip overriden by command line flag: {config.ip}");
            }

            Logger.stdOut = (bool)config.stdout;
            Logger.fileOut = config.fileOut;

            switch (config.logLevel.ToUpper())
            {
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
