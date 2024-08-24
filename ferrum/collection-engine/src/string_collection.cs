using System;
using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class StringCollection : Collection
{
    Dictionary<string, EntryMetadata> data = [];

    private StringCollection(IOEngine io, string folder) : base(io, folder)
    {
    }

    public static StringCollection Create(IOEngine io, string folder, CollectionConfiguration config)
    {
        var collection = new StringCollection(io, folder);
        if (!io.Exists(folder))
        {
            io.mkdir(folder);
        }
        else
        {
            throw new Exception("Collection folder already exists");
        }

        if (config.PageSize != null)
        {
            if (config.PageSize >= MIN_PAGE_SIZE)
                collection.pageSize = (uint)(config.PageSize * 1024 * 1024);
            else
            {
                collection.pageSize = MIN_PAGE_SIZE;
            }
        }
        else if (config.PageSize == null)
        {
            collection.pageSize = Collection.DEFAULT_PAGE_SIZE;
        }
        return collection;
    }

    public static StringCollection Load(IOEngine io, string folder)
    {
        var collection = new StringCollection(io, folder);
        collection.loadPageFiles();
        return collection;
    }

}
