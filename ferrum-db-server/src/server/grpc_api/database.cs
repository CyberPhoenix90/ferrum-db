using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src;
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
                Logger.Info($"Error creating index: {e.Message}");
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
                Logger.Info($"Error creating index: {e.Message}");
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
                Logger.Info($"Error deleting index: {e.Message}");
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
                Logger.Info($"Error listing indexes: {e.Message}");
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
                Logger.Info($"Error checking if index exists: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CreateSet(CreateSetRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addSet(request.SetName);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating set: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CreateSetIfNotExist(CreateSetRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addSetIfNotExist(request.SetName);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating set: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> DeleteSet(DeleteSetRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).deleteSet(request.SetName);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error deleting set: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasSetResponse> HasSet(HasSetRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasSetResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasSetResponse();
            try {
                response.HasSet = ferrumDb.getDatabase(request.Database).hasSet(request.SetName);
            }
            catch (Exception e) {
                Logger.Info($"Error checking if set exists: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListSetsResponse> ListSets(ListSetsRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListSetsResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListSetsResponse();
            try {
                var sets = ferrumDb.getDatabase(request.Database).getSets();
                response.SetNames.AddRange(sets);
            }
            catch (Exception e) {
                Logger.Info($"Error listing sets: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CreateTimeSeries(CreateTimeSeriesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addTimeSeries(request.TimeSeriesName, request.PageSize);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating time series: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> CreateTimeSeriesIfNotExist(CreateTimeSeriesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).addTimeSeriesIfNotExist(request.TimeSeriesName, request.PageSize);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error creating time series: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<SuccessResponse> DeleteTimeSeries(DeleteTimeSeriesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<SuccessResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new SuccessResponse();
            try {
                ferrumDb.getDatabase(request.Database).deleteTimeSeries(request.TimeSeriesName);
                response.Success = true;
            }
            catch (Exception e) {
                Logger.Info($"Error deleting time series: {e.Message}");
                response.Success = false;
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasTimeSeriesResponse> HasTimeSeries(HasTimeSeriesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<HasTimeSeriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new HasTimeSeriesResponse();
            try {
                response.HasTimeSeries = ferrumDb.getDatabase(request.Database).hasTimeSeries(request.TimeSeriesName);
            }
            catch (Exception e) {
                Logger.Info($"Error checking if time series exists: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListTimeSeriesResponse> ListTimeSeries(ListTimeSeriesRequest request, ServerCallContext context) {
        var promise = new TaskCompletionSource<ListTimeSeriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
            var response = new ListTimeSeriesResponse();
            try {
                var timeSeries = ferrumDb.getDatabase(request.Database).getTimeSeries();
                response.TimeSeriesNames.AddRange(timeSeries);
            }
            catch (Exception e) {
                Logger.Info($"Error listing time series: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }
}