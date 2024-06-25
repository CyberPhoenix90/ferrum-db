namespace ferrum_collection_engine;

public enum CollectionKeyType
{
    StringCollection = 0,
    NumberCollection = 1,

}

public enum CompressionAlgorithm
{
    None = 0,
    Lz4 = 1,
    Zstd = 2,
}


public enum ValueEncodingType
{
    Binary = 0,
    String = 1,
    Integer = 2,
    Float = 3,
    Boolean = 4,
    Json = 5,
    Real = 6,
    NdJson = 7,
    Void = 8,
}


public enum EvictionPolicy
{
    Lru = 0,
    Lfu = 1,
    Fifo = 2,
}

public enum Persistence
{
    Persisted = 0,
    InMemory = 1,
}



public record CollectionConfiguration
{
    public required string Name { get; init; }
    public required CollectionKeyType KeyType { get; init; }
    public required ValueEncodingType ValueEncoding { get; init; }
    public required CompressionAlgorithm Compression { get; init; }
    public int? MaxSize { get; init; }
    public int? MaxItems { get; init; }
    public uint? PageSize { get; init; }
    public float? Overprovision { get; init; }
    public EvictionPolicy? evictionPolicy { get; init; }
    public required Persistence Persistence { get; init; }

}