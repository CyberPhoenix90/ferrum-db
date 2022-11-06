using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GrpcAPI.collection;

namespace ferrum_db_server.src.db.collections {

    public abstract class AbstractCollection {
        protected CollectionType type;
        protected string path;
        protected string name;
        public long pos;
        protected string recordFileName;
        protected BinaryWriter writer;

        private readonly Index? collectionTags;

        private string collectionTagKey;
        public AbstractCollection(string recordFileName, CollectionType type, string name, Index? collectionTags) {
            this.collectionTags = collectionTags;
            this.recordFileName = recordFileName;
            this.type = type;
            this.name = name;
            this.collectionTagKey = this.type.ToString() + '_' + this.name + '_';
        }

        public string[] getCollectionTags() {
            if (this.collectionTags == null) {
                return new string[0];
            }
            return this.collectionTags.getKeys()
                .Where(x => x.StartsWith(this.collectionTagKey))
                .Select(v => v.Substring(this.collectionTagKey.Length))
                .ToArray();
        }

        public void deleteCollectionTag(string key = "") {
            if (this.collectionTags != null) {
#if DEBUG
                Console.WriteLine($"Deleting Tag {key} from collection {this.name}");
#endif
                this.collectionTags.delete(this.collectionTagKey + key, -1);
            }
            else {
                throw new Exception("Collection tags not supported for this collection");
            }
        }

        public void setCollectionTag(string key, byte[] value) {
            if (this.collectionTags != null) {
                this.collectionTags.set(this.collectionTagKey + key, value, -1);
            }
            else {
                throw new Exception("Collection tags not supported for this collection");
            }
        }

        public bool hasCollectionTag(string key = "") {
            if (this.collectionTags != null) {
                return this.collectionTags.has(this.collectionTagKey + key);
            }
            else {
                throw new Exception("Collection tags not supported for this collection");
            }
        }

        public byte[] getCollectionTag(string key = "") {
            if (this.collectionTags != null) {
                var content = this.collectionTags.get(this.collectionTagKey + key);

                if (content == null) {
                    return new byte[0];
                }

                return content;
            }
            else {
                throw new Exception("Collection tags not supported for this collection");
            }
        }

        protected virtual void initialize(Set? transactionSet) {
            Console.WriteLine($"Initializing index {name}");
            Directory.CreateDirectory(this.path);
            if (Directory.Exists(Path.Join(this.path, "tmp"))) {
                Directory.Delete(Path.Join(this.path, "tmp"), true);
            }
            Directory.CreateDirectory(Path.Join(this.path, "tmp"));

            string record = Path.Join(this.path, this.recordFileName);
            if (File.Exists(record) && new FileInfo(record).Length > 0) {
                using (BinaryReader reader = new BinaryReader(File.Open(Path.Join(this.path, this.recordFileName), FileMode.Open))) {
                    while (reader.BaseStream.Position < reader.BaseStream.Length) {
                        this.readRecords(reader, transactionSet);
                    }
                }
            }

#if DEBUG
            Console.WriteLine($"New writer at {Path.Join(path, this.recordFileName)}");
#endif
            this.writer = new BinaryWriter(File.Open(Path.Join(path, this.recordFileName), FileMode.OpenOrCreate));
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
        }

        protected abstract void readRecords(BinaryReader reader, Set? transactionSet);

    }
}