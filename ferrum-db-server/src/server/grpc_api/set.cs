using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using Grpc.Core;
using GrpcAPI;
using GrpcAPI.set;
using Microsoft.Extensions.Logging;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class SetService : Set.SetBase {
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;

    public override Task<HasResponse> Has(HasRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasResponse();
            try {
                response.Has = ferrumDb.getDatabase(request.Database).getSet(request.SetName).has(request.Key);
            }
            catch (Exception e) {
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> Put(PutRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).getSet(request.SetName).add(request.Key, -1);
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

    public override Task<SuccessResponse> Clear(ClearRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).getSet(request.SetName).clear();
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

    public override Task<SuccessResponse> Delete(DeleteRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).getSet(request.SetName).delete(request.Key, -1);
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

    public override Task<SizeResponse> Size(SizeRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SizeResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SizeResponse();
            try {
                response.Size = ferrumDb.getDatabase(request.Database).getSet(request.SetName).getRecordCount();
            }
            catch (Exception e) {
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListKeysResponse> ListKeys(ListKeysRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListKeysResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListKeysResponse();
            try {
                var keys = ferrumDb.getDatabase(request.Database).getSet(request.SetName).getKeys();
                foreach (var key in keys) {
                    response.Keys.Add(key);
                }
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