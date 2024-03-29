using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server.protocol {
    public enum ApiMessageType : int {
        CREATE_DATABASE = 0,
        CREATE_DATABASE_IF_NOT_EXIST = 1,
        HAS_DATABASE = 2,
        DROP_DATABASE = 3,
        LIST_DATABASES = 4,
        CLEAR_DATABASE = 5,
        CREATE_INDEX = 6,
        CREATE_INDEX_IF_NOT_EXIST = 7,
        DELETE_INDEX = 8,
        HAS_INDEX = 9,
        GET_INDEXES = 10,
        COMPACT = 11,
        INDEX_HAS = 12,
        INDEX_GET = 13,
        INDEX_SET = 14,
        INDEX_DELETE = 15,
        INDEX_GET_KEYS = 16,
        INDEX_CLEAR = 17,
        INDEX_GET_RECORD_COUNT = 18,
        INDEX_GET_RECORD_SIZE = 19,
        INDEX_READ_CHUNK = 20,
        INDEX_READ_UNTIL = 21,
        INDEX_OPEN_WRITE_STREAM = 22,
        INDEX_CLOSE_WRITE_STREAM = 23,
        INDEX_WRITE_STREAM_WRITE_CHUNK = 24,
        HEARTBEAT = 25,
        CREATE_SET = 26,
        CREATE_SET_IF_NOT_EXIST = 27,
        DELETE_SET = 28,
        HAS_SET = 29,
        GET_SETS = 30,
        SET_HAS = 31,
        SET_ADD = 32,
        SET_DELETE = 33,
        SET_GET_KEYS = 34,
        SET_CLEAR = 35,
        SET_GET_RECORD_COUNT = 36,
        TIME_SERIES_HAS_SERIE = 37,
        TIME_SERIES_HAS_ENTRY = 38,
        TIME_SERIES_PUT_ENTRY = 39,
        TIME_SERIES_GET_ENTRY = 40,
        TIME_SERIES_GET_SERIES = 41,
        TIME_SERIES_CLEAR = 42,
        TIME_SERIES_DELETE_SERIE = 43,
        TIME_SERIES_GET_EARLIEST_ENTRY = 44,
        TIME_SERIES_GET_LATEST_ENTRY = 45,
        TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP = 46,
        TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP = 47,
        TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP = 48,
        TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS = 49,
        TIME_SERIES_GET_LAST_N_ENTRIES = 50,
        CREATE_TIME_SERIES = 51,
        CREATE_TIME_SERIES_IF_NOT_EXIST = 52,
        DELETE_TIME_SERIES = 53,
        HAS_TIME_SERIES = 54,
        GET_TIME_SERIES = 55,
        TIME_SERIES_DELETE_ENTRY = 56,
        TIME_SERIES_GET_FULL_SERIE = 57,
        TIME_SERIES_GET_FULL_SERIE_ENTRIES = 58,
        TIME_SERIES_GET_ENTRIES_BEFORE_TIMESTAMP = 59,
        TIME_SERIES_GET_ENTRIES_AFTER_TIMESTAMP = 60,
        COLLECTION_GET_TAGS = 61,
        COLLECTION_DELETE_TAG = 62,
        COLLECTION_HAS_TAG = 63,
        COLLECTION_SET_TAG = 64,
        COLLECTION_GET_TAG_ENTRY = 65,
        GET_CONNECTIONS = 66,
        GET_CONNECTION_INFO = 67,
        KICK_CONNECTION = 68,
    }

}
