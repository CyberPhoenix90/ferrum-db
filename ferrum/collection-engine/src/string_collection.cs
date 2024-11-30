using System;
using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class StringCollection<T> : Collection {
    private readonly Dictionary<string, EntryMetadata> data = [];

    private StringCollection(IOEngine io, string folder) : base(io, folder) { }

    public static StringCollection<T> Create(IOEngine io, string folder, CollectionConfiguration config) {
        var collection = new StringCollection<T>(io, folder);
        if (!io.Exists(folder))
            io.mkdir(folder);
        else
            throw new Exception("Collection folder already exists");

        if (config.PageSize != null) {
            if (config.PageSize >= MIN_PAGE_SIZE)
                collection.pageSize = (uint)(config.PageSize * 1024 * 1024);
            else
                collection.pageSize = MIN_PAGE_SIZE;
        }
        else if (config.PageSize == null) {
            collection.pageSize = DEFAULT_PAGE_SIZE;
        }

        return collection;
    }

    public static StringCollection<T> Load(IOEngine io, string folder) {
        var collection = new StringCollection<T>(io, folder);
        collection.LoadPageFiles();
        return collection;
    }

    public override CollectionKeyType GetKeyType() {
        return CollectionKeyType.StringCollection;
    }

    public T Get(string key) {
        var entryMetadata = data[key];

        if (entryMetadata == null) throw new Exception($"No entry found for {key}");

        return ReadAndDecodeEntry(entryMetadata);
    }

    public T? GetOrNull(string key) {
        data.TryGetValue(key, out var entryMetadata);

        if (entryMetadata == null) return null;

        return ReadAndDecodeEntry(entryMetadata);
    }

    private T ReadAndDecodeEntry(EntryMetadata metadata) { }

    public bool Has(string key) {
        return data.ContainsKey(key);
    }
}