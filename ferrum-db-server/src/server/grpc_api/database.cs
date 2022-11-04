using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using Grpc.Core;
using GrpcAPI;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class DatabaseService : Database.DatabaseBase {
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;

    public override Task<SuccessResponse> CreateIndex(CreateIndexRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addIndex(request.IndexName, request.PageSize);
                response.Success = true;
            }
            catch (Exception e) {
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
    public override Task<SuccessResponse> CreateIndexIfNotExist(CreateIndexRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addIndexIfNotExist(request.IndexName, request.PageSize);
                response.Success = true;
            }
            catch (Exception e) {
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> DeleteIndex(DeleteIndexRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).deleteIndex(request.IndexName);
                response.Success = true;
            }
            catch (Exception e) {
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListIndexesResponse> ListIndexes(ListIndexesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListIndexesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListIndexesResponse();
            try {
                var indexes = ferrumDb.getDatabase(request.Database).getIndexes();
                response.IndexNames.AddRange(indexes);
            }
            catch (Exception e) {
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasIndexResponse> HasIndex(HasIndexRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasIndexResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasIndexResponse();
            try {
                response.HasIndex = ferrumDb.getDatabase(request.Database).hasIndex(request.IndexName);
            }
            catch (Exception e) {
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
}