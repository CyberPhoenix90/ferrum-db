# Ferrum DB

## What it is

Ferrum DB is a NOSQL database server with a focus on high throughput at the expense of having higher RAM requirements.

> Warning: This database is experimental and in development. Is it working but not production ready. Feel free to play around and report issues but I hold no responsibility for data loss
> Breaking changes will occur in the data at this stage of development

### How does it work?

Ferrum DB is persisted and atomic, the way it achieves high performance is by holding all record meta data in memory at runtime. This means that record metadata querying is nearly instanteous as no disk access is needed to respond and access to data is quicker as no expensive disk lookups are needed to find out where a record is located on disk. The meta data is not exclusively held in memory, a record is kept on disk for persistence. This means that larger tham RAM databases are possible but the maximum database size does on the RAM at about the ratio of 1 GB per 10 million records of any size

## Main features

### Streaming data in and out of the database

You can use the database like a regular nosql db and just write and read whole records. However the database supports opening read and write streams to write the record value progressively and to read any chunk of it or just progressively read all of it. This makes the DB an excellent choice for streamable content like ndjson, video or audio. Note that only one write stream can be open per record at a time and while the writing has not completed a read of that record would give the previous value. If the database is shutdown with an open write stream the entire write is lost and the old value is kept.

### Great for large values

This database does not experience unexpected slowdowns with larger values. In fact the writing and reading of the payload of a record runs as fast as your storage medium allows. Beyond a fixed overhead for read and write the IO will be a continious read or write from disk. Allowing you to max out even modern NVM-E SSDs at multiple Gigabytes per second if the records are big enough for the fixed overhead to not cause a CPU bottleneck. You can tipically expect the DB to handle over 125K writes per second and 500K reads per second on modern CPUs (Core count does not matter yet) unless bottlenecked by your storage medium.

### Performance is not affected by number of records

The performance of many databases drops off as they grow. Reading and writing records to this database will be just as fast with one record as it will be with one billion records (within a 10% tolerance margin)

### Zero write amplification

The data that is written to the DB is written exactly once. There is a fixed overhead per record on disk for the record pointer which is 16 bytes + key size.

### Meta data operations are nearly instantaneous

The "has" operation to check if something exists and it requires no disk lookup and is extremely lightweight.
The DB also has a getRecordSize operation that is just as cheap and can help with streaming.
You can get the number of records no matter how big the collection is this will be almost instantenous.

### Transactions

This database is capable of batching transactions. Which allows for multiple operations to be done atomically even across multiple databases.

### Different types of collections

FerrumDB currently supports 3 types of collections:
Index (key-value)
Set (key)
Time Series (key-value but with queryable number as key)

This setup allows you to pick the best collection type for your use case and only pay the price for the complexity you need. Each collection is specially crafted for performance in their respective use cases

## Limitations

FerrumDB has quite a few limitations in the name of performance

### The data is not sorted and thus not iterable unlike most (if not all) nosql solutions.

It is however possible to get a list of all the keys in an collection (in random order). This operation is almost free beyond the IO of transferring it over TCP due to those keys already being stored in memory. Then you can use the keys to iterate on the client side. However be aware that this means you cannot be sure that the keys do not get deleted or new keys get added while you are iterating.

### This DB uses more RAM and has an upper limit to its maximum scale depending on your system RAM.

It bears some similarities to Redis where it keeps the records in memory for maximum performance however instead of holding entire records in memory it just holds meta data. This means that unlike Redis you can hold arbitrarily large records for the same RAM cost. Only the number of records matters. With on average a cost of 1 GB RAM per 10M Records. Unlike Redis this DB also writes to disk by default in an atomic way. So the only relation to Redis is the memory for performance tradeoff not the non persistence.

### Database name length limit: 40 Characters

Database names also must be compatible with your file system as the database is created with that exact name on disk

### Key size limit: 2 KB

However be aware that the larger the keyname the higher the IO cost for TCP to send the data back and forth. This limitation is artificial imposed to keep key sizes reasonable.

### Streamed Value size limit: 8 EB (exabytes)

Or lower if your file system does not support files this big (linux typically is capped at 16 TB)

### Non streamed value size limit: 512 MB

For your convenience you can read/write large values with a single read/write but streaming is recommended for multi MB values to keep memory use down

### Maximum records per collection: 2,146,435,071

However the memory requirements are large to even reach this limit. It would take 214 GB to hold this many records, even if they are spread over multiple collections

### Maximum collections: 2,146,435,071

Subject to inode or folder capacity limitation of file system. Also uses about 1 GB of Ram per 10 Million collections

### Maximum Databases (per server): 2,146,435,071

Subject to inode or folder capacity limitation of file system. Also uses about 1 GB of Ram per 10 Million databases

### Maximum simultaneous connections: approx. 65535

Imposed by available ports in TCP

### Slow startup for large databases

Since part of what makes this DB fast is holding all the meta data in memory this DB takes longer to startup the more records it has. You can expect about 3s of startup time for every 10M records. This is because the database builds its hashmap structure into memory for the entire collection ahead of time for maximum performance.

### Binary only

The database only works with binary data; it doesn't encode your data and accepts nothing but binary. The encoding responsibility is moved to the client as the client knows best what encoding types are useful to the environment that it serves.

### No compression

The database does not modify the data in any way, not even compression. If compression is desired it has to be done on the client side, which also makes sense because that means any compression algorithm can be used and memory, cpu or latency caused by compression is fully under the clients control.

## Use case suggestions:

### BLOB storage:

This DB excels at having a minimal performance overhead compared to writing to disk while staying atomic and allows streaming content in and out of the database. This means that this database is perfect for large binary data sets, especially the streamable kind like video or music.

### Persistent Cache:

This DB has great performance at the cost of memory while staying persistent. This means it’s greatly suited to be placed as a layer between another database. This allows this database to take all the high frequency reads and write bursts and slowly drain into a slower but more RAM friendly database potentially using a sort of LRU strategy. With the advantage that you can shut down the DB and the cached data is kept.

### High performance medium scale nosql database:

This DB can also be used as the only nosql database in a system. The memory use or collection size limit may not be a concern if you do not plan to scale beyond 20 ~ 80 million records.

### Metrics Database:

The time series collection type is perfect for storing metrics or other statistics relevant data especially if it's being read and written at extreme speeds and in extreme quantities because FerrumDB does not slow down based on the size of its content.

## Clients

### NodeJS

The NodeJS client has support for bson, json, ndjson, string and binary records. Making it possible to store objects into the DB, or store json in a streamable way with ndjson. The client also supports gzip compression

### C#

The C# Client has support for json, string, number and binary records.

### GRPC

Using the protobuf files in this repo you can compile your own client and use it via GRPC

## Future expansion:

### MMAP

Achieve faster performance when running the client on the same PC as the server by sharing memory through MMAP. This would eliminate the TCP overhead in favor of MMAP overhead which is much smaller

### Deferred Writing

Right now all operations are blocking while waiting for the disk write to complete. The DB could in theory push write operations into a queue and just move on immediately. If a read operation is done for something that is still in the queue it could be read from memory even giving a speed boost for certain reads and if a write occurs for something that is in the queue we can replace the old write giving yet more speed benefits. The downside is that in case of a sudden crash/power loss there is a higher potential for lost data (not corruption as the DB is written in a way that records are either fully lost or fully retained)

### Memory Cache

We could keep some record values in memory in a configurable memory cache to reduce IO in read intensive DBs

### Append write

Support to add content to an existing record without having to rewrite the entire record

### Multithreading

Collections are fully isolated from each other allowing each collection to use their own CPU thread. This may be completely futile though because TCP will prevent you from being able to max out the CPU of the Database anyway unless you have a lot of clients.

### Observability

The database could support watchers where clients request to be informed of changes of interest allowing for real timeish applications

### Better Garbage Collection

Ref counting
Page files currently only get deleted if they had a single record or on restart. With ref counting we could delete page files as soon as all records in them are deleted saving us having to restart the database or calling an expensive compact. This would make the DB autocompacting which would mean regularly deleted data will almost immediately release disk space

### Defragmentation

With defragmentation we could shrink page files that have only a few deleted records instead of having to hope that all of them get deleted eventually. Defragmentation would have to run in a background thread, check through the references to find gaps and then lock the index while moving the data inside the page then truncating the file. This would avoid the situation where junk piles up because of sporadic deletes that never fully clear a page file

### New collection type: Tree

A special collection type specifically made to represent tree structures with ways of querying the tree at high speed and automatic management of child parent relationships (e.g. delete child on parent deletion)

### New collection type: Searchable Index

A type of key value storage where you can have multiple keys that are either strings or numbers (or both) and different ways to query on those keys. E.g. full text search, fuzzy search. Going to necessarily be more memory intensive than the other collections since FerrumDB does not compromise on performance

### New collection type: Blockchain

A collection that represents data as a set of changes from the previous version. Not unlike git this would allow all versions of the data that have ever been written to that collection to be seen and allows reverting back to prior versions

## Running ferrum db

Once built ferrum db is just a simple executable. There is however a config.json file that you may wish to change to change your database server port or ip address

## Development

Writen in C#

### Building on Windows

Use Visual studio and just press build

### Building on linux

Insall dotnet-sdk

```
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-7.0
```

In ferrum-db-server folder:

Build Release:
Run the script create-deployable.sh
This creates a zip with a standalone version of ferrum that can be run on linux systems that have no dotnet installed

Build Debug:

> dotnet build

Generate protobuf client:
Run npm install and then the script generate_grpc_client.sh
