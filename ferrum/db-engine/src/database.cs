using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ferrum_collection_engine;
using ferrum_io_engine;

namespace ferrum_db_engine;

public class Database
{
    private string folder;
    private string name;
    private IOEngine io;
    private Dictionary<string, ferrum_collection_engine.Collection> collections;

    // Lock for accessing the collections dictionary
    private ReaderWriterLockSlim writeLock = new ReaderWriterLockSlim();
    public static int Version = 0;
    private bool disposed = false;

    public Database(string folder, string name, IOEngine io)
    {
        this.folder = folder;
        this.name = name;
        this.io = io;
        this.collections = [];
    }

    public void InitializeDatabase()
    {
        if (this.disposed)
        {
            throw new Exception("Database has been disposed");
        }
        if (!this.io.Exists(Path.Join(this.folder, "ferrum.db")))
        {
            if (!this.io.Exists(this.folder))
            {
                this.io.mkdir(this.folder);
            }

            this.io.writeFile(Path.Join(this.folder, "ferrum.db"), [
                            ..(BitConverter.GetBytes(Database.Version))
            ]);
        }
        else
        {
            using (BinaryReader reader = new BinaryReader(this.io.openFile(Path.Join(this.folder, "ferrum.db"))))
            {
                var version = reader.ReadInt32();
                if (version != Database.Version)
                {
                    throw new Exception("Unsupported database version");
                }
            }
        }

    }
    public void DeleteCollection(string name)
    {
        if (this.disposed)
        {
            throw new Exception("Database has been disposed");
        }
        try
        {
            writeLock.EnterWriteLock();
            if (!this.collections.ContainsKey(name))
            {
                throw new Exception($"Collection {name} does not exist");
            }

            this.collections[name].Dispose();
            this.collections.Remove(name);
        }
        finally
        {
            writeLock.ExitWriteLock();
        }
    }

    public void Dispose()
    {
        if (this.disposed)
        {
            throw new Exception("Database has been disposed");
        }

        try
        {
            writeLock.EnterWriteLock();
            io.deleteDirectory(this.folder);
            foreach (var collection in this.collections)
            {
                collection.Value.disposed = true;
            }
            this.collections.Clear();
            this.disposed = true;
        }
        finally
        {
            writeLock.ExitWriteLock();
        }
    }

    public bool HasCollection(string name)
    {
        try
        {
            writeLock.EnterReadLock();
            var result = this.collections.ContainsKey(name);
            return result;
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }

    public ferrum_collection_engine.Collection GetCollection(string collection)
    {
        try
        {
            writeLock.EnterReadLock();
            if (!this.collections.ContainsKey(collection))
            {
                throw new Exception($"Collection {collection} does not exist");
            }
            return this.collections[collection];
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }

    public List<string> ListCollections()
    {
        try
        {
            writeLock.EnterReadLock();
            var result = this.collections.Keys.ToList();
            return result;
        }
        finally
        {
            writeLock.ExitReadLock();
        }
    }

    public void CreateCollection(CollectionConfiguration config)
    {
        if (this.disposed)
        {
            throw new Exception("Database has been disposed");
        }
        try
        {
            writeLock.EnterWriteLock();
            if (this.collections.ContainsKey(config.Name))
            {
                throw new Exception($"Collection {config.Name} already exists");
            }

            if (config.KeyType == CollectionKeyType.NumberCollection)
            {
                var collection = NumberCollection.Create(this.io, Path.Join(this.folder, config.Name), config);
                this.collections[config.Name] = collection;
            }
            else
            {
                var collection = StringCollection.Create(this.io, Path.Join(this.folder, config.Name), config);
                this.collections[config.Name] = collection;
            }
        }
        finally
        {
            writeLock.ExitWriteLock();
        }
    }
}
