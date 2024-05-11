using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class NumberCollection : Collection
{
    SortedDictionary<long, EntryMetadata> data = [];

    public NumberCollection(IOEngine io, string folder, string encoding, uint? pageSize) : base(io, folder, encoding, pageSize)
    {
    }
}
