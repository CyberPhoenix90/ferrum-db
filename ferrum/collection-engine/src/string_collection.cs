using System.Collections.Generic;
using ferrum_io_engine;

namespace ferrum_collection_engine;

public class StringCollection : Collection
{
    Dictionary<string, EntryMetadata> data = [];

    public StringCollection(IOEngine io, string folder, string encoding, uint? pageSize) : base(io, folder, encoding, pageSize)
    {
    }
}
