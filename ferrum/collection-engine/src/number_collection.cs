using System;
using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class NumberCollection : Collection {
    private SortedDictionary<long, EntryMetadata> data = [];

    protected NumberCollection(IOEngine io, string folder) : base(io, folder) { }

    public static NumberCollection Create(IOEngine io, string folder, CollectionConfiguration config) {
        var collection = new NumberCollection(io, folder);
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

    public static NumberCollection Load(IOEngine io, string folder) {
        var collection = new NumberCollection(io, folder);
        collection.LoadPageFiles();
        return collection;
    }

    public override CollectionKeyType GetKeyType() {
        return CollectionKeyType.NumberCollection;
    }
}