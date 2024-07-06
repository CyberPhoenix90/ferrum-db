export declare enum CollectionKeyType {
    'STRING' = "string",
    'NUMBER' = "number"
}
export declare enum CollectionValueType {
    JSON = "json",
    BINARY = "binary",
    STRING = "string",
    BOOLEAN = "boolean",
    INT64 = "int64",
    FLOAT64 = "float64",
    REAL = "real",
    NDJSON = "ndjson",
    VOID = "void"
}
export declare enum CollectionCompression {
    NONE = "none",
    LZ4 = "lz4",
    ZSTD = "zstd"
}
export declare enum CollectionPersistence {
    PERSISTENT = "persistent",
    VOLATILE = "volatile"
}
export declare enum CollectionEvictionStrategy {
    LRU = "lru",
    LFU = "lfu",
    FIFO = "fifo"
}
//# sourceMappingURL=collection_types.d.mts.map