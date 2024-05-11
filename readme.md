# Ferrum DB

## What it is

Ferrum DB is a NOSQL database server with a focus on high throughput at the expense of having higher RAM requirements.

> Warning: This database is experimental and in development. Is it working but not production ready. Feel free to play around and report issues but I hold no responsibility for data loss
> Breaking changes will occur in the data at this stage of development

### How does it work?

Ferrum DB is persisted and atomic, the way it achieves high performance is by holding all meta data in memory at runtime but not the records. This means that metadata querying is nearly instanteous as no disk access is needed to respond and access to data is quicker as no expensive disk lookups are needed to find out where a record is located on disk. The meta data is not exclusively held in memory, a record is kept on disk for persistence. This means that larger tham RAM databases are possible but the maximum database size does on the RAM at about the ratio of 1 GB per 10 million records of any size

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

### Typescript/Javascript query engine

The DB has a query engine that allows you to query the database with local data access using typescript/javascript powered by V8. This allows you to do complex queries on the server side without having to transfer the data to the client. This is especially useful for large data sets where you only need a small subset of the data. The query engine is also very fast and can handle millions of records in seconds. This overcomes the bottleneck of having to transfer the data to the client and then doing the aggregation on the client side.

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

## Running ferrum db

Once built ferrum db is just a simple executable. There is however a config.json file that you may wish to change to change your database server port or ip address

## Development

Writen in C#

### Building on Windows

Install dotnet 8 in the visual studio installer
Use Visual studio and just press build

### Building on linux

Install dotnet-sdk

```
sudo apt-get update && \
  sudo apt-get install -y dotnet-sdk-8.0
```

In ferrum-db-server folder:

Build Release:
Run the script create-deployable.sh
This creates a zip with a standalone version of ferrum that can be run on linux systems that have no dotnet installed

Build Debug:

> dotnet build

Generate protobuf client:
Run npm install and then the script generate_grpc_client.sh
