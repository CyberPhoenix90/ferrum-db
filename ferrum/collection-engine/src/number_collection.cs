using System;
using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class NumberCollection : Collection
{
    SortedDictionary<long, EntryMetadata> data = [];

    protected NumberCollection(IOEngine io, string folder) : base(io, folder)
    {
    }

    public static NumberCollection Create(IOEngine io, string folder, CollectionConfiguration config)
    {
        var collection = new NumberCollection(io, folder);
        if (!io.Exists(folder))
        {
            io.mkdir(folder);
        }
        else
        {
            throw new Exception("Collection folder already exists");
        }

        if (config.PageSize != null && config.PageSize >= 16)
        {
            collection.pageSize = (uint)(config.PageSize * 1024 * 1024);
        }
        else
        {
            collection.pageSize = Collection.DEFAULT_PAGE_SIZE;
        }
        return collection;
    }

    public static NumberCollection Load(IOEngine io, string folder)
    {
        var collection = new NumberCollection(io, folder);
        collection.loadPageFiles();
        return collection;
    }

}
