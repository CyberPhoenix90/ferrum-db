using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ferrum_db_server.src.server.grpc_api
{
    public class GRPCServer
    {

        public delegate void IoEvent(FerrumDb ferrumDb);
        private readonly AutoResetEvent ioEvents;
        private readonly ConcurrentQueue<IoEvent> ioEventCallbacks;

        public GRPCServer(Config config, FerrumDb ferrumDb)
        {
            var builder = WebApplication.CreateBuilder();
            if (config.sslCertificate != null)
            {

                builder.WebHost.ConfigureKestrel((context, options) =>
                {
                    // Specify the SSL certificate
                    options.Listen(IPAddress.Parse(config.ip), (int)config.grpcPort, listenOptions =>
                    {
                        listenOptions.UseHttps(config.sslCertificate, config.sslPassword);
                    });
                });
            }
            else
            {
                builder.WebHost.ConfigureKestrel((context, options) =>
                {
                    options.Listen(IPAddress.Parse(config.ip), (int)config.grpcPort, listenOptions =>
                    {
                        listenOptions.UseHttps();
                    });
                });
            }

            // Add services to the container.
            builder.Services.AddGrpc(options =>
            {
                options.MaxReceiveMessageSize = config.grpcMaxMessageLength;
                options.MaxSendMessageSize = config.grpcMaxMessageLength;
            });
            builder.Logging.ClearProviders();
            this.ioEventCallbacks = new ConcurrentQueue<IoEvent>();
            this.ioEvents = new AutoResetEvent(false);

            var app = builder.Build();

            DatabaseServerService.ioEvents = this.ioEvents;
            DatabaseServerService.ioEventCallbacks = this.ioEventCallbacks;
            DatabaseService.ioEvents = this.ioEvents;
            DatabaseService.ioEventCallbacks = this.ioEventCallbacks;
            IndexService.ioEvents = this.ioEvents;
            IndexService.ioEventCallbacks = this.ioEventCallbacks;
            SetService.ioEvents = this.ioEvents;
            SetService.ioEventCallbacks = this.ioEventCallbacks;
            TimeSeriesService.ioEvents = this.ioEvents;
            TimeSeriesService.ioEventCallbacks = this.ioEventCallbacks;
            CollectionService.ioEvents = this.ioEvents;
            CollectionService.ioEventCallbacks = this.ioEventCallbacks;

            //Log all requests
            app.Use(async (context, next) =>
            {
                Logger.Debug($"Request: {context.Request.Path}");
                await next();
            });

            // Configure the HTTP request pipeline.
            app.MapGrpcService<DatabaseService>();
            app.MapGrpcService<DatabaseServerService>();
            app.MapGrpcService<IndexService>();
            app.MapGrpcService<SetService>();
            app.MapGrpcService<TimeSeriesService>();
            app.MapGrpcService<CollectionService>();
            app
            .MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

            app.RunAsync();

            while (true)
            {
                this.ioEvents.WaitOne();
                while (!ioEventCallbacks.IsEmpty)
                {
                    this.ioEventCallbacks.TryDequeue(out IoEvent? task);
                    if (task != null)
                    {
                        task(ferrumDb);

                    }
                }
            }


        }
    }
}