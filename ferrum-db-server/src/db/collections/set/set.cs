using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using GrpcAPI.collection;

namespace ferrum_db_server.src.db.collections {

    public class Set : AbstractCollection {
        private Dictionary<string, long> contentSet;

        public Set(string path, long pos, string name, Set? transactionSet, Index? collectionTags) : base("records.set", CollectionType.Set, name, collectionTags) {
            this.contentSet = new Dictionary<string, long>(5000);
            this.path = path;
            this.pos = pos;
            initialize(transactionSet);
        }

        public void compact() {
        }

        protected override void readRecords(BinaryReader reader, Set? transactionSet) {
            var commited = true;

            var key = reader.ReadString();
            var transactionId = reader.ReadInt64();
            if (transactionId != -1 && transactionSet != null) {
                if (!transactionSet.has(transactionId.ToString())) {
                    commited = false;
                }
            }
            var isAlive = reader.ReadByte();
            if (isAlive == 1 && commited || isAlive == 2 && !commited) {
                this.contentSet.TryAdd(key, reader.BaseStream.Position - 1);
            }
        }

        public void dispose() {
            this.contentSet.Clear();
            this.writer.Close();
        }

        public bool has(string key) {
            return this.contentSet.Keys.Contains(key);
        }

        public string[] getKeys() {
            var array = new string[this.contentSet.Count];
            this.contentSet.Keys.CopyTo(array, 0);
            return array;
        }

        public void clear() {
            this.contentSet.Clear();
            this.writer.Close();
            Directory.Delete(this.path, true);

            this.initialize(null);
        }

        public void delete(string key, long transactionId) {
            if (this.contentSet.ContainsKey(key) == false) {
                return;
            }
#if DEBUG
            Console.WriteLine($"Deleting record {key} from set {this.name}");
#endif
            var pos = this.contentSet[key];
            this.contentSet.Remove(key);
            if (transactionId != -1) {
                this.writer.BaseStream.Seek(pos - 8, SeekOrigin.Begin);
                this.writer.Write(transactionId);
                this.writer.Write((byte)2);
            }
            else {
                this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
                this.writer.Write(false);
            }

            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();
        }

        public void add(string key, long transactionId) {
#if DEBUG
            Console.WriteLine($"Putting record {key} in set {this.name}");
#endif
            if (!this.has(key)) {
                this.writeRecord(this.writer, key, transactionId);
                this.contentSet.TryAdd(key, this.writer.BaseStream.Position - 1);
            }

        }

        private void writeRecord(BinaryWriter output, string key, long transactionId) {
            output.Write(key);
            output.Write(transactionId);
            output.Write(true);
            output.Flush();
        }

        public int getRecordCount() {
            return this.contentSet.Count;
        }
    }
}