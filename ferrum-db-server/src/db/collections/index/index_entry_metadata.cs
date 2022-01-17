using System;

namespace ferrum_db_server.src.db.collections {
    public class IndexEntryMetadata {
        public readonly uint pageFile;
        public readonly uint pos;
        public readonly long length;
        public readonly long deleteBytePosInRecord;

        public IndexEntryMetadata(uint pageFile, uint pos, long length, long deleteBytePosInRecord) {
            this.pageFile = pageFile;
            this.pos = pos;
            this.length = length;
            this.deleteBytePosInRecord = deleteBytePosInRecord;
#if DEBUG
            Console.WriteLine($"Created record reference page file {pageFile} ptr {pos} len {length}");
#endif
        }
    }
}