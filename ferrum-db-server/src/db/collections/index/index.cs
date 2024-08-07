using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db_server.src.db.collections;
using GrpcAPI.collection;

namespace ferrum_db_server.src.db.collections
{

    public class Index : AbstractCollection
    {
        private readonly uint pageSize;
        private Dictionary<uint, PageFile> pageFiles;
        private Dictionary<string, IndexEntryMetadata> contentMap;
        private PageFile? activePageFile;
        private uint nextPageFile;

        public Index(string path, long pos, string name, uint pageSize, Set? transactionSet, Index? collectionTags) : base("records.index", CollectionType.Index, name, collectionTags)
        {
            this.pageFiles = new Dictionary<uint, PageFile>();
            this.contentMap = new Dictionary<string, IndexEntryMetadata>(10000);
            this.path = path;
            this.pos = pos;
            this.pageSize = pageSize;
            initialize(transactionSet);
        }

        protected override void initialize(Set? transactionSet)
        {
            this.nextPageFile = 0;
            base.initialize(transactionSet);
        }

        public void compact()
        {
            var pages = new HashSet<string>();
            foreach (var page in Directory.GetFiles(this.path).Where(x => x.EndsWith(".page")))
            {
                pages.Add(page.Substring(this.path.Length + 1, page.Length - 5 - this.path.Length - 1));
            }

            foreach (var record in this.contentMap)
            {
                pages.Remove(record.Value.pageFile.ToString());
            }

            foreach (var unusedPage in pages)
            {
                PageFile? page;
                this.pageFiles.TryGetValue(uint.Parse(unusedPage), out page);
                if (page == null)
                {
                    File.Delete(Path.Join(this.path, unusedPage + ".page"));

                }
                else
                {
                    page.delete();
                    this.pageFiles.Remove(uint.Parse(unusedPage));
                }
            }
        }

        protected override void readRecord(BinaryReader reader, Set? transactionSet)
        {
            var commited = true;
            string key;
            key = reader.ReadString();
            var pageFileId = reader.ReadUInt32();
            if (!this.pageFiles.ContainsKey(pageFileId))
            {
                var page = new PageFile(Path.Join(this.path, pageFileId.ToString() + ".page"), pageFileId, this.pageSize);
                if (pageFileId >= this.nextPageFile)
                {
                    this.nextPageFile = pageFileId + 1;
                }
                this.pageFiles.Add(pageFileId, page);
            }
            var posInPage = reader.ReadUInt32();
            var length = reader.ReadInt64();
            var transactionId = reader.ReadInt64();
            if (transactionId != -1 && transactionSet != null)
            {
                if (!transactionSet.has(transactionId.ToString()))
                {
                    commited = false;
                }
            }
            var isAlive = reader.ReadByte();
            if (isAlive == 1 && commited || isAlive == 2 && !commited)
            {
                this.contentMap.TryAdd(key, new IndexEntryMetadata(pageFileId, posInPage, length, reader.BaseStream.Position - 1));
            }

        }

        public void dispose()
        {
            this.contentMap.Clear();
            this.writer.Close();
            this.activePageFile = null;
            foreach (var pageFile in this.pageFiles.Values)
            {
                pageFile.dispose();
            }
        }

        public bool has(string key)
        {
            return this.contentMap.ContainsKey(key);
        }

        public string[] getKeys()
        {
            var array = new string[this.contentMap.Count];
            this.contentMap.Keys.CopyTo(array, 0);
            return array;
        }

        public void clear()
        {
            this.contentMap.Clear();
            this.writer.Close();
            this.activePageFile = null;
            foreach (var pageFile in this.pageFiles.Values)
            {
                pageFile.delete();
            }
            Directory.Delete(this.path, true);

            this.initialize(null);
            this.pageFiles.Clear();
            this.nextPageFile = 0;
        }

        public void delete(string key, long transactionId)
        {
            IndexEntryMetadata? entry;
            this.contentMap.TryGetValue(key, out entry);
            if (entry == null)
            {
                return;
            }
#if DEBUG
            Console.WriteLine($"Deleting record {key} from index {this.name}");
#endif
            this.contentMap.Remove(key);

            if (transactionId != -1)
            {
                this.writer.BaseStream.Seek(entry.deleteBytePosInRecord - 8, SeekOrigin.Begin);
                this.writer.Write(transactionId);
                this.writer.Write((byte)2);
            }
            else
            {
                this.writer.BaseStream.Seek(entry.deleteBytePosInRecord, SeekOrigin.Begin);
                this.writer.Write(false);
            }

            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null)
            {
                throw new Exception("Illegal state");
            }
            else
            {
                if (entry.length >= pageFile.size)
                    pageFile.delete();
            }
        }

        public byte[]? get(string key)
        {
#if DEBUG
            Console.WriteLine($"Getting record {key} from index {this.name}");
#endif
            IndexEntryMetadata? entry;
            this.contentMap.TryGetValue(key, out entry);
            if (entry == null)
            {
                return null;
            }
            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null)
            {
                throw new Exception("Illegal state");
            }

            return pageFile.read(entry.pos, (uint)entry.length);
        }


        public byte[]? readChunk(string key, long offset, uint size)
        {
#if DEBUG
            Console.WriteLine($"Reading chunk of record {key} from index {this.name} at {offset} size: {size} ");
#endif
            IndexEntryMetadata? entry;
            this.contentMap.TryGetValue(key, out entry);
            if (entry == null)
            {
                return null;
            }
            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null)
            {
                throw new Exception("Illegal state");
            }

            if (offset >= entry.length)
            {
                return new byte[0];
            }

            return pageFile.read(entry.pos + offset, Math.Min((uint)(entry.length - offset), size));
        }

        public byte[]? readUntil(string key, long offset, byte until)
        {
#if DEBUG
            Console.WriteLine($"Reading chunk of record {key} from index {this.name} from {offset} until byte {until}");
#endif
            IndexEntryMetadata? entry;
            this.contentMap.TryGetValue(key, out entry);
            if (entry == null)
            {
                return null;
            }
            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null)
            {
                throw new Exception("Illegal state");
            }

            if (offset >= entry.length)
            {
                return new byte[0];
            }

            return pageFile.readUntil(entry.pos + offset, entry.length, until);

        }

        public void set(string key, byte[] value, long transactionId)
        {
#if DEBUG
            Console.WriteLine($"Putting record {key} in index {this.name}");
#endif
            if (this.has(key))
            {
                this.delete(key, transactionId);
            }

            var page = this.selectPageFile(key, value.Length);
            var locationOnPage = page.write(value);
#if DEBUG
            Console.WriteLine($"Page pointer moved from {locationOnPage} to {page.pos}");
#endif
            this.writeRecord(this.writer, key, page.index, (uint)locationOnPage, value.Length, transactionId);
            var entry = new IndexEntryMetadata(page.index, (uint)locationOnPage, value.Length, this.writer.BaseStream.Position - 1);
            this.contentMap.Add(key, entry);
        }

        private void writeRecord(BinaryWriter output, string key, uint pageFile, uint pos, long length, long transactionId)
        {
            output.Write(key);
            output.Write(pageFile);
            output.Write(pos);
            output.Write(length);
            output.Write(transactionId);
            output.Write(true);
            output.Flush();
        }

        public int getRecordCount()
        {
            return this.contentMap.Count;
        }

        private PageFile selectPageFile(string key, int length)
        {
            if (this.activePageFile == null || (this.activePageFile.availableBytes < length && !this.activePageFile.isEmpty()))
            {
                this.activePageFile = this.createNewPageFile();
            }
            return this.activePageFile;
        }

        private PageFile createNewPageFile()
        {
            var page = new PageFile(Path.Join(this.path, this.nextPageFile.ToString() + ".page"), this.nextPageFile, this.pageSize);
            this.pageFiles.Add(this.nextPageFile, page);
            this.nextPageFile++;
            return page;
        }

        public long? getRecordSize(string key)
        {
            IndexEntryMetadata? entry;
            this.contentMap.TryGetValue(key, out entry);
            if (entry == null)
            {
                return null;
            }

            return entry.length;
        }

    }
}