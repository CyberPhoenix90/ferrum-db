using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db_server.db;

namespace master_record {


    public class DatabaseManager {
        private Database internalDatabase;
        private Dictionary<string, Database> databases;
        private BinaryWriter writer;
        private string path;
        private string folder;
        private Set transactionSet;
        private Index transactionIdIndex;

        public DatabaseManager(string path) {
            this.path = path;
            this.folder = Path.GetDirectoryName(path);

            this.databases = new Dictionary<string, Database>();
            Directory.CreateDirectory(Path.Join(this.folder, "$$internal"));
            this.internalDatabase = new Database(Path.Join(this.folder, "$$internal"), "$$internal", 0, null);
            this.transactionSet = this.internalDatabase.addSetIfNotExist("transactions");
            this.transactionIdIndex = this.internalDatabase.addIndexIfNotExist("transactionIds", 0);


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

        public long performTransaction(DatabaseOperation[] operations) {
            long id;

            if (!this.transactionIdIndex.has("id")) {
                id = 0;
            } else {
                id = new BinaryReader(new MemoryStream(this.transactionIdIndex.get("id")!)).ReadInt64();
            }

            id++;
            this.transactionIdIndex.set("id", BitConverter.GetBytes(id), -1);

            foreach (DatabaseOperation operation in operations) {

                var db = this.databases[operation.database];
                switch (operation.targetType) {
                    case TargetType.SET:
                        var set = db.getSet(operation.target);
                        switch (operation.operationType) {
                            case DatabaseOperationType.WRITE:
                                set.add(operation.key, id);
                                break;
                            case DatabaseOperationType.DELETE:
                                set.delete(operation.key, id);
                                break;
                        }
                        break;
                    case TargetType.INDEX:
                        var index = db.getIndex(operation.target);

                        switch (operation.operationType) {
                            case DatabaseOperationType.WRITE:
                                index.set(operation.key, operation.newValue, id);
                                break;
                            case DatabaseOperationType.DELETE:
                                index.delete(operation.key, id);
                                break;
                        }
                        break;
                }
            }

            this.transactionSet.add(id.ToString(), -1);
            return id;
        }

        public void deleteTransactionRecord(long id) {
            this.transactionSet.delete(id.ToString(), -1);
        }

        public bool hasDatabase(string name) {
            return this.databases.ContainsKey(name);
        }

        public void compact() {
            foreach (Database database in this.databases.Values) {
                database.compact();
            }
        }

        public void clear() {
            foreach (string database in this.databases.Keys) {
                this.deleteDatabase(database);
            }
            this.internalDatabase.clear();
        }

        public string[] getDatabases() {
            var array = new string[this.databases.Count];
            this.databases.Keys.CopyTo(array, 0);
            return array;
        }

        public Database addDatabase(string name) {
            Console.WriteLine($"Creating Database {name}");
            //Forbid all characters that are not allowed as part of a file name
            if (name.Any(c => Path.GetInvalidFileNameChars().Contains(c))) {
                throw new ArgumentException("Invalid database name. Must not include any characters that aren't allowed in file names");
            }

            Directory.CreateDirectory(Path.Join(this.folder, name));
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            var pos = this.writer.BaseStream.Position;

            var database = new Database(Path.Join(this.folder, name), name, pos, this.transactionSet);
            this.databases.TryAdd(name, database);
            this.writer.Write(false);
            this.writer.Write(name);

            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.Write(true);
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
            if (database != null) {
#if DEBUG
                Console.WriteLine($"Deleting Database {name} at pos {database.pos}");
#endif
                this.writer.BaseStream.Seek(database.pos, SeekOrigin.Begin);
                this.writer.Write(false);
                this.databases.Remove(name);
                database.clear();
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
                return;
            }
            this.databases.TryAdd(name, new Database(Path.Join(this.folder, name), name, pos, this.transactionSet));
        }

        public void dispose() {
            foreach (Database database in this.databases.Values) {
                database.dispose();
            }
            this.internalDatabase.dispose();
            this.writer.Close();
        }
    }
}
