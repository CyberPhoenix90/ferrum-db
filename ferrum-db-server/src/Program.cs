using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using api_server;
using ferrum_db;
using Newtonsoft.Json;

class Config {
    public string ip;
    public int port;
    public string dbFolder;
}

namespace ferrum_db_server {
    class Program {
        static void Main(string[] args) {
            Config? config = JsonConvert.DeserializeObject<Config>(File.ReadAllText("config.json"));

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

            Console.WriteLine($"Starting Database Server");
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            FerrumDb ferrumDb = new FerrumDb(Path.Join(config.dbFolder, "ferrum_db_server.mr"));
            stopWatch.Stop();
            new Thread(() => {
                new APIServer(IPAddress.Parse(config.ip), config.port, ferrumDb);
            }).Start();
            Console.WriteLine($"Starting DB took {stopWatch.ElapsedMilliseconds}ms");
            Console.WriteLine($"Ferrum DB Running @ {config.ip}:{config.port}");
        }
    }
}
