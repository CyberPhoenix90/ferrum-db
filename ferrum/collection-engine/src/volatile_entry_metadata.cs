using System;

namespace ferrum_collection_engine;
public class VolatileEntryMetadata : EntryMetadata
{
    public DateTime lastAccessed = DateTime.Now;
    public uint accessCount = 0;
    public VolatileEntryMetadata(uint pageFile, uint pos) : base(pageFile, pos)
    {

    }
}
