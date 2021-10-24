export enum ApiMessageType {
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
}
