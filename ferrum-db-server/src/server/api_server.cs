using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using ferrum_db;
using ferrum_db_server.src.server.protocol;
using master_record;

namespace api_server {
    class APIServer {
        private delegate void IoEvent(FerrumDb ferrumDb);
        private readonly AutoResetEvent ioEvents;
        private readonly ConcurrentQueue<IoEvent> ioEventCallbacks;
        private readonly TcpListener server;
        public APIServer(IPAddress ip, int port, FerrumDb ferrumDb) {
            this.server = new TcpListener(ip, port);
            this.server.Start();
            this.ioEventCallbacks = new ConcurrentQueue<IoEvent>();
            this.ioEvents = new AutoResetEvent(false);
            this.listenForConnections();

            while (true) {
                this.ioEvents.WaitOne();
                while (!ioEventCallbacks.IsEmpty) {
                    this.ioEventCallbacks.TryDequeue(out IoEvent? task);
                    if (task != null) {
                        task(ferrumDb);
                    }
                }
            }

        }

        private void handleClient(TcpClient client) {
            Console.WriteLine("New Client connected");
            byte[] sizeBytes = new byte[4];
            byte[] buffer = new byte[1048576];
            client.ReceiveBufferSize = 1048576 * 512;
            var stream = client.GetStream();
            stream.ReadTimeout = 10000;
            while (client.Connected) {
                try {
                    if (!client.Connected) {
                        Console.WriteLine("Client disconnected");
                        break;
                    }

                    var read = stream.Read(sizeBytes, 0, 4);
                    var size = BitConverter.ToInt32(sizeBytes, 0);
                    if (size > 1048576 * 512) {
                        Console.WriteLine("Error: Msg Buffer overflow");
                    }
                    else if (size > buffer.Length) {
                        buffer = new byte[size];
                    }
                    if (read == 0) {
                        Console.WriteLine("Client disconnected. No data read");
                        break;
                    }
                    var offset = 0;
                    while (size > 0 && (read = stream.Read(buffer, offset, size)) > 0) {
                        offset += read;
                        size -= read;
                    }
                    if (size != 0) {
                        Console.WriteLine("Client disconnected. Not all data received");
                        break;
                    }
                }
                catch (Exception e) {
                    Console.WriteLine(e);
                    break;
                }

                var command = this.decode(buffer);
                if (command != null) {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        this.handleCommand(command, stream, ferrumDb);
                    });
                }
                ioEvents.Set();


            }
            Console.WriteLine("Client dropped");
        }

        private Message? decode(Byte[] buffer) {
            try {

                using (var reader = new BinaryReader(new MemoryStream(buffer))) {
                    var type = reader.ReadInt32();
#if DEBUG
                    Console.WriteLine($"Decoding {type}");
#endif
                    switch ((ApiMessageType)type) {
                        case ApiMessageType.HEARTBEAT:
                            return new HeartBeat(reader.ReadUInt32());
                        case ApiMessageType.CREATE_DATABASE:
                            return new CreateDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST:
                            return new CreateDatabaseIfNotExist(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.HAS_DATABASE:
                            return new HasDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.CLEAR_DATABASE:
                            return new ClearDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.DROP_DATABASE:
                            return new DropDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.LIST_DATABASES:
                            return new ListDatabases(reader.ReadUInt32());
                        case ApiMessageType.CREATE_INDEX:
                            return new CreateIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.CREATE_INDEX_IF_NOT_EXIST:
                            return new CreateIndexIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.DELETE_INDEX:
                            return new DeleteIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_INDEX:
                            return new HasIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_INDEXES:
                            return new GetIndexes(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.COMPACT:
                            return new Compact(reader.ReadUInt32());
                        case ApiMessageType.INDEX_CLEAR:
                            return new IndexClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET_KEYS:
                            return new IndexGetKeys(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_DELETE:
                            return new IndexDelete(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET:
                            return new IndexGet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_HAS:
                            return new IndexHas(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_SET:
                            return new IndexSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.INDEX_GET_RECORD_COUNT:
                            return new IndexRecordCount(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET_RECORD_SIZE:
                            return new IndexGetRecordSize(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_READ_CHUNK:
                            return new IndexReadChunk(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadUInt32());
                        case ApiMessageType.INDEX_READ_UNTIL:
                            return new IndexReadUntil(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadByte());
                        case ApiMessageType.INDEX_OPEN_WRITE_STREAM:
                            return new IndexOpenWriteStream(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_CLOSE_WRITE_STREAM:
                            return new IndexCloseWriteStream(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.INDEX_WRITE_STREAM_WRITE_CHUNK:
                            return new IndexWriteStreamWriteChunk(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.CREATE_SET:
                            return new CreateSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.CREATE_SET_IF_NOT_EXIST:
                            return new CreateSetIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.DELETE_SET:
                            return new DeleteSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_SET:
                            return new HasSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_SETS:
                            return new GetSets(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.SET_CLEAR:
                            return new SetClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_GET_KEYS:
                            return new SetGetKeys(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_DELETE:
                            return new SetDelete(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_HAS:
                            return new SetHas(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_ADD:
                            return new SetAdd(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_GET_RECORD_COUNT:
                            return new SetRecordCount(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_CLEAR:
                            return new TimeSeriesClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_DELETE_ENTRY:
                            return new TimeSeriesDeleteEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_DELETE_SERIE:
                            return new TimeSeriesDeleteSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_EARLIEST_ENTRY:
                            return new TimeSeriesGetFirstEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_LATEST_ENTRY:
                            return new TimeSeriesGetLastEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS:
                            return new TimeSeriesGetEntriesBetween(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_ENTRY:
                            return new TimeSeriesGetEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP:
                            return new TimeSeriesGetFirstEntryAfter(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP:
                            return new TimeSeriesGetFirstEntryBefore(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_LAST_N_ENTRIES:
                            return new TimeSeriesGetLastNEntries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt32());
                        case ApiMessageType.TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP:
                            return new TimeSeriesGetNearestEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_HAS_ENTRY:
                            return new TimeSeriesHasEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_HAS_SERIE:
                            return new TimeSeriesHasSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.CREATE_TIME_SERIES:
                            return new CreateTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST:
                            return new CreateTimeSeriesIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.DELETE_TIME_SERIES:
                            return new DeleteTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_TIME_SERIES:
                            return new HasTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_TIME_SERIES:
                            return new GetTimeSeries(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_PUT_ENTRY:
                            return new TimeSeriesSetEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.TIME_SERIES_GET_SERIES:
                            return new TimeSeriesGetSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_FULL_SERIE:
                            return new TimeSeriesGetFullSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        default:
                            throw new Exception("Unknown message type: " + type);

                    }
                }
            }
            catch (Exception e) {
                Console.WriteLine($"Error while decoding message {e.Message}");
            }

            return null;
        }

        private void handleCommand(Message command, NetworkStream client, FerrumDb ferrumDb) {
            Index? index;
            Set? set;
            TimeSeries? timeSeries;
            Database? db;
            try {
                switch (command.type) {
                    case ApiMessageType.HEARTBEAT:
                        var heartbeat = (HeartBeat)command;
                        this.sendOk(client, heartbeat.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE:
                        var createDatabase = (CreateDatabase)command;
                        ferrumDb.createDatabase(createDatabase.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST:
                        var createDatabaseIfNotExist = (CreateDatabaseIfNotExist)command;
                        ferrumDb.createDatabaseIfNotExist(createDatabaseIfNotExist.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_DATABASE:
                        var hasDatabase = (HasDatabase)command;
                        this.sendBool(client, command.id, ferrumDb.hasDatabase(hasDatabase.name));
                        break;
                    case ApiMessageType.DROP_DATABASE:
                        var dropDatabase = (DropDatabase)command;
                        ferrumDb.deleteDatabase(dropDatabase.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CLEAR_DATABASE:
                        var clearDatabase = (ClearDatabase)command;
                        ferrumDb.getDatabase(clearDatabase.name).clear();
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.LIST_DATABASES:
                        this.sendList(client, command.id, ferrumDb.getDatabases());
                        break;
                    case ApiMessageType.CREATE_INDEX:
                        var createIndex = (CreateIndex)command;

                        db = this.getDbOrFail(createIndex.database, createIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addIndex(createIndex.index, createIndex.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_INDEX_IF_NOT_EXIST:
                        var createIndexIfNotExist = (CreateIndexIfNotExist)command;

                        db = this.getDbOrFail(createIndexIfNotExist.database, createIndexIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addIndexIfNotExist(createIndexIfNotExist.index, createIndexIfNotExist.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_INDEX:
                        var deleteIndex = (DeleteIndex)command;

                        db = this.getDbOrFail(deleteIndex.database, deleteIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteIndex(deleteIndex.index);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_INDEX:
                        var hasIndex = (HasIndex)command;

                        db = this.getDbOrFail(hasIndex.database, hasIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendBool(client, command.id, db.hasIndex(hasIndex.index));
                        break;
                    case ApiMessageType.GET_INDEXES:
                        var getIndexes = (GetIndexes)command;

                        db = this.getDbOrFail(getIndexes.database, getIndexes.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendList(client, command.id, db.getIndexes());
                        break;
                    case ApiMessageType.COMPACT:
                        ferrumDb.compact();
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.INDEX_CLEAR:
                        var indexClear = ((IndexClear)command);

                        db = this.getDbOrFail(indexClear.database, indexClear.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexClear.index);
                        if (index != null) {
                            index.clear();
                            this.sendOk(client, indexClear.id);
                        }
                        else {
                            this.sendError(client, indexClear.id, new Exception($"No Index found for key {indexClear.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_DELETE:
                        var indexDelete = (IndexDelete)command;

                        db = this.getDbOrFail(indexDelete.database, indexDelete.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexDelete.index);
                        if (index != null) {
                            index.delete(indexDelete.key, -1);
                            this.sendOk(client, indexDelete.id);
                        }
                        else {
                            this.sendError(client, indexDelete.id, new Exception($"No Index found for key {indexDelete.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET:
                        var indexGet = (IndexGet)command;

                        db = this.getDbOrFail(indexGet.database, indexGet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexGet.index);
                        if (index != null) {
                            var data = index.get(indexGet.key);
                            if (data != null) {
#if DEBUG
                                Console.WriteLine($"IndexGet: {indexGet.key} -> { System.Text.Encoding.Default.GetString(data)}");
#endif
                                this.sendBinary(client, indexGet.id, data);
                            }
                            else {
                                this.sendError(client, indexGet.id, new Exception($"No Record found for key {indexGet.key} in index {indexGet.index}"));
                            }
                        }
                        else {
                            this.sendError(client, indexGet.id, new Exception($"No Index found for key {indexGet.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_RECORD_COUNT:
                        var indexRecordCount = (IndexRecordCount)command;

                        db = this.getDbOrFail(indexRecordCount.database, indexRecordCount.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexRecordCount.index);
                        if (index != null) {
                            var count = index.getRecordCount();
                            this.sendInt(client, indexRecordCount.id, count);
                        }
                        else {
                            this.sendError(client, indexRecordCount.id, new Exception($"No Index found for key {indexRecordCount.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_RECORD_SIZE:
                        var indexRecordSize = (IndexGetRecordSize)command;

                        db = this.getDbOrFail(indexRecordSize.database, indexRecordSize.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexRecordSize.index);
                        if (index != null) {
                            var size = index.getRecordSize(indexRecordSize.key);
                            if (size == null) {
                                this.sendError(client, indexRecordSize.id, new Exception($"No Record found for key {indexRecordSize.key} in index {indexRecordSize.index}"));
                            }
                            else {
                                this.sendLong(client, indexRecordSize.id, ((long)size));
                            }
                        }
                        else {
                            this.sendError(client, indexRecordSize.id, new Exception($"No Index found for key {indexRecordSize.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_HAS:
                        var indexHas = (IndexHas)command;
                        db = this.getDbOrFail(indexHas.database, indexHas.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }


                        index = db.getIndex(indexHas.index);
                        if (index != null) {
                            this.sendBool(client, indexHas.id, index.has(indexHas.key));
                        }
                        else {
                            this.sendError(client, indexHas.id, new Exception($"No Index found for key {indexHas.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_KEYS:
                        var indexGetKeys = (IndexGetKeys)command;
                        db = this.getDbOrFail(indexGetKeys.database, indexGetKeys.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexGetKeys.index);
                        if (index != null) {
                            this.sendList(client, indexGetKeys.id, index.getKeys());
                        }
                        else {
                            this.sendError(client, indexGetKeys.id, new Exception($"No Index found for key {indexGetKeys.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_SET:
                        var indexSet = (IndexSet)command;
                        db = this.getDbOrFail(indexSet.database, indexSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexSet.index);
                        if (index != null) {
#if DEBUG
                            Console.WriteLine($"IndexSet: {indexSet.key} -> { System.Text.Encoding.Default.GetString(indexSet.value)}");
#endif
                            index.set(indexSet.key, indexSet.value, -1);
                            this.sendOk(client, indexSet.id);
                        }
                        else {
                            this.sendError(client, indexSet.id, new Exception($"No Index found for key {indexSet.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_READ_CHUNK:
                        var indexReadChunk = (IndexReadChunk)command;
                        db = this.getDbOrFail(indexReadChunk.database, indexReadChunk.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexReadChunk.index);
                        if (index != null) {
                            var data = index.readChunk(indexReadChunk.key, indexReadChunk.offset, indexReadChunk.size);
                            if (data == null) {
                                this.sendError(client, indexReadChunk.id, new Exception($"No Record found for key {indexReadChunk.key} in index {indexReadChunk.index}"));
                            }
                            else {
                                this.sendBinary(client, indexReadChunk.id, data);
                            }
                        }
                        else {
                            this.sendError(client, indexReadChunk.id, new Exception($"No Index found for key {indexReadChunk.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_READ_UNTIL:
                        var indexReadUntil = (IndexReadUntil)command;
                        db = this.getDbOrFail(indexReadUntil.database, indexReadUntil.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        index = db.getIndex(indexReadUntil.index);
                        if (index != null) {
                            var data = index.readUntil(indexReadUntil.key, indexReadUntil.offset, indexReadUntil.until);
                            if (data == null) {
                                this.sendError(client, indexReadUntil.id, new Exception($"No Record found for key {indexReadUntil.key} in index {indexReadUntil.index}"));
                            }
                            else {
                                this.sendBinary(client, indexReadUntil.id, data);
                            }
                        }
                        else {
                            this.sendError(client, indexReadUntil.id, new Exception($"No Index found for key {indexReadUntil.index}"));
                        }
                        break;

                    ////////// SETS

                    case ApiMessageType.CREATE_SET:
                        var createSet = (CreateSet)command;

                        db = this.getDbOrFail(createSet.database, createSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addSet(createSet.set);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_SET_IF_NOT_EXIST:
                        var createSetIfNotExist = (CreateSetIfNotExist)command;

                        db = this.getDbOrFail(createSetIfNotExist.database, createSetIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addSetIfNotExist(createSetIfNotExist.set);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_SET:
                        var deleteSet = (DeleteSet)command;

                        db = this.getDbOrFail(deleteSet.database, deleteSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteSet(deleteSet.set);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_SET:
                        var hasSet = (HasSet)command;

                        db = this.getDbOrFail(hasSet.database, hasSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendBool(client, command.id, db.hasSet(hasSet.set));
                        break;
                    case ApiMessageType.GET_SETS:
                        var getSets = (GetSets)command;

                        db = this.getDbOrFail(getSets.database, getSets.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendList(client, command.id, db.getSets());
                        break;
                    case ApiMessageType.SET_CLEAR:
                        var setClear = (SetClear)command;

                        db = this.getDbOrFail(setClear.database, setClear.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        set = db.getSet(setClear.set);
                        if (set != null) {
                            set.clear();
                            this.sendOk(client, setClear.id);
                        }
                        else {
                            this.sendError(client, setClear.id, new Exception($"No Set found for key {setClear.set}"));
                        }
                        break;
                    case ApiMessageType.SET_DELETE:
                        var setDelete = (SetDelete)command;

                        db = this.getDbOrFail(setDelete.database, setDelete.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        set = db.getSet(setDelete.set);
                        if (set != null) {
                            set.delete(setDelete.key, -1);
                            this.sendOk(client, setDelete.id);
                        }
                        else {
                            this.sendError(client, setDelete.id, new Exception($"No Set found for key {setDelete.set}"));
                        }
                        break;
                    case ApiMessageType.SET_HAS:
                        var setHas = (SetHas)command;
                        db = this.getDbOrFail(setHas.database, setHas.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }


                        set = db.getSet(setHas.set);
                        if (set != null) {
                            this.sendBool(client, setHas.id, set.has(setHas.key));
                        }
                        else {
                            this.sendError(client, setHas.id, new Exception($"No Set found for key {setHas.set}"));
                        }
                        break;
                    case ApiMessageType.SET_GET_KEYS:
                        var setGetKeys = (SetGetKeys)command;
                        db = this.getDbOrFail(setGetKeys.database, setGetKeys.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        set = db.getSet(setGetKeys.set);
                        if (set != null) {
                            this.sendList(client, setGetKeys.id, set.getKeys());
                        }
                        else {
                            this.sendError(client, setGetKeys.id, new Exception($"No Set found for key {setGetKeys.set}"));
                        }
                        break;


                    case ApiMessageType.SET_ADD:
                        var setAdd = (SetAdd)command;

                        db = this.getDbOrFail(setAdd.database, setAdd.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        set = db.getSet(setAdd.set);
                        if (set != null) {
#if DEBUG
                            Console.WriteLine($"SetAdd: {setAdd.key}");
#endif
                            set.add(setAdd.key, -1);
                            this.sendOk(client, setAdd.id);
                        }
                        else {
                            this.sendError(client, setAdd.id, new Exception($"No Set found for key {setAdd.set}"));
                        }
                        break;
                    case ApiMessageType.SET_GET_RECORD_COUNT:
                        var setRecordCount = (SetRecordCount)command;

                        db = this.getDbOrFail(setRecordCount.database, setRecordCount.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        set = db.getSet(setRecordCount.set);
                        if (set != null) {
                            var count = set.getRecordCount();
                            this.sendInt(client, setRecordCount.id, count);
                        }
                        else {
                            this.sendError(client, setRecordCount.id, new Exception($"No Set found for key {setRecordCount.set}"));
                        }
                        break;


                    ////////// TIME SERIES

                    case ApiMessageType.CREATE_TIME_SERIES:
                        var createTimeSeries = (CreateTimeSeries)command;

                        db = this.getDbOrFail(createTimeSeries.database, createTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addTimeSeries(createTimeSeries.timeSeries, createTimeSeries.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST:
                        var createTimeSeriesIfNotExist = (CreateTimeSeriesIfNotExist)command;

                        db = this.getDbOrFail(createTimeSeriesIfNotExist.database, createTimeSeriesIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addTimeSeriesIfNotExist(createTimeSeriesIfNotExist.timeSeries, createTimeSeriesIfNotExist.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_TIME_SERIES:
                        var deleteTimeSeries = (DeleteTimeSeries)command;

                        db = this.getDbOrFail(deleteTimeSeries.database, deleteTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteTimeSeries(deleteTimeSeries.timeSeries);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_TIME_SERIES:
                        var hasTimeSeries = (HasTimeSeries)command;

                        db = this.getDbOrFail(hasTimeSeries.database, hasTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendBool(client, command.id, db.hasTimeSeries(hasTimeSeries.timeSeries));
                        break;
                    case ApiMessageType.GET_TIME_SERIES:
                        var getTimeSeries = (GetTimeSeries)command;

                        db = this.getDbOrFail(getTimeSeries.database, getTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_CLEAR:
                        var timeSeriesClear = (TimeSeriesClear)command;

                        db = this.getDbOrFail(timeSeriesClear.database, timeSeriesClear.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesClear.timeSeries);

                        if (timeSeries != null) {
                            timeSeries.clear();
                            this.sendOk(client, command.id);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesClear.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;

                    case ApiMessageType.TIME_SERIES_DELETE_ENTRY:
                        var timeSeriesDeleteEntry = (TimeSeriesDeleteEntry)command;

                        db = this.getDbOrFail(timeSeriesDeleteEntry.database, timeSeriesDeleteEntry.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesDeleteEntry.timeSeries);

                        if (timeSeries != null) {
                            timeSeries.delete(timeSeriesDeleteEntry.key, timeSeriesDeleteEntry.timestamp, -1);
                            this.sendOk(client, command.id);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesDeleteEntry.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_GET_ENTRY:
                        var timeSeriesGetEntry = (TimeSeriesGetEntry)command;

                        db = this.getDbOrFail(timeSeriesGetEntry.database, timeSeriesGetEntry.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetEntry.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.get(timeSeriesGetEntry.key, timeSeriesGetEntry.timestamp);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntry.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP:
                        var timeSeriesGetFirstEntryAfterTimestamp = (TimeSeriesGetFirstEntryAfter)command;

                        db = this.getDbOrFail(timeSeriesGetFirstEntryAfterTimestamp.database, timeSeriesGetFirstEntryAfterTimestamp.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetFirstEntryAfterTimestamp.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.getFirstEntryAfterTimestamp(timeSeriesGetFirstEntryAfterTimestamp.key, timeSeriesGetFirstEntryAfterTimestamp.timestamp);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetFirstEntryAfterTimestamp.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP:
                        var timeSeriesGetLastEntryBeforeTimestamp = (TimeSeriesGetFirstEntryBefore)command;

                        db = this.getDbOrFail(timeSeriesGetLastEntryBeforeTimestamp.database, timeSeriesGetLastEntryBeforeTimestamp.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetLastEntryBeforeTimestamp.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.getFirstEntryBeforeTimestamp(timeSeriesGetLastEntryBeforeTimestamp.key, timeSeriesGetLastEntryBeforeTimestamp.timestamp);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLastEntryBeforeTimestamp.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS:
                        var timeSeriesGetEntriesBetweenTimestamps = (TimeSeriesGetEntriesBetween)command;

                        db = this.getDbOrFail(timeSeriesGetEntriesBetweenTimestamps.database, timeSeriesGetEntriesBetweenTimestamps.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetEntriesBetweenTimestamps.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getEntriesBetweenTimestamps(timeSeriesGetEntriesBetweenTimestamps.key, timeSeriesGetEntriesBetweenTimestamps.start, timeSeriesGetEntriesBetweenTimestamps.end);
                            this.sendBinaryList(client, command.id, entries);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntriesBetweenTimestamps.timeSeries}"));
                        }

                        this.sendList(client, command.id, db.getTimeSeries());
                        break;
                    case ApiMessageType.TIME_SERIES_GET_LAST_N_ENTRIES:
                        var timeSeriesGetLastNEntries = (TimeSeriesGetLastNEntries)command;

                        db = this.getDbOrFail(timeSeriesGetLastNEntries.database, timeSeriesGetLastNEntries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetLastNEntries.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getLastNEntries(timeSeriesGetLastNEntries.key, timeSeriesGetLastNEntries.count);
                            this.sendBinaryList(client, command.id, entries);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLastNEntries.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_GET_EARLIEST_ENTRY:
                        var timeSeriesGetEarliestEntry = (TimeSeriesGetFirstEntry)command;

                        db = this.getDbOrFail(timeSeriesGetEarliestEntry.database, timeSeriesGetEarliestEntry.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetEarliestEntry.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.getEarliestEntry(timeSeriesGetEarliestEntry.key);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEarliestEntry.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_GET_LATEST_ENTRY:
                        var timeSeriesGetLatestEntry = (TimeSeriesGetLastEntry)command;

                        db = this.getDbOrFail(timeSeriesGetLatestEntry.database, timeSeriesGetLatestEntry.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetLatestEntry.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.getLatestEntry(timeSeriesGetLatestEntry.key);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLatestEntry.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_DELETE_SERIE:
                        var timeSeriesDeleteSerie = (TimeSeriesDeleteSerie)command;

                        db = this.getDbOrFail(timeSeriesDeleteSerie.database, timeSeriesDeleteSerie.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesDeleteSerie.timeSeries);

                        if (timeSeries != null) {
                            timeSeries.deleteSerie(timeSeriesDeleteSerie.key, -1);
                            this.sendOk(client, command.id);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesDeleteSerie.timeSeries}"));
                        }
                        break;

                    case ApiMessageType.TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP:
                        var timeSeriesGetNearestEntryToTimestamp = (TimeSeriesGetNearestEntry)command;

                        db = this.getDbOrFail(timeSeriesGetNearestEntryToTimestamp.database, timeSeriesGetNearestEntryToTimestamp.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetNearestEntryToTimestamp.timeSeries);

                        if (timeSeries != null) {
                            var entry = timeSeries.getNearestMatch(timeSeriesGetNearestEntryToTimestamp.key, timeSeriesGetNearestEntryToTimestamp.timestamp);
                            this.sendBinary(client, command.id, entry);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetNearestEntryToTimestamp.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_PUT_ENTRY:
                        var timeSeriesPutEntry = (TimeSeriesSetEntry)command;

                        db = this.getDbOrFail(timeSeriesPutEntry.database, timeSeriesPutEntry.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesPutEntry.timeSeries);

                        if (timeSeries != null) {
                            timeSeries.set(timeSeriesPutEntry.key, timeSeriesPutEntry.timestamp, timeSeriesPutEntry.value, -1);
                            this.sendOk(client, command.id);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesPutEntry.timeSeries}"));
                        }

                        break;
                    case ApiMessageType.TIME_SERIES_GET_FULL_SERIE:
                        var timeSeriesGetFullSerie = (TimeSeriesGetFullSerie)command;

                        db = this.getDbOrFail(timeSeriesGetFullSerie.database, timeSeriesGetFullSerie.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetFullSerie.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getFullSerie(timeSeriesGetFullSerie.key);
                            this.sendBinaryList(client, command.id, entries);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetFullSerie.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_GET_SERIES:
                        var timeSeriesGetSeries = (TimeSeriesGetSeries)command;

                        db = this.getDbOrFail(timeSeriesGetSeries.database, timeSeriesGetSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetSeries.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getKeys();
                            this.sendList(client, command.id, entries);
                        }
                        else {
                            this.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetSeries.timeSeries}"));
                        }

                        break;
                    default:
                        this.sendError(client, command.id, new Exception($"Command not implemented: {command.type}"));
                        break;
                }
            }
            catch (Exception e) {
                this.sendError(client, command.id, e);
            }
        }

        private Database? getDbOrFail(string database, uint id, NetworkStream client, FerrumDb ferrumDb) {
            var db = ferrumDb.getDatabase(database);

            if (db == null) {
                this.sendError(client, id, new Exception($"No DB found for key {database}"));
            }
            return db;
        }

        private BinaryWriter startSend() {
            var ms = new MemoryStream(256);
            var s = new BinaryWriter(ms);
            return s;
        }

        private void endSend(NetworkStream client, BinaryWriter s) {
            try {
                var buffer = ((MemoryStream)s.BaseStream).GetBuffer();
                client.Write(BitConverter.GetBytes(buffer.Length));
                client.Write(buffer);
#if DEBUG
                Console.WriteLine($"Sent {buffer.Length} bytes");
#endif
            }
            catch (Exception) {
            }
        }

        private void sendLong(NetworkStream client, uint id, long value) {
            var s = this.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(value);
            this.endSend(client, s);
        }

        private void sendInt(NetworkStream client, uint id, int value) {
            var s = this.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(value);
            this.endSend(client, s);
        }

        private void sendError(NetworkStream client, uint id, Exception e) {
            var s = this.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ERROR for ID ${id}");
#endif
            Console.WriteLine(e.Message);
            Console.WriteLine(e.StackTrace);

            s.Write(false);
            s.Write(e.Message + '\n' + e.StackTrace);
            this.endSend(client, s);
        }

        private void sendOk(NetworkStream client, uint id) {
            var s = this.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ACK for ID ${id}");
#endif
            s.Write(true);
            this.endSend(client, s);
        }

        private void sendList(NetworkStream client, uint id, string[] list) {
            var s = this.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(list.Length);
            foreach (var item in list) {
                s.Write(item);
            }
            this.endSend(client, s);
        }

        private void sendBinaryList(NetworkStream client, uint id, List<byte[]> list) {
            var s = this.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending {list.Count} binary items for ID ${id}");
#endif
            s.Write(true);
            s.Write(list.Count);
            foreach (var item in list) {
                if (item == null) {
                    s.Write(0);
                }
                else {
                    s.Write(item.Length);
                    s.Write(item);

                }
            }
            this.endSend(client, s);
        }

        private void sendBinary(NetworkStream client, uint id, byte[] data) {
            var s = this.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending binary for ID ${id}");
#endif
            s.Write(true);
            if (data == null) {
                s.Write(0);
            }
            else {
                s.Write(data.Length);
                s.Write(data);
            }
            this.endSend(client, s);
        }

        private void sendBool(NetworkStream client, uint id, bool state) {
            var s = this.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending bool for ID ${id}");
#endif
            s.Write(true);
            s.Write(state);
            this.endSend(client, s);
        }

        private async void listenForConnections() {
            while (true) {
                var client = await server.AcceptTcpClientAsync();
                if (client != null) {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        new Thread(() => this.handleClient(client)).Start();
                    });
                    ioEvents.Set();

                }
            }
        }
    }
}