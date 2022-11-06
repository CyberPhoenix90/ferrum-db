using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src;
using Grpc.Core;
using GrpcAPI;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class DatabaseServerService : DatabaseServer.DatabaseServerBase {
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;

    public override Task<SuccessResponse> CreateDatabase(CreateDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.createDatabase(request.Name);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating database: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CreateDatabaseIfNotExist(CreateDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.createDatabaseIfNotExist(request.Name);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating database: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> DropDatabase(DropDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.deleteDatabase(request.Name);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error dropping database: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasDatabaseResponse> HasDatabase(HasDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasDatabaseResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasDatabaseResponse();
            try {
                response.HasDatabase = ferrumDb.hasDatabase(request.Name);
            }
            catch (Exception e) {
                Logger.Info($"Error checking if database exists: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> ClearDatabase(ClearDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Name).clear();
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error clearing database: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListDatabasesResponse> ListDatabases(EmptyRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListDatabasesResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListDatabasesResponse();
            try {
                response.Databases.AddRange(ferrumDb.getDatabases());
            }
            catch (Exception e) {
                Logger.Info($"Error listing databases: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CompactDatabase(CompactDatabaseRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Name).compact();
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error compacting database: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GrpcAPIVersionResponse> GrpcAPIVersion(EmptyRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GrpcAPIVersionResponse>();

        DatabaseService.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GrpcAPIVersionResponse();
            response.Version = "1.0.0";
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
}