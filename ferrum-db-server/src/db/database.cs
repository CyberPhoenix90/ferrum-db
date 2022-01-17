using System;
using System.Collections.Generic;
using System.IO;
using ferrum_db_server.src.db.collections;
using ferrum_db_server.src.server.protocol;
using Index = ferrum_db_server.src.db.collections.Index;

namespace master_record {


    public class Database {

        private static int Version = 0;
        private Dictionary<string, Index> indexes;
        private Dictionary<string, Set> sets;
        private Dictionary<string, TimeSeries> timeSeries;
        private BinaryWriter writer;
        private string path;
        private string folder;
        public string name;
        public readonly long pos;
        private Set? transactionSet;
        private Index? collectionTags;

        public Database(string path, string name, long pos, Set? transactionSet, Index? collectionTags) {
            bool isNew;
            this.path = Path.Join(path, "indexes.bin");
            this.folder = path;
            this.name = name;
            this.pos = pos;
            this.indexes = new Dictionary<string, Index>();
            this.sets = new Dictionary<string, Set>();
            this.timeSeries = new Dictionary<string, TimeSeries>();
            this.transactionSet = transactionSet;
            this.collectionTags = collectionTags;
        }

        public void initializeDatabase() {
            bool isNew;
            if (File.Exists(this.path)) {
                isNew = false;
                Console.WriteLine($"Initializing database {name}...");
                using (BinaryReader reader = new BinaryReader(File.Open(this.path, FileMode.Open))) {
                    var version = reader.ReadInt32();
                    if (version > Database.Version) {
                        throw new Exception($"Database version {version} is newer than supported version {Database.Version}");
                    }
                    while (reader.PeekChar() != -1) {
                        this.readCollection(reader);
                    }
                }
            }
            else {
                isNew = true;
#if DEBUG
                Console.WriteLine($"New database {name} at {pos}");
#else
                Console.WriteLine($"New database {name}");
#endif
            }


            this.writer = new BinaryWriter(File.Open(this.path, FileMode.OpenOrCreate));
            if (isNew) {
                this.writeHeader();

            }
            else {
                this.writer.BaseStream.Seek(0, SeekOrigin.End);

            }

        }

        private void writeHeader() {
            this.writer.Write(Database.Version);
        }

        public IEnumerator<string> iterateIndexes() {
            return this.indexes.Keys.GetEnumerator();
        }

        public bool hasIndex(string name) {
            return this.indexes.ContainsKey(name);
        }

        public bool hasSet(string name) {
            return this.sets.ContainsKey(name);
        }

        public bool hasTimeSeries(string name) {
            return this.timeSeries.ContainsKey(name);
        }

        public void compact() {
            foreach (Index index in this.indexes.Values) {
                index.compact();
            }
        }

        public void clear() {
            foreach (string index in this.indexes.Keys) {
                this.deleteIndex(index);
            }
            foreach (string set in this.sets.Keys) {
                this.deleteSet(set);
            }
        }

        public string[] getSets() {
            var array = new string[this.sets.Count];
            this.sets.Keys.CopyTo(array, 0);
            return array;
        }

        public string[] getIndexes() {
            var array = new string[this.indexes.Count];
            this.indexes.Keys.CopyTo(array, 0);
            return array;
        }

        public string[] getTimeSeries() {
            var array = new string[this.timeSeries.Count];
            this.timeSeries.Keys.CopyTo(array, 0);
            return array;
        }

        public Index addIndexIfNotExist(string name, uint pageSize) {
            if (this.hasIndex(name)) {
                return this.getIndex(name)!;
            }
            else {
                return this.addIndex(name, pageSize);
            }
        }

        public Set addSetIfNotExist(string name) {
            if (this.hasSet(name)) {
                return this.getSet(name)!;
            }
            else {
                return this.addSet(name);
            }
        }

        public TimeSeries addTimeSeriesIfNotExist(string name, uint pageSize) {
            if (this.hasTimeSeries(name)) {
                return this.getTimeSeries(name)!;
            }
            else {
                return this.addTimeSeries(name, pageSize);
            }
        }

        public TimeSeries addTimeSeries(string name, uint pageSize) {
            if (this.hasTimeSeries(name)) {
                throw new Exception($"Time series {name} already exists");
            }

            if (pageSize < 1024 * 1024) {
                pageSize = 1024 * 1024;
            }

            var pos = this.writer.BaseStream.Position;
            var timeSeries = new TimeSeries(Path.Join(this.folder, pos.ToString()), pos, name, pageSize, this.transactionSet, this.collectionTags);
            this.timeSeries.TryAdd(name, timeSeries);
            this.writer.Write(false);
            this.writer.Write(name);
            this.writer.Write((byte)2);
            this.writer.Write(pageSize);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            //For writing to disk to be atomic you have to "commit" the written content with a single write command as a result we use the delete byte to indicate whether
            //the written content was completed or not
            this.writer.Write(true);
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            return timeSeries;
        }

        public Set addSet(string name) {
            if (this.hasSet(name)) {
                throw new Exception($"Set {name} already exists");
            }

            var pos = this.writer.BaseStream.Position;
            var set = new Set(Path.Join(this.folder, pos.ToString()), pos, name, this.transactionSet, this.collectionTags);
            this.sets.TryAdd(name, set);
            this.writer.Write(false);
            this.writer.Write(name);
            this.writer.Write((byte)1);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.Write(true);
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            return set;
        }

        public Index addIndex(string name, uint pageSize) {
            if (this.hasIndex(name)) {
                throw new Exception($"Failed to create Duplicate index {name}");
            }

            if (pageSize < 1024 * 1024) {
                pageSize = 1024 * 1024;
            }

            var pos = this.writer.BaseStream.Position;
            var index = new Index(Path.Join(this.folder, pos.ToString()), pos, name, pageSize, this.transactionSet, this.collectionTags);
            this.indexes.TryAdd(name, index);
            this.writer.Write(false);
            this.writer.Write(name);
            this.writer.Write((byte)0);
            this.writer.Write(pageSize);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            //For writing to disk to be atomic you have to "commit" the written content with a single write command as a result we use the delete byte to indicate whether
            //the written content was completed or not
            this.writer.Write(true);
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            return index;
        }

        public AbstractCollection? getCollection(string collectionKey, CollectionType type) {
            switch (type) {
                case CollectionType.INDEX:
                    return this.getIndex(collectionKey);
                case CollectionType.SET:
                    return this.getSet(collectionKey);
                case CollectionType.TIME_SERIES:
                    return this.getTimeSeries(collectionKey);
                default:
                    return null;
            }
        }

        public Index? getIndex(string name) {
            this.indexes.TryGetValue(name, out Index? index);
            return index;
        }

        public Set? getSet(string name) {
            this.sets.TryGetValue(name, out Set? set);
            return set;
        }

        public TimeSeries? getTimeSeries(string name) {
            this.timeSeries.TryGetValue(name, out TimeSeries? timeSeries);
            return timeSeries;
        }

        public void deleteIndex(string name) {
            this.indexes.TryGetValue(name, out Index? index);
            if (index != null) {
                this.writer.BaseStream.Position = index.pos;
                this.writer.Write(false);
                this.writer.BaseStream.Seek(0, SeekOrigin.End);
                this.indexes.Remove(name);
                index.clear();
                Console.WriteLine($"Deleting index {name} at {Path.Join(this.folder, index.pos.ToString())}");
                Directory.Delete(Path.Join(this.folder, index.pos.ToString()), true);
            }
            else {
                throw new Exception("Illegal state");
            }
        }

        public void deleteTimeSeries(string name) {
            this.timeSeries.TryGetValue(name, out TimeSeries? timeSeries);
            if (timeSeries != null) {
                this.writer.BaseStream.Position = timeSeries.pos;
                this.writer.Write(false);
                this.writer.BaseStream.Seek(0, SeekOrigin.End);
                this.indexes.Remove(name);
                timeSeries.clear();
                Console.WriteLine($"Deleting index {name} at {Path.Join(this.folder, timeSeries.pos.ToString())}");
                Directory.Delete(Path.Join(this.folder, timeSeries.pos.ToString()), true);
            }
            else {
                throw new Exception("Illegal state");
            }
        }

        public void deleteSet(string name) {
            this.sets.TryGetValue(name, out Set? set);
            if (set != null) {
                this.writer.BaseStream.Position = set.pos;
                this.writer.Write(false);
                this.writer.BaseStream.Seek(0, SeekOrigin.End);
                this.indexes.Remove(name);
                set.clear();
                Console.WriteLine($"Deleting index {name} at {Path.Join(this.folder, set.pos.ToString())}");
                Directory.Delete(Path.Join(this.folder, set.pos.ToString()), true);
            }
            else {
                throw new Exception("Illegal state");
            }
        }

        public void dispose() {
            foreach (var index in this.indexes.Values) {
                index.dispose();
            }
            foreach (var set in this.sets.Values) {
                set.dispose();
            }
            this.writer.Close();
        }

        private void readCollection(BinaryReader reader) {
            var pos = reader.BaseStream.Position;
            var isAlive = reader.ReadBoolean();
            var name = reader.ReadString();
            var type = reader.ReadByte();
            if (type == 0) {
                var pageSize = reader.ReadUInt32();
                if (isAlive) {
                    this.indexes.TryAdd(name, new Index(Path.Join(this.folder, pos.ToString()), pos, name, pageSize, this.transactionSet, this.collectionTags));
                }
            }
            else if (type == 1) {
                if (isAlive) {
                    this.sets.TryAdd(name, new Set(Path.Join(this.folder, pos.ToString()), pos, name, this.transactionSet, this.collectionTags));
                }
            }
            else if (type == 2) {
                var pageSize = reader.ReadUInt32();
                if (isAlive) {
                    this.timeSeries.TryAdd(name, new TimeSeries(Path.Join(this.folder, pos.ToString()), pos, name, pageSize, this.transactionSet, this.collectionTags));
                }
            }
        }

    }

}
