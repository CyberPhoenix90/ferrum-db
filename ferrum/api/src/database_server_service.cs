namespace ferrum_api;

using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_logger;
using Grpc.Core;
using GrpcAPI;

public class DatabaseServerService : DatabaseServer.DatabaseServerBase
{
    public static DatabaseEngine databaseEngine;
    public static APIConfig config;
    public override Task<SuccessResponse> CreateDatabase(CreateDatabaseRequest request, ServerCallContext context)
    {
        var response = new SuccessResponse();

        try
        {

            if (databaseEngine.HasDatabase(request.Name))
            {
                response.Code = SuccessResponseCode.AlreadyExists;
                return Task.FromResult(response);
            }

            databaseEngine.CreateDatabase(request.Name);
            response.Code = SuccessResponseCode.Ok;
        }
        catch (Exception e)
        {
            Logger.Info($"Error creating database: {e.Message}");
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    public override Task<SuccessResponse> DropDatabase(DropDatabaseRequest request, ServerCallContext context)
    {

        var response = new SuccessResponse();
        try
        {
            if (!databaseEngine.HasDatabase(request.Name))
            {
                response.Code = SuccessResponseCode.NotFound;
                return Task.FromResult(response);
            }

            databaseEngine.DeleteDatabase(request.Name);
            response.Code = SuccessResponseCode.Ok;
        }
        catch (Exception e)
        {
            Logger.Info($"Error deleting database: {e.Message}");
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    public override Task<ListDatabasesResponse> ListDatabases(EmptyRequest request, ServerCallContext context)
    {
        var response = new ListDatabasesResponse();
        try
        {
            response.Databases.AddRange(databaseEngine.ListDatabases());
        }
        catch (Exception e)
        {
            Logger.Info($"Error listing databases: {e.Message}");
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    public override Task<RunQueryResponse> RunQuery(RunQueryRequest request, ServerCallContext context)
    {
        return base.RunQuery(request, context);
    }
}