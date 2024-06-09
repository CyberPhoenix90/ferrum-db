export enum CollectionKeyType {
    'STRING' = 'string',
    'NUMBER' = 'number',
}

export enum CollectionValueType {
    JSON = 'json',
    BINARY = 'binary',
    STRING = 'string',
    BOOLEAN = 'boolean',
    INT64 = 'int64',
    FLOAT64 = 'float64',
    REAL = 'real',
    NDJSON = 'ndjson',
    VOID = 'void',
}

export enum CollectionCompression {
    NONE = 'none',
    LZ4 = 'lz4',
    ZSTD = 'zstd',
}

export enum CollectionPersistence {
    PERSISTENT = 'persistent',
    VOLATILE = 'volatile',
}

export enum CollectionEvictionStrategy {
    LRU = 'lru',
    LFU = 'lfu',
    FIFO = 'fifo',
}
