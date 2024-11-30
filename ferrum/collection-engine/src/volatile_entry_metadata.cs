using System;

namespace ferrum_collection_engine;

public class VolatileEntryMetadata : EntryMetadata {
    public uint accessCount = 0;
    public DateTime lastAccessed = DateTime.Now;
    public VolatileEntryMetadata(uint pageFile, uint pos) : base(pageFile, pos) { }
}