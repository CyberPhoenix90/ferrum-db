using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src;
using Google.Protobuf;
using Grpc.Core;
using GrpcAPI;
using GrpcAPI.timeseries;
using Microsoft.Extensions.Logging;
using static ferrum_db_server.src.server.grpc_api.GRPCServer;

public class TimeSeriesService : TimeSeries.TimeSeriesBase
{
    public static AutoResetEvent ioEvents;
    public static ConcurrentQueue<IoEvent> ioEventCallbacks;

    public override Task<ClearSerieResponse> ClearSerie(ClearSerieRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<ClearSerieResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new ClearSerieResponse();
            try
            {
                ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).clearSerie(request.Serie);
            }
            catch (Exception e)
            {
                Logger.Info($"Error clearing time series: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<DeleteEntryResponse> DeleteEntry(DeleteEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<DeleteEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new DeleteEntryResponse();
            try
            {
                ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).delete(request.Serie, request.Timestamp, -1);
            }
            catch (Exception e)
            {
                Logger.Info($"Error deleting time series entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<DeleteSerieResponse> DeleteSerie(DeleteSerieRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<DeleteSerieResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new DeleteSerieResponse();
            try
            {
                ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).deleteSerie(request.Serie, -1);
            }
            catch (Exception e)
            {
                Logger.Info($"Error deleting time series: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetEntriesResponse> GetEntries(GetEntriesRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetEntriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetEntriesResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getFullSerieEntries(request.Serie);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series entries: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetEntriesAfterResponse> GetEntriesAfter(GetEntriesAfterRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetEntriesAfterResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetEntriesAfterResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getEntriesAfterTimestamp(request.Serie, request.Timestamp);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series entries after timestamp: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetEntriesBeforeResponse> GetEntriesBefore(GetEntriesBeforeRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetEntriesBeforeResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetEntriesBeforeResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getEntriesBeforeTimestamp(request.Serie, request.Timestamp);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series entries before timestamp: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetEntriesBetweenResponse> GetEntriesBetween(GetEntriesBetweenRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetEntriesBetweenResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetEntriesBetweenResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getEntriesBetweenTimestamps(request.Serie, request.From, request.To);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series entries between timestamps: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetEntryResponse> GetEntry(GetEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetEntryResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).get(request.Serie, request.Timestamp);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetFirstEntryResponse> GetFirstEntry(GetFirstEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetFirstEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetFirstEntryResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getEarliestEntry(request.Serie);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series first entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetFirstEntryAfterResponse> GetFirstEntryAfter(GetFirstEntryAfterRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetFirstEntryAfterResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetFirstEntryAfterResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getFirstEntryAfterTimestamp(request.Serie, request.Timestamp);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series first entry after timestamp: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetFirstEntryBeforeResponse> GetFirstEntryBefore(GetFirstEntryBeforeRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetFirstEntryBeforeResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetFirstEntryBeforeResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getFirstEntryBeforeTimestamp(request.Serie, request.Timestamp);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series first entry before timestamp: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetFirstNEntriesResponse> GetFirstNEntries(GetFirstNEntriesRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetFirstNEntriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetFirstNEntriesResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getLastNEntries(request.Serie, request.N);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series first N entries: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetLastEntryResponse> GetLastEntry(GetLastEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetLastEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetLastEntryResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getLatestEntry(request.Serie);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series last entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetLastNEntriesResponse> GetLastNEntries(GetLastNEntriesRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetLastNEntriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetLastNEntriesResponse();
            try
            {
                var entries = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getLastNEntries(request.Serie, request.N);
                foreach (var entry in entries)
                {
                    response.Entries.Add(copyOrNull(entry));
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series last N entries: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<GetNearestEntryResponse> GetNearestEntry(GetNearestEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<GetNearestEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new GetNearestEntryResponse();
            try
            {
                var entry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getNearestMatch(request.Serie, request.Timestamp);
                response.NotFound = entry == null;
                response.Entry = copyOrNull(entry);
            }
            catch (Exception e)
            {
                Logger.Info($"Error getting time series nearest entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasEntryResponse> HasEntry(HasEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<HasEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new HasEntryResponse();
            try
            {
                response.HasEntry = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).hasEntry(request.Serie, request.Timestamp);
            }
            catch (Exception e)
            {
                Logger.Info($"Error checking time series has entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<HasSerieResponse> HasSerie(HasSerieRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<HasSerieResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new HasSerieResponse();
            try
            {
                response.HasSerie = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).hasSerie(request.Serie);
            }
            catch (Exception e)
            {
                Logger.Info($"Error checking time series has serie: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListEntriesResponse> ListEntries(ListEntriesRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<ListEntriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new ListEntriesResponse();
            try
            {
                var timestamps = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getFullSerie(request.Serie);
                foreach (var timestamp in timestamps)
                {
                    response.Timestamps.Add(timestamp);
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error listing time series entries: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<ListSeriesResponse> ListSeries(ListSeriesRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<ListSeriesResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new ListSeriesResponse();
            try
            {
                var series = ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).getKeys();
                foreach (var serie in series)
                {
                    response.Series.Add(serie);
                }
            }
            catch (Exception e)
            {
                Logger.Info($"Error listing time series series: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    public override Task<PutEntryResponse> PutEntry(PutEntryRequest request, ServerCallContext context)
    {
        var promise = new TaskCompletionSource<PutEntryResponse>();

        ioEventCallbacks.Enqueue((FerrumDb ferrumDb) =>
        {
            var response = new PutEntryResponse();
            try
            {
                ferrumDb.getDatabase(request.Database).getTimeSeries(request.TimeSeries).set(request.Serie, request.Timestamp, request.Entry.ToByteArray(), -1);
            }
            catch (Exception e)
            {
                Logger.Info($"Error putting time series entry: {e.Message}");
                response.Error = e.Message;
            }
            promise.SetResult(response);
        });
        ioEvents.Set();

        return promise.Task;
    }

    private ByteString? copyOrNull(byte[] data)
    {
        if (data == null)
        {
            return ByteString.Empty;
        }
        return ByteString.CopyFrom(data);
    }
}