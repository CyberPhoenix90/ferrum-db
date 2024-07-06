export var CollectionKeyType;
(function (CollectionKeyType) {
    CollectionKeyType["STRING"] = "string";
    CollectionKeyType["NUMBER"] = "number";
})(CollectionKeyType || (CollectionKeyType = {}));
export var CollectionValueType;
(function (CollectionValueType) {
    CollectionValueType["JSON"] = "json";
    CollectionValueType["BINARY"] = "binary";
    CollectionValueType["STRING"] = "string";
    CollectionValueType["BOOLEAN"] = "boolean";
    CollectionValueType["INT64"] = "int64";
    CollectionValueType["FLOAT64"] = "float64";
    CollectionValueType["REAL"] = "real";
    CollectionValueType["NDJSON"] = "ndjson";
    CollectionValueType["VOID"] = "void";
})(CollectionValueType || (CollectionValueType = {}));
export var CollectionCompression;
(function (CollectionCompression) {
    CollectionCompression["NONE"] = "none";
    CollectionCompression["LZ4"] = "lz4";
    CollectionCompression["ZSTD"] = "zstd";
})(CollectionCompression || (CollectionCompression = {}));
export var CollectionPersistence;
(function (CollectionPersistence) {
    CollectionPersistence["PERSISTENT"] = "persistent";
    CollectionPersistence["VOLATILE"] = "volatile";
})(CollectionPersistence || (CollectionPersistence = {}));
export var CollectionEvictionStrategy;
(function (CollectionEvictionStrategy) {
    CollectionEvictionStrategy["LRU"] = "lru";
    CollectionEvictionStrategy["LFU"] = "lfu";
    CollectionEvictionStrategy["FIFO"] = "fifo";
})(CollectionEvictionStrategy || (CollectionEvictionStrategy = {}));
//# sourceMappingURL=collection_types.mjs.map