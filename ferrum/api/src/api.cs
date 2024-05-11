namespace ferrum_api;

using System.Net;
using ferrum_db_engine;
using ferrum_logger;
using ferrum_query_engine;
using ferrum_transaction_engine;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public class API
{
    private readonly DatabaseEngine databaseEngine;

    public API(DatabaseEngine databaseEngine, TransactionEngine transactionEngine, QueryEngine queryEngine, APIConfig config)
    {
        this.databaseEngine = databaseEngine;
        var builder = WebApplication.CreateBuilder();
        if (config.sslCertificate != null)
        {
            Logger.Info($"Using SSL Certificate: {config.sslCertificate}");
            builder.WebHost.ConfigureKestrel((context, options) =>
            {
                // Specify the SSL certificate
                options.Listen(IPAddress.Parse(config.ip), config.port, listenOptions =>
                {
                    listenOptions.UseHttps(config.sslCertificate, config.sslPassword);
                });
            });
        }
        else
        {
            builder.WebHost.ConfigureKestrel((context, options) =>
            {
                options.Listen(IPAddress.Parse(config.ip), config.port, listenOptions =>
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

        var app = builder.Build();

        //Log all requests
        app.Use(async (context, next) =>
        {
            Logger.Debug($"Request: {context.Request.Path}");
            await next();
        });

        DatabaseServerService.config = config;
        DatabaseServerService.databaseEngine = databaseEngine;
        DatabaseService.config = config;
        DatabaseService.databaseEngine = databaseEngine;
        CollectionService.config = config;
        CollectionService.databaseEngine = databaseEngine;

        app.MapGrpcService<DatabaseServerService>();
        app.MapGrpcService<DatabaseService>();
        app.MapGrpcService<CollectionService>();
        app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

        app.RunAsync();
    }
}