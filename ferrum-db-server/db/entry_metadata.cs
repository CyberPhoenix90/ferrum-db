using System;

namespace entry_metadat {
    public class EntryMetadata {
        public readonly uint pageFile;
        public readonly uint pos;
        public readonly long length;
        public readonly long deleteBytePosInRecord;

        public EntryMetadata(uint pageFile, uint pos, long length, long deleteBytePosInRecord) {
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