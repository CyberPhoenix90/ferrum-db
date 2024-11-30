using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using ferrum_collection_engine;
using ferrum_io_engine;

namespace ferrum_db_engine;

public class Database {
    public static int Version = 0;
    private readonly Dictionary<string, Collection> collections;
    private bool disposed;
    private readonly string folder;
    private readonly IOEngine io;
    private string name;

    // Lock for accessing the collections dictionary
    private readonly ReaderWriterLockSlim writeLock = new();

    public Database(string folder, string name, IOEngine io) {
        this.folder = folder;
        this.name = name;
        this.io = io;
        collections = [];
    }

    public void InitializeDatabase() {
        if (disposed) throw new Exception("Database has been disposed");

        if (!io.Exists(Path.Join(folder, "ferrum.db"))) {
            if (!io.Exists(folder)) io.mkdir(folder);

            io.writeFile(Path.Join(folder, "ferrum.db"), [..BitConverter.GetBytes(Version)]);
        }
        else {
            using (var reader = new BinaryReader(io.openFile(Path.Join(folder, "ferrum.db")))) {
                var version = reader.ReadInt32();
                if (version != Version) throw new Exception("Unsupported database version");
            }
        }
    }

    public CollectionKeyType GetCollectionKeyType(string collectionName) {
        var collection = GetCollection(collectionName);
        return collection switch {
            StringCollection => CollectionKeyType.StringCollection,
            NumberCollection => CollectionKeyType.NumberCollection,
            _ => throw new Exception("Illegal State: Unknown collection type")
        };
    }

    public void DeleteCollection(string collectionName) {
        if (disposed) throw new Exception("Database has been disposed");

        try {
            writeLock.EnterWriteLock();
            if (!collections.TryGetValue(collectionName, out var value))
                throw new Exception($"Collection {collectionName} does not exist");

            value.Dispose();
            collections.Remove(collectionName);
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }

    public void Dispose() {
        if (disposed) throw new Exception("Database has been disposed");

        try {
            writeLock.EnterWriteLock();
            io.deleteDirectory(folder);
            foreach (var collection in collections) collection.Value.disposed = true;

            collections.Clear();
            disposed = true;
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }

    public bool HasCollection(string name) {
        try {
            writeLock.EnterReadLock();
            var result = collections.ContainsKey(name);
            return result;
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public Collection GetCollection(string collection) {
        try {
            writeLock.EnterReadLock();
            if (!collections.ContainsKey(collection)) throw new Exception($"Collection {collection} does not exist");

            return collections[collection];
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public Collection? GetCollectionOrNull(string collection) {
        try {
            writeLock.EnterReadLock();
            return collections.GetValueOrDefault(collection);
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public List<string> ListCollections() {
        try {
            writeLock.EnterReadLock();
            var result = collections.Keys.ToList();
            return result;
        }
        finally {
            writeLock.ExitReadLock();
        }
    }

    public void CreateCollection(CollectionConfiguration config) {
        if (disposed) throw new Exception("Database has been disposed");

        try {
            writeLock.EnterWriteLock();
            if (collections.ContainsKey(config.Name)) throw new Exception($"Collection {config.Name} already exists");

            if (config.KeyType == CollectionKeyType.NumberCollection) {
                var collection = NumberCollection.Create(io, Path.Join(folder, config.Name), config);
                collections[config.Name] = collection;
            }
            else {
                var collection = StringCollection.Create(io, Path.Join(folder, config.Name), config);
                collections[config.Name] = collection;
            }
        }
        finally {
            writeLock.ExitWriteLock();
        }
    }
}