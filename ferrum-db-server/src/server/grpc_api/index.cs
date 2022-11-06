using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src;
using Grpc.Core;
using GrpcAPI;
using GrpcAPI.index;
using Microsoft.Extensions.Logging;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class IndexService : GrpcAPI.index.Index.IndexBase {
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;


    public override Task<HasResponse> Has(HasRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasResponse();
            try {
                response.Has = ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).has(request.Key);
            }
            catch (Exception e) {
                Logger.Info($"Error checking if index has key: {e.Message}");
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
                ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).set(request.Key, request.Value.ToByteArray(), -1);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error putting key into index: {e.Message}");
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
                ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).clear();
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error clearing index: {e.Message}");
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
                ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).delete(request.Key, -1);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error deleting key from index: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetResponse> Get(GetRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetResponse();
            try {
                response.Value = Google.Protobuf.ByteString.CopyFrom(ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).get(request.Key));
            }
            catch (Exception e) {
                Logger.Info($"Error getting key from index: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetChunkResponse> GetChunk(GetChunkRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetChunkResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetChunkResponse();
            try {
                response.Chunk = Google.Protobuf.ByteString.CopyFrom(ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).readChunk(request.Key, request.Offset, request.ChunkSize));
            }
            catch (Exception e) {
                Logger.Info($"Error getting chunk from index: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetUntilResponse> GetUntil(GetUntilRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetUntilResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetUntilResponse();
            try {
                response.Chunk = Google.Protobuf.ByteString.CopyFrom(ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).readUntil(request.Key, request.Offset, (byte)request.Terminator));
            }
            catch (Exception e) {
                Logger.Info($"Error getting chunk from index: {e.Message}");
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
                foreach (var key in ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).getKeys()) {
                    response.Keys.Add(key);
                }
            }
            catch (Exception e) {
                Logger.Info($"Error listing keys from index: {e.Message}");
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
                response.Size = ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).getRecordCount();
            }
            catch (Exception e) {
                Logger.Info($"Error getting size of index: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetRecordSizeResponse> GetRecordSize(GetRecordSizeRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetRecordSizeResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetRecordSizeResponse();
            try {
                response.Size = ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).getRecordSize(request.Key) ?? 0;
            }
            catch (Exception e) {
                Logger.Info($"Error getting size of record: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetRecordCountResponse> GetRecordCount(GetRecordCountRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetRecordCountResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetRecordCountResponse();
            try {
                response.Count = ferrumDb.getDatabase(request.Database).getIndex(request.IndexName).getRecordCount();
            }
            catch (Exception e) {
                Logger.Info($"Error getting count of records: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
}