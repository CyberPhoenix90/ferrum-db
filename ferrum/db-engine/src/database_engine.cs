using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using ferrum_io_engine;

namespace ferrum_db_engine;

public class DatabaseEngine {
    private readonly Database internalDatabase;
    private readonly IOEngine ioEngine;
    private readonly DatabaseEngineConfig config;
    private readonly Dictionary<string, Database> databases;
    private readonly ReaderWriterLockSlim writeLock = new();

    public DatabaseEngine(DatabaseEngineConfig config, IOEngine ioEngine) {
        this.config = config;
        databases = [];
        this.ioEngine = ioEngine;
        Directory.CreateDirectory(Path.Join(config.databasePath, "$$internal"));
        internalDatabase = new Database(Path.Join(config.databasePath, "$$internal"), "$$internal", ioEngine);
        internalDatabase.InitializeDatabase();

        // Load all databases
        var databaseDirs = Directory.GetDirectories(config.databasePath);
        foreach (var databaseDir in databaseDirs) {
            var databaseName = Path.GetFileName(databaseDir);
            if (databaseName == "$$internal") continue;

            var database = new Database(databaseDir, databaseName, ioEngine);
            database.InitializeDatabase();
            databases[databaseName] = database;
        }
    }

    public Database CreateDatabase(string name) {
        try {
            writeLock.EnterWriteLock();
            if (databases.ContainsKey(name)) throw new Exception($"Database {name} already exists");

            Directory.CreateDirectory(Path.Join(config.databasePath, name));
            var database = new Database(Path.Join(config.databasePath, name), name, ioEngine);
            database.InitializeDatabase();
            databases[name] = database;

            return database;
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }

    public void DeleteDatabase(string name) {
        try {
            writeLock.EnterWriteLock();
            if (!databases.ContainsKey(name)) throw new Exception($"Database {name} does not exist");

            databases[name].Dispose();
            databases.Remove(name);
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }

    public List<string> ListDatabases() {
        try {
            writeLock.EnterReadLock();
            var result = databases.Keys.ToList();
            return result;
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public bool HasDatabase(string name) {
        try {
            writeLock.EnterReadLock();
            var result = databases.ContainsKey(name);
            return result;
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public Database GetDatabase(string name) {
        try {
            writeLock.EnterReadLock();
            if (!databases.ContainsKey(name)) throw new Exception($"Database {name} does not exist");

            var result = databases[name];
            return result;
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public Database? GetDatabaseOrNull(string name) {
        try {
            writeLock.EnterReadLock();
            return databases.GetValueOrDefault(name);
        }
        finally {
            writeLock.ExitReadLock();
        }
    }
}