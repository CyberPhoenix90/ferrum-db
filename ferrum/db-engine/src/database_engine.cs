using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using ferrum_io_engine;

namespace ferrum_db_engine;

public class DatabaseEngine
{
    private DatabaseEngineConfig config;
    private Dictionary<string, Database> databases;
    private readonly Database internalDatabase;
    private readonly IOEngine ioEngine;
    private ReaderWriterLockSlim writeLock = new ReaderWriterLockSlim();

    public DatabaseEngine(DatabaseEngineConfig config, IOEngine ioEngine)
    {
        this.config = config;
        this.databases = [];
        this.ioEngine = ioEngine;
        Directory.CreateDirectory(Path.Join(config.databasePath, "$$internal"));
        this.internalDatabase = new Database(Path.Join(config.databasePath, "$$internal"), "$$internal", ioEngine);
        this.internalDatabase.InitializeDatabase();

        // Load all databases
        var databaseDirs = Directory.GetDirectories(config.databasePath);
        foreach (var databaseDir in databaseDirs)
        {
            var databaseName = Path.GetFileName(databaseDir);
            if (databaseName == "$$internal")
            {
                continue;
            }

            var database = new Database(databaseDir, databaseName, ioEngine);
            database.InitializeDatabase();
            this.databases[databaseName] = database;
        }

    }

    public Database CreateDatabase(string name)
    {
        try
        {
            writeLock.EnterWriteLock();
            if (this.databases.ContainsKey(name))
            {
                throw new Exception($"Database {name} already exists");
            }

            Directory.CreateDirectory(Path.Join(this.config.databasePath, name));
            var database = new Database(Path.Join(this.config.databasePath, name), name, this.ioEngine);
            database.InitializeDatabase();
            this.databases[name] = database;

            return database;
        }
        finally
        {
            writeLock.ExitWriteLock();
        }
    }

    public void DeleteDatabase(string name)
    {
        try
        {
            writeLock.EnterWriteLock();
            if (!this.databases.ContainsKey(name))
            {
                throw new Exception($"Database {name} does not exist");
            }

            this.databases[name].Dispose();
            this.databases.Remove(name);
        }
        finally
        {

            writeLock.ExitWriteLock();
        }
    }

    public List<string> ListDatabases()
    {
        try
        {
            writeLock.EnterReadLock();
            var result = this.databases.Keys.ToList();
            return result;
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }

    public bool HasDatabase(string name)
    {
        try
        {
            writeLock.EnterReadLock();
            var result = this.databases.ContainsKey(name);
            return result;
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }

    public Database GetDatabase(string name)
    {
        try
        {
            writeLock.EnterReadLock();
            if (!this.databases.ContainsKey(name))
            {
                throw new Exception($"Database {name} does not exist");
            }

            var result = this.databases[name];
            return result;
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }
}