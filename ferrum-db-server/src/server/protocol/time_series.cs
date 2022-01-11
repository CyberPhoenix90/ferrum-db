using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server.protocol {
    public class CreateTimeSeries : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly uint pageSize;

        public CreateTimeSeries(uint id, string database, string timeSeries, uint pageSize) : base(ApiMessageType.CREATE_TIME_SERIES, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.pageSize = pageSize;
        }
    }
    public class CreateTimeSeriesIfNotExist : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly uint pageSize;

        public CreateTimeSeriesIfNotExist(uint id, string database, string timeSeries, uint pageSize) : base(ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.pageSize = pageSize;
        }
    }

    public class DeleteTimeSeries : Message {
        public readonly string database;
        public readonly string timeSeries;

        public DeleteTimeSeries(uint id, string database, string timeSeries) : base(ApiMessageType.DELETE_TIME_SERIES, id) {
            this.database = database;
            this.timeSeries = timeSeries;
        }
    }
    public class HasTimeSeries : Message {
        public readonly string database;
        public readonly string timeSeries;

        public HasTimeSeries(uint id, string database, string timeSeries) : base(ApiMessageType.HAS_TIME_SERIES, id) {
            this.database = database;
            this.timeSeries = timeSeries;
        }
    }

    public class GetTimeSeries : Message {
        public readonly string database;

        public GetTimeSeries(uint id, string database) : base(ApiMessageType.GET_TIME_SERIES, id) {
            this.database = database;
        }
    }

    public class TimeSeriesHasSerie : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;

        public TimeSeriesHasSerie(uint id, string database, string timeSeries, string key) : base(ApiMessageType.TIME_SERIES_HAS_SERIE, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
        }
    }

    public class TimeSeriesHasEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesHasEntry(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_HAS_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }
    }

    public class TimeSeriesGetEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesGetEntry(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_GET_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }
    }

    public class TimeSeriesSetEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;
        public readonly byte[] value;

        public TimeSeriesSetEntry(uint id, string database, string timeSeries, string key, long timestamp, byte[] value) : base(ApiMessageType.TIME_SERIES_PUT_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
            this.value = value;
        }
    }

    public class TimeSeriesDeleteEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesDeleteEntry(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_DELETE_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }

    }
    public class TimeSeriesDeleteSerie : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;

        public TimeSeriesDeleteSerie(uint id, string database, string timeSeries, string key) : base(ApiMessageType.TIME_SERIES_DELETE_SERIE, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
        }

    }

    public class TimeSeriesClear : Message {
        public readonly string database;
        public readonly string timeSeries;
        public TimeSeriesClear(uint id, string database, string timeSeries) : base(ApiMessageType.TIME_SERIES_CLEAR, id) {
            this.database = database;
            this.timeSeries = timeSeries;
        }
    }
    public class TimeSeriesGetNearestEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesGetNearestEntry(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }

    }

    public class TimeSeriesGetFirstEntryBefore : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesGetFirstEntryBefore(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }

    }

    public class TimeSeriesGetFirstEntryAfter : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long timestamp;

        public TimeSeriesGetFirstEntryAfter(uint id, string database, string timeSeries, string key, long timestamp) : base(ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.timestamp = timestamp;
        }

    }

    public class TimeSeriesGetFirstEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;

        public TimeSeriesGetFirstEntry(uint id, string database, string timeSeries, string key) : base(ApiMessageType.TIME_SERIES_GET_EARLIEST_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
        }
    }

    public class TimeSeriesGetFullSerie : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;

        public TimeSeriesGetFullSerie(uint id, string database, string timeSeries, string key) : base(ApiMessageType.TIME_SERIES_GET_FULL_SERIE, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
        }
    }

    public class TimeSeriesGetLastEntry : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;

        public TimeSeriesGetLastEntry(uint id, string database, string timeSeries, string key) : base(ApiMessageType.TIME_SERIES_GET_LATEST_ENTRY, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
        }
    }

    public class TimeSeriesGetEntriesBetween : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly long start;
        public readonly long end;

        public TimeSeriesGetEntriesBetween(uint id, string database, string timeSeries, string key, long start, long end) : base(ApiMessageType.TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.start = start;
            this.end = end;
        }
    }

    public class TimeSeriesGetLastNEntries : Message {
        public readonly string database;
        public readonly string timeSeries;
        public readonly string key;
        public readonly int count;

        public TimeSeriesGetLastNEntries(uint id, string database, string timeSeries, string key, int count) : base(ApiMessageType.TIME_SERIES_GET_LAST_N_ENTRIES, id) {
            this.database = database;
            this.timeSeries = timeSeries;
            this.key = key;
            this.count = count;
        }
    }
}
