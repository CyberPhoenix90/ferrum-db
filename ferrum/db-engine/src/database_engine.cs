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
        this.internalDatabase.initializeDatabase();

    }

    public Database CreateDatabase(string name)
    {
        writeLock.EnterWriteLock();
        if (this.databases.ContainsKey(name))
        {
            throw new Exception($"Database {name} already exists");
        }

        Directory.CreateDirectory(Path.Join(this.config.databasePath, name));
        var database = new Database(Path.Join(this.config.databasePath, name), name, this.ioEngine);
        database.initializeDatabase();
        this.databases[name] = database;
        writeLock.ExitWriteLock();

        return database;
    }

    public void DeleteDatabase(string name)
    {
        writeLock.EnterWriteLock();
        if (!this.databases.ContainsKey(name))
        {
            throw new Exception($"Database {name} does not exist");
        }

        this.databases[name].dispose();
        this.databases.Remove(name);
        Directory.Delete(Path.Join(this.config.databasePath, name));
        writeLock.ExitWriteLock();
    }

    public List<string> ListDatabases()
    {
        writeLock.EnterReadLock();
        var result = this.databases.Keys.ToList();
        writeLock.ExitReadLock();
        return result;
    }

    public bool HasDatabase(string name)
    {
        writeLock.EnterReadLock();
        var result = this.databases.ContainsKey(name);
        writeLock.ExitReadLock();
        return result;
    }

    public Database GetDatabase(string name)
    {
        writeLock.EnterReadLock();
        if (!this.databases.ContainsKey(name))
        {
            throw new Exception($"Database {name} does not exist");
        }

        var result = this.databases[name];
        writeLock.ExitReadLock();
        return result;
    }
}