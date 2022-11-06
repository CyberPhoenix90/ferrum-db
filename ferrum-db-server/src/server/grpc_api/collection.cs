using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src;
using Grpc.Core;
using GrpcAPI;
using GrpcAPI.collection;
using Microsoft.Extensions.Logging;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class CollectionService : Collection.CollectionBase {
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;

    public override Task<DeleteTagResponse> DeleteTag(DeleteTagRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<DeleteTagResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new DeleteTagResponse();
            try {
                ferrumDb.getDatabase(request.Database).getCollection(request.Collection, request.CollectionType).deleteCollectionTag(request.Tag);
            }
            catch (Exception e) {
                Logger.Info($"Error deleting tag {request.Tag} from collection {request.Collection} in database {request.Database}: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetTagResponse> GetTag(GetTagRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<GetTagResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new GetTagResponse();
            try {
                response.Value = Google.Protobuf.ByteString.CopyFrom(ferrumDb.getDatabase(request.Database).getCollection(request.Collection, request.CollectionType).getCollectionTag(request.Tag));
            }
            catch (Exception e) {
                Logger.Info($"Error getting tag {request.Tag} from collection {request.Collection} in database {request.Database}: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasTagResponse> HasTag(HasTagRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasTagResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasTagResponse();
            try {
                response.HasTag = ferrumDb.getDatabase(request.Database).getCollection(request.Collection, request.CollectionType).hasCollectionTag(request.Tag);
            }
            catch (Exception e) {
                Logger.Info($"Error checking if tag {request.Tag} exists in collection {request.Collection} in database {request.Database}: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListTagsResponse> ListTags(ListTagsRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListTagsResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListTagsResponse();
            try {
                response.Tags.AddRange(ferrumDb.getDatabase(request.Database).getCollection(request.Collection, request.CollectionType).getCollectionTags());
            }
            catch (Exception e) {
                Logger.Info($"Error listing tags in collection {request.Collection} in database {request.Database}: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SetTagResponse> SetTag(SetTagRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SetTagResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SetTagResponse();
            try {
                ferrumDb.getDatabase(request.Database).getCollection(request.Collection, request.CollectionType).setCollectionTag(request.Tag, request.Value.ToByteArray());
            }
            catch (Exception e) {
                Logger.Info($"Error setting tag {request.Tag} in collection {request.Collection} in database {request.Database}: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
}