using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ferrum_db_server.src.db.collections {

    public class TimeSeries : AbstractCollection {
        private readonly uint pageSize;
        private Dictionary<uint, PageFile> pageFiles;
        private Dictionary<string, SortedDictionary<long, IndexEntryMetadata>> contentMap;
        private PageFile? activePageFile;
        private uint nextPageFile;

        public TimeSeries(string path, long pos, string name, uint pageSize, Set? transactionSet, Index? collectionTags) : base("records.timeseries", CollectionType.TIME_SERIES, collectionTags) {
            this.pageFiles = new Dictionary<uint, PageFile>();
            this.contentMap = new Dictionary<string, SortedDictionary<long, IndexEntryMetadata>>(10000);
            this.path = path;
            this.pos = pos;
            this.name = name;
            this.pageSize = pageSize;
            initialize(transactionSet);
        }
        protected override void initialize(Set? transactionSet) {
            this.nextPageFile = 0;
            base.initialize(transactionSet);
        }

        public void compact() {
            var pages = new HashSet<string>();
            foreach (var page in Directory.GetFiles(this.path).Where(x => x.EndsWith(".page"))) {
                pages.Add(page.Substring(this.path.Length + 1, page.Length - 5 - this.path.Length - 1));
            }

            foreach (var record in this.contentMap) {
                foreach (var entry in record.Value) {
                    pages.Remove(entry.Value.pageFile.ToString());

                }
            }

            foreach (var unusedPage in pages) {
                PageFile? page;
                this.pageFiles.TryGetValue(uint.Parse(unusedPage), out page);
                if (page == null) {
                    File.Delete(Path.Join(this.path, unusedPage + ".page"));

                }
                else {
                    page.delete();
                    this.pageFiles.Remove(uint.Parse(unusedPage));
                }
            }
        }

        public void dispose() {
            this.contentMap.Clear();
            this.writer.Close();
            foreach (var pageFile in this.pageFiles.Values) {
                pageFile.dispose();
            }
        }

        public bool has(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return false;
            }

            var entries = this.contentMap[key];
            return entries.ContainsKey(timestamp);
        }

        public bool hasSerie(string key) {
            return this.contentMap.ContainsKey(key);
        }

        public string[] getKeys() {
            var array = new string[this.contentMap.Count];
            this.contentMap.Keys.CopyTo(array, 0);
            return array;
        }

        public void clear() {
            this.contentMap.Clear();
            this.writer.Close();
            foreach (var pageFile in this.pageFiles.Values) {
                pageFile.delete();
            }
            Directory.Delete(this.path, true);

            this.initialize(null);
            this.pageFiles.Clear();
            this.nextPageFile = 0;

        }

        public void deleteSerie(string key, long transactionId) {
            if (this.contentMap.ContainsKey(key)) {
                foreach (var entry in this.contentMap[key]) {
                    delete(key, entry.Key, transactionId);
                }
            }
        }

        public void delete(string key, long timestamp, long transactionId) {
            IndexEntryMetadata? entry;
            SortedDictionary<long, IndexEntryMetadata>? serie;
            this.contentMap.TryGetValue(key, out serie);

            if (serie == null) {
                return;
            }

            serie.TryGetValue(timestamp, out entry);
            if (entry == null) {
                return;
            }
#if DEBUG
            Console.WriteLine($"Deleting record {key} from time series {this.name}");
#endif
            serie.Remove(timestamp);
            if (serie.Count() == 0) {
                this.contentMap.Remove(key);
            }

            if (transactionId != -1) {
                this.writer.BaseStream.Seek(entry.deleteBytePosInRecord - 8, SeekOrigin.Begin);
                this.writer.Write(transactionId);
                this.writer.Write((byte)2);
            }
            else {
                this.writer.BaseStream.Seek(entry.deleteBytePosInRecord, SeekOrigin.Begin);
                this.writer.Write(false);
            }

            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null) {
                throw new Exception("Illegal state");
            }
            else {
                if (entry.length >= pageFile.size)
                    pageFile.delete();
            }
        }

        public long? getNearestTimestamp(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return null;
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return null;
            }

            var entry = entries.First();
            if (entry.Key >= timestamp) {
                return entry.Key;
            }

            var distance = long.MaxValue;
            long? selected = null;

            foreach (var entry2 in entries) {
                var distance2 = Math.Abs(entry2.Key - timestamp);
                if (distance2 <= distance) {
                    distance = distance2;
                    selected = entry2.Key;
                }
                else {
                    break;
                }
            }

            return selected;
        }

        public byte[]? getNearestMatch(string key, long timestamp) {
            var match = getNearestTimestamp(key, timestamp);

            if (match == null) {
                return null;
            }

            return get(key, match.Value);
        }

        public long? getLatestTimestamp(string key) {
            if (!this.contentMap.ContainsKey(key)) {
                return null;
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return null;
            }

            return entries.Last().Key;
        }

        public byte[]? getLatestEntry(string key) {
            var timestamp = getLatestTimestamp(key);
            if (timestamp == null) {
                return null;
            }

            return get(key, timestamp.Value);
        }

        public long? getEarliestTimestamp(string key) {
            if (!this.contentMap.ContainsKey(key)) {
                return null;
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return null;
            }

            return entries.First().Key;
        }

        public byte[]? getEarliestEntry(string key) {
            var timestamp = getEarliestTimestamp(key);
            if (timestamp == null) {
                return null;
            }

            return get(key, timestamp.Value);
        }

        public List<long> getLastNTimestamps(string key, int n) {
            if (!this.contentMap.ContainsKey(key)) {
                return new List<long>();
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return new List<long>();
            }

            var result = new List<long>();
            var start = entries.Count() - n;
            var i = 0;
            foreach (var entry in entries) {
                if (i >= start) {
                    result.Add(entry.Key);
                }
                i++;
            }

            return result;
        }

        public List<byte[]> getLastNEntries(string key, int n) {
            var timestamps = getLastNTimestamps(key, n);

            var result = new List<byte[]>();
            foreach (var timestamp in timestamps) {
                var entry = get(key, timestamp);
                if (entry != null) {
                    result.Add(entry);
                }
            }

            return result;
        }

        public long? getFirstTimestampBeforeTimestamp(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return null;
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return null;
            }

            var entry = entries.First();
            if (entry.Key >= timestamp) {
                return null;
            }

            long? previous = null;
            foreach (var entry2 in entries) {
                if (entry2.Key > timestamp) {
                    return previous;
                }
                else {
                    previous = entry2.Key;
                }
            }

            return previous;
        }

        public byte[]? getFirstEntryBeforeTimestamp(string key, long timestamp) {
            var match = getFirstTimestampBeforeTimestamp(key, timestamp);

            if (match == null) {
                return null;
            }

            return get(key, match.Value);
        }

        public long? getFirstTimestampAfterTimestamp(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return null;
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return null;
            }

            var entry = entries.First();
            if (entry.Key >= timestamp) {
                return entry.Key;
            }

            foreach (var entry2 in entries) {
                if (entry2.Key >= timestamp) {
                    return entry2.Key;
                }
            }

            return null;

        }

        public byte[]? getFirstEntryAfterTimestamp(string key, long timestamp) {
            var match = getFirstTimestampAfterTimestamp(key, timestamp);

            if (match == null) {
                return null;
            }

            return get(key, match.Value);
        }

        public List<long> getTimestampsBetweenTimestamps(string key, long lower, long upper) {
            if (!this.contentMap.ContainsKey(key)) {
                return new List<long>();
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return new List<long>();
            }

            var result = new List<long>();

            foreach (var entry in entries) {
                if (entry.Key > upper) {
                    break;
                }
                if (entry.Key >= lower && entry.Key <= upper) {
                    result.Add(entry.Key);
                }
            }

            return result;
        }

        public List<byte[]> getEntriesBetweenTimestamps(string key, long lower, long upper) {
            var timestamps = getTimestampsBetweenTimestamps(key, lower, upper);

            var result = new List<byte[]>();
            foreach (var timestamp in timestamps) {
                var entry = get(key, timestamp);
                if (entry != null) {
                    result.Add(entry);
                }
            }

            return result;
        }

        public List<long> getTimestampsBeforeTimestamp(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return new List<long>();
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return new List<long>();
            }

            var result = new List<long>();

            foreach (var entry in entries) {
                if (entry.Key < timestamp) {
                    break;
                }
                result.Add(entry.Key);
            }

            return result;
        }

        public List<long> getTimestampsAfterTimestamp(string key, long timestamp) {
            if (!this.contentMap.ContainsKey(key)) {
                return new List<long>();
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return new List<long>();
            }

            var result = new List<long>();

            foreach (var entry in entries) {
                if (entry.Key >= timestamp) {
                    break;
                }
                result.Add(entry.Key);
            }

            return result;
        }

        public List<byte[]> getEntriesBeforeTimestamp(string key, long time) {
            var timestamps = getTimestampsBeforeTimestamp(key, time);

            var result = new List<byte[]>();
            foreach (var timestamp in timestamps) {
                var entry = get(key, timestamp);
                if (entry != null) {
                    result.Add(entry);
                }
            }

            return result;
        }

        public List<byte[]> getEntriesAfterTimestamp(string key, long time) {
            var timestamps = getTimestampsAfterTimestamp(key, time);

            var result = new List<byte[]>();
            foreach (var timestamp in timestamps) {
                var entry = get(key, timestamp);
                if (entry != null) {
                    result.Add(entry);
                }
            }

            return result;
        }

        public List<byte[]> getFullSerieEntries(string serie) {
            if (!this.contentMap.ContainsKey(serie)) {
                return new List<byte[]>();
            }

            var entries = this.contentMap[serie];
            var result = new List<byte[]>();

            foreach (var entry in entries) {
                var value = get(serie, entry.Key);
                if (value != null) {
                    result.Add(value);
                }
            }

            return result;
        }

        public long[] getFullSerie(string key) {
            if (!this.contentMap.ContainsKey(key)) {
                return new long[0];
            }

            var entries = this.contentMap[key];
            if (entries.Count() == 0) {
                return new long[0];
            }

            var array = new long[entries.Count];
            entries.Keys.CopyTo(array, 0);
            return array;
        }

        public byte[]? get(string key, long timestamp) {
#if DEBUG
            Console.WriteLine($"Getting record {key} from time series {this.name}");
#endif
            IndexEntryMetadata? entry;
            SortedDictionary<long, IndexEntryMetadata>? serie;

            this.contentMap.TryGetValue(key, out serie);
            if (serie == null) {
                return null;
            }

            serie.TryGetValue(timestamp, out entry);

            if (entry == null) {
                return null;
            }

            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null) {
                throw new Exception("Illegal state");
            }

            return pageFile.read(entry.pos, (uint)entry.length);
        }


        public byte[]? readChunk(string key, long timestamp, long offset, uint size) {
#if DEBUG
            Console.WriteLine($"Reading chunk of record {key} from time series {this.name} at {offset} size: {size} ");
#endif
            IndexEntryMetadata? entry;
            SortedDictionary<long, IndexEntryMetadata>? serie;

            this.contentMap.TryGetValue(key, out serie);
            if (serie == null) {
                return null;
            }

            serie.TryGetValue(timestamp, out entry);

            if (entry == null) {
                return null;
            }
            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null) {
                throw new Exception("Illegal state");
            }

            if (offset >= entry.length) {
                return new byte[0];
            }

            return pageFile.read(entry.pos + offset, Math.Min((uint)(entry.length - offset), size));
        }

        public byte[]? readUntil(string key, long timestamp, long offset, byte until) {
#if DEBUG
            Console.WriteLine($"Reading chunk of record {key} from time series {this.name} from {offset} until byte {until}");
#endif
            IndexEntryMetadata? entry;
            SortedDictionary<long, IndexEntryMetadata>? serie;

            this.contentMap.TryGetValue(key, out serie);
            if (serie == null) {
                return null;
            }

            serie.TryGetValue(timestamp, out entry);

            if (entry == null) {
                return null;
            }
            PageFile? pageFile;
            this.pageFiles.TryGetValue(entry.pageFile, out pageFile);
            if (pageFile == null) {
                throw new Exception("Illegal state");
            }

            if (offset >= entry.length) {
                return new byte[0];
            }

            return pageFile.readUntil(entry.pos + offset, entry.length, until);

        }

        public void set(string key, long timestamp, byte[] value, long transactionId) {
#if DEBUG
            Console.WriteLine($"Putting record {key} in index {this.name}");
#endif
            if (this.has(key, timestamp)) {
                this.delete(key, timestamp, transactionId);
            }

            var page = this.selectPageFile(key, value.Length);
            var locationOnPage = page.write(value);
#if DEBUG
            Console.WriteLine($"Page pointer moved from {locationOnPage} to {page.pos}");
#endif
            this.writeRecord(this.writer, key, timestamp, page.index, (uint)locationOnPage, value.Length, transactionId);
            var entry = new IndexEntryMetadata(page.index, (uint)locationOnPage, value.Length, this.writer.BaseStream.Position - 1);
            if (!this.contentMap.ContainsKey(key)) {
                this.contentMap.Add(key, new SortedDictionary<long, IndexEntryMetadata>());
            }
            this.contentMap[key].Add(timestamp, entry);
        }

        private void writeRecord(BinaryWriter output, string key, long timestamp, uint pageFile, uint pos, long length, long transactionId) {
            output.Write(key);
            output.Write(timestamp);
            output.Write(pageFile);
            output.Write(pos);
            output.Write(length);
            output.Write(transactionId);
            output.Write(true);
            output.Flush();
        }

        protected override void readRecords(BinaryReader reader, Set? transactionSet) {
            var commited = true;
            var key = reader.ReadString();
            var timestamp = reader.ReadInt64();
            var pageFileId = reader.ReadUInt32();
            if (!this.pageFiles.ContainsKey(pageFileId)) {
                var page = new PageFile(Path.Join(this.path, pageFileId.ToString() + ".page"), pageFileId, this.pageSize);
                if (pageFileId >= this.nextPageFile) {
                    this.nextPageFile = pageFileId + 1;
                }
                this.pageFiles.Add(pageFileId, page);
            }
            var posInPage = reader.ReadUInt32();
            var length = reader.ReadInt64();
            var transactionId = reader.ReadInt64();

            if (transactionId != -1 && transactionSet != null) {
                if (!transactionSet.has(transactionId.ToString())) {
                    commited = false;
                }
            }
            var isAlive = reader.ReadByte();

            if (isAlive == 1 && commited || isAlive == 2 && !commited) {
#if DEBUG
                Console.WriteLine($"Read record {key} at time {timestamp} from time series {this.name}");
#endif
                if (!this.contentMap.ContainsKey(key)) {
                    this.contentMap.TryAdd(key, new SortedDictionary<long, IndexEntryMetadata>());
                }
                this.contentMap[key].Add(timestamp, new IndexEntryMetadata(pageFileId, posInPage, length, -1));
            }
        }
        public int getRecordCount() {
            return this.contentMap.Count;
        }

        private PageFile selectPageFile(string key, int length) {
            if (this.activePageFile == null || (this.activePageFile.availableBytes < length && !this.activePageFile.isEmpty())) {
                this.activePageFile = this.createNewPageFile();
            }
            return this.activePageFile;
        }

        private PageFile createNewPageFile() {
            var page = new PageFile(Path.Join(this.path, this.nextPageFile.ToString() + ".page"), this.nextPageFile, this.pageSize);
            this.pageFiles.Add(this.nextPageFile, page);
            this.nextPageFile++;
            return page;
        }

        public long? getRecordSize(string key, long timestamp) {
            IndexEntryMetadata? entry;
            SortedDictionary<long, IndexEntryMetadata>? serie;

            this.contentMap.TryGetValue(key, out serie);
            if (serie == null) {
                return null;
            }

            serie.TryGetValue(timestamp, out entry);

            if (entry == null) {
                return null;
            }

            return entry.length;
        }

    }
}