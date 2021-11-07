using System;
using System.Collections.Generic;
using System.Threading;
using ferrum_db_server.db;
using master_record;

namespace ferrum_db {


    public class FerrumDb {
        private DatabaseManager databaseManager;

        public FerrumDb(string path) {
            this.databaseManager = new DatabaseManager(path);
            this.databaseManager.compact();
            GC.Collect();
        }

        public long performTransaction(DatabaseOperation[] operations) {
            return this.databaseManager.performTransaction(operations);
        }

        public void deleteTransactionRecord(long transactionId) {
            this.databaseManager.deleteTransactionRecord(transactionId);
        }

        public void compact() {
            this.databaseManager.compact();
            GC.Collect();
        }

        public Database createDatabase(string name) {
            if (!this.databaseManager.hasDatabase(name)) {
                return this.databaseManager.addDatabase(name);
            } else {
                throw new Exception($"Failed to create Duplicate database {name}");
            }
        }

        public Database createDatabaseIfNotExist(string name) {
            if (!this.databaseManager.hasDatabase(name)) {
                this.createDatabase(name);
            }

            return this.getDatabase(name)!;
        }

        public void deleteDatabase(string name) {
            if (this.hasDatabase(name)) {
                this.databaseManager.deleteDatabase(name);
            } else {
                throw new Exception($"No index {name}");
            }
        }

        public void clear() {
            this.databaseManager.clear();
        }

        public string[] getDatabases() {
            return this.databaseManager.getDatabases();
        }

        public bool hasDatabase(string name) {
            return this.databaseManager.hasDatabase(name);
        }

        public Database? getDatabase(string name) {
            return this.databaseManager.getDatabase(name);
        }

        public void dispose() {
            this.databaseManager.dispose();
        }
    }
}
