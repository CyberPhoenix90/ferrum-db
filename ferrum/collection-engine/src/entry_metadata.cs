namespace ferrum_collection_engine;

public class EntryMetadata {
    public readonly uint pageFile;
    public readonly uint pos;

    public EntryMetadata(uint pageFile, uint pos) {
        this.pageFile = pageFile;
        this.pos = pos;
    }
}