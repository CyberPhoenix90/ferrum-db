using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace master_record {


    class DatabaseManager {
        private Dictionary<string, Database> databases;
        private BinaryWriter writer;
        private string path;
        private string folder;

        public DatabaseManager(string path) {
            this.path = path;
            this.folder = Path.GetDirectoryName(path);

            this.databases = new Dictionary<string, Database>();

            if (File.Exists(path)) {
                using (BinaryReader reader = new BinaryReader(File.Open(path, FileMode.Open))) {
                    while (reader.PeekChar() != -1) {
                        this.readDatabase(reader);
                    }
                }
            }

            this.writer = new BinaryWriter(File.Open(path, FileMode.OpenOrCreate));
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
        }

        public bool hasDatabase(string name) {
            return this.databases.ContainsKey(name);
        }

        public void compact() {
            foreach (Database database in this.databases.Values) {
                database.compact();
            }
        }

        public void clear()
        {
            foreach (string database in this.databases.Keys)
            {
                this.deleteDatabase(database);
            }
        }

        public string[] getDatabases() {
            var array = new string[this.databases.Count];
            this.databases.Keys.CopyTo(array, 0);
            return array;
        }

        public Database addDatabase(string name) {
            Console.WriteLine($"Creating Database {name}");
            //Forbid all characters that are not allowed as part of a file name
            if (name.Any(c => Path.GetInvalidFileNameChars().Contains(c)))
            {
                throw new ArgumentException("Invalid database name. Must not include any characters that aren't allowed in file names");
            }

            var pos = this.writer.BaseStream.Position;
            Directory.CreateDirectory(Path.Join(this.folder, name));
            var database = new Database(Path.Join(this.folder, name), name, pos);
            this.databases.TryAdd(name, database);
            this.writer.Write(false);
            this.writer.Write(name);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.Flush();
            this.writer.Write(true);
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            this.writer.Flush();

            return database;
        }

        public Database? getDatabase(string name) {
            Database? database;
            this.databases.TryGetValue(name, out database);
            return database;
        }

        public void deleteDatabase(string name) {
            Database? database;
            this.databases.TryGetValue(name, out database);
            if (database!= null) {
                this.writer.BaseStream.Position = database.pos;
                this.writer.Write(false);
                this.writer.BaseStream.Seek(0, SeekOrigin.End);
                this.databases.Remove(name);
                database.dispose();
                Console.WriteLine($"Deleting database {name} at {Path.Join(this.folder, database.name)}");
                Directory.Delete(Path.Join(this.folder, database.name), true);
            } else {
                throw new Exception("Illegal state");
            }
        }

        private void readDatabase(BinaryReader reader) {
            var pos = reader.BaseStream.Position;
            var isAlive = reader.ReadBoolean();
            var name = reader.ReadString();
            if (!isAlive) {
                reader.BaseStream.Seek(4, SeekOrigin.Current);
                return;
            }
            this.databases.TryAdd(name, new Database(Path.Join(this.folder, name), name, pos));
        }
    }
}
