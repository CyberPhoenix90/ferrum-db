using System;
using System.Collections.Generic;
using System.IO;

namespace master_record
{


    class Database
    {
        private Dictionary<string, Index> indexes;
        private BinaryWriter writer;
        private string path;
        private string folder;
        public string name;
        public readonly long pos;

        public Database(string path, string name, long pos)
        {
            this.path = Path.Join(path, "indexes.bin");
            this.folder = path;
            this.name = name;
            this.pos = pos;
            this.indexes = new Dictionary<string, Index>();

            if (File.Exists(this.path))
            {
                Console.WriteLine($"Initializing database {name}...");
                using (BinaryReader reader = new BinaryReader(File.Open(this.path, FileMode.Open)))
                {
                    while (reader.PeekChar() != -1)
                    {
                        this.readIndex(reader);
                    }
                }
            }
            else
            {
                Console.WriteLine($"New database {name}");
            }


            this.writer = new BinaryWriter(File.Open(this.path, FileMode.OpenOrCreate));
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
        }

        public IEnumerator<string> iterateIndexes()
        {
            return this.indexes.Keys.GetEnumerator();
        }

        public bool hasIndex(string name)
        {
            return this.indexes.ContainsKey(name);
        }

        public void compact()
        {
            foreach (Index index in this.indexes.Values)
            {
                index.compact();
            }
        }

        public void clear()
        {
            foreach (string index in this.indexes.Keys)
            {
                this.deleteIndex(index);
            }
        }

        public string[] getIndexes()
        {
            var array = new string[this.indexes.Count];
            this.indexes.Keys.CopyTo(array, 0);
            return array;
        }

        public Index addIndexIfNotExist(string name, uint pageSize)
        {
            if (this.hasIndex(name))
            {
                return this.getIndex(name);
            }
            else
            {
                return this.addIndex(name, pageSize);
            }
        }

        public Index addIndex(string name, uint pageSize)
        {
            if (this.hasIndex(name))
            {
                throw new Exception($"Failed to create Duplicate index {name}");
            }

            if (pageSize < 1024 * 8)
            {
                pageSize = 1024 * 8;
            }

            var pos = this.writer.BaseStream.Position;
            var index = new Index(Path.Join(this.folder, pos.ToString()), pos, name, pageSize);
            this.indexes.TryAdd(name, index);
            this.writer.Write(false);
            this.writer.Write(name);
            this.writer.Write(pageSize);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.Flush();
            this.writer.Write(true);
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            return index;
        }

        public Index? getIndex(string name)
        {
            Index? index;
            this.indexes.TryGetValue(name, out index);
            return index;
        }

        public void deleteIndex(string name)
        {
            Index? index;
            this.indexes.TryGetValue(name, out index);
            if (index != null)
            {
                this.writer.BaseStream.Position = index.pos;
                this.writer.Write(false);
                this.writer.BaseStream.Seek(0, SeekOrigin.End);
                this.indexes.Remove(name);
                index.dispose();
                Console.WriteLine($"Deleting index {name} at {Path.Join(this.folder, index.pos.ToString())}");
                Directory.Delete(Path.Join(this.folder, index.pos.ToString()), true);
            }
            else
            {
                throw new Exception("Illegal state");
            }
        }

        public void dispose()
        {
            this.clear();
            this.writer.Dispose();
        }

        private void readIndex(BinaryReader reader)
        {
            var pos = reader.BaseStream.Position;
            var isAlive = reader.ReadBoolean();
            var name = reader.ReadString();
            if (!isAlive)
            {
                reader.BaseStream.Seek(4, SeekOrigin.Current);
                return;
            }
            var pageSize = reader.ReadUInt32();
            this.indexes.TryAdd(name, new Index(Path.Join(this.folder, pos.ToString()), pos, name, pageSize));
        }
    }
}
