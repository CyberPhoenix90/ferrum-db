namespace ferrum_api;

using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_logger;
using ferrum_query_engine;
using Google.Protobuf;
using Grpc.Core;
using GrpcAPI;
using Microsoft.ClearScript;

public class DatabaseServerService : DatabaseServer.DatabaseServerBase
{
    public static DatabaseEngine databaseEngine;
    public static APIConfig config;
    public static QueryEngine queryEngine;

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

    public override async Task RunQuery(RunQueryRequest request, IServerStreamWriter<RunQueryResponse> responseStream, ServerCallContext context)
    {

        try
        {
            var result = await queryEngine.SubmitQuery(request.Query, request.Parameters.ToArray(), request.DebugMode, (int debugPort) =>
            {
                var response = new RunQueryResponse();
                response.Code = SuccessResponseCode.Ok;
                response.DebugPort = debugPort;
                response.Type = QueryResponsePartType.DebugPort;

                responseStream.WriteAsync(response);
            });


            var response = new RunQueryResponse();
            response.Type = QueryResponsePartType.Final;
            response.Code = (GrpcAPI.SuccessResponseCode)((int)result.code);
            if (result.error != null)
            {
                response.Error = result.error;
            }
            if (result.data != null)
            {
                response.Data = result.data;
            }

            if (result.encoding != null)
            {
                response.Encoding = (GrpcAPI.QueryResponseEncoding)((int)result.encoding);
            }
            await responseStream.WriteAsync(response);
        }
        catch (Exception e)
        {
            Logger.Info($"Error running query: {e.Message}");
            var response = new RunQueryResponse();
            response.Type = QueryResponsePartType.Final;
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
            await responseStream.WriteAsync(response);
        }
    }
}