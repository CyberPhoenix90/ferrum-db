using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using ferrum_db;
using ferrum_db_server.src;
using ferrum_db_server.src.db.collections;
using ferrum_db_server.src.server;
using ferrum_db_server.src.server.protocol;
using master_record;
using static ferrum_db_server.src.server.protocol.Tags;
using Index = ferrum_db_server.src.db.collections.Index;

namespace api_server {
    class APIServer {
        private delegate void IoEvent(FerrumDb ferrumDb);
        private readonly AutoResetEvent ioEvents;
        private readonly ConcurrentQueue<IoEvent> ioEventCallbacks;
        private readonly TcpListener server;
        public APIServer(IPAddress ip, int port, FerrumDb ferrumDb) {
            Thread.CurrentThread.Name = "API";
            this.server = new TcpListener(ip, port);
            this.server.Start();
            this.ioEventCallbacks = new ConcurrentQueue<IoEvent>();
            this.ioEvents = new AutoResetEvent(false);
            this.listenForConnections();

            var time = new Stopwatch();

            while (true) {
                this.ioEvents.WaitOne();
                while (!ioEventCallbacks.IsEmpty) {
                    this.ioEventCallbacks.TryDequeue(out IoEvent? task);
                    if (task != null) {
                        time.Restart();
                        task(ferrumDb);
                        time.Stop();
                        if (time.ElapsedMilliseconds > 100) {
                            Logger.Warn($"IO Event took {time.ElapsedMilliseconds}ms");
                        }
                    }
                }
            }

        }

        private void handleClient(TcpClient client) {
            Logger.Info($"New Client connected. Client");
            byte[] sizeBytes = new byte[4];
            byte[] buffer = new byte[1048576];
            client.ReceiveBufferSize = 1048576;
            var stream = client.GetStream();
            int immutableSize;
            while (client.Connected) {
                try {
                    if (!client.Connected) {
                        Logger.Info("Client disconnected");
                        break;
                    }

                    var read = stream.Read(sizeBytes, 0, 4);
                    var size = BitConverter.ToInt32(sizeBytes, 0);
                    immutableSize = size;

                    if (size < 0) {
                        Logger.Error("Invalid size. Potentially corrupt data");
                        break;
                    }

                    if (size > 1048576 * 768) {
                        Logger.Error($"Error: Msg Buffer overflow. Max Size : 768MB. Size: {size / 1048576} MB");
                        break;
                    }
                    else if (size > buffer.Length) {
                        buffer = new byte[size];
                    }
                    if (read == 0) {
                        Logger.Error("Client disconnected. No data read");
                        break;
                    }
                    var offset = 0;
                    while (size > 0 && (read = stream.Read(buffer, offset, size)) > 0) {
                        offset += read;
                        size -= read;
                    }
                    if (size != 0) {
                        Logger.Error("Client disconnected. Not all data received");
                        break;
                    }
                }
                catch (Exception e) {
                    Logger.Error("Exception in network thread", e);
                    break;
                }

                var command = MessageDecoder.decode(buffer);
                if (command != null) {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        this.handleCommand(command, stream, ferrumDb);
                    });
                    ioEvents.Set();
                }
            }
            Logger.Info("Client dropped");
        }

        private void handleCommand(Message command, NetworkStream client, FerrumDb ferrumDb) {
            Index? index;
            Set? set;
            TimeSeries? timeSeries;
            Database? db;
            AbstractCollection? collection;

            try {
                switch (command.type) {
                    case ApiMessageType.HEARTBEAT:
                        var heartbeat = (HeartBeat)command;
                        APIWriter.sendOk(client, heartbeat.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE:
                        var createDatabase = (CreateDatabase)command;
                        ferrumDb.createDatabase(createDatabase.name);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST:
                        var createDatabaseIfNotExist = (CreateDatabaseIfNotExist)command;
                        ferrumDb.createDatabaseIfNotExist(createDatabaseIfNotExist.name);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_DATABASE:
                        var hasDatabase = (HasDatabase)command;
                        APIWriter.sendBool(client, command.id, ferrumDb.hasDatabase(hasDatabase.name));
                        break;
                    case ApiMessageType.DROP_DATABASE:
                        var dropDatabase = (DropDatabase)command;
                        ferrumDb.deleteDatabase(dropDatabase.name);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CLEAR_DATABASE:
                        var clearDatabase = (ClearDatabase)command;
                        ferrumDb.getDatabase(clearDatabase.name).clear();
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.LIST_DATABASES:
                        APIWriter.sendList(client, command.id, ferrumDb.getDatabases());
                        break;
                    case ApiMessageType.CREATE_INDEX:
                        var createIndex = (CreateIndex)command;

                        db = this.getDbOrFail(createIndex.database, createIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addIndex(createIndex.index, createIndex.pageSize);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_INDEX_IF_NOT_EXIST:
                        var createIndexIfNotExist = (CreateIndexIfNotExist)command;

                        db = this.getDbOrFail(createIndexIfNotExist.database, createIndexIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addIndexIfNotExist(createIndexIfNotExist.index, createIndexIfNotExist.pageSize);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_INDEX:
                        var deleteIndex = (DeleteIndex)command;

                        db = this.getDbOrFail(deleteIndex.database, deleteIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteIndex(deleteIndex.index);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_INDEX:
                        var hasIndex = (HasIndex)command;

                        db = this.getDbOrFail(hasIndex.database, hasIndex.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendBool(client, command.id, db.hasIndex(hasIndex.index));
                        break;
                    case ApiMessageType.GET_INDEXES:
                        var getIndexes = (GetIndexes)command;

                        db = this.getDbOrFail(getIndexes.database, getIndexes.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendList(client, command.id, db.getIndexes());
                        break;
                    case ApiMessageType.COMPACT:
                        ferrumDb.compact();
                        APIWriter.sendOk(client, command.id);
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
                            APIWriter.sendOk(client, indexClear.id);
                        }
                        else {
                            APIWriter.sendError(client, indexClear.id, new Exception($"No Index found for key {indexClear.index}"));
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
                            APIWriter.sendOk(client, indexDelete.id);
                        }
                        else {
                            APIWriter.sendError(client, indexDelete.id, new Exception($"No Index found for key {indexDelete.index}"));
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
                                Console.WriteLine($"IndexGet: {indexGet.key} -> { data.Length } bytes");
#endif
                                APIWriter.sendBinary(client, indexGet.id, data);
                            }
                            else {
                                APIWriter.sendError(client, indexGet.id, new Exception($"No Record found for key {indexGet.key} in index {indexGet.index}"));
                            }
                        }
                        else {
                            APIWriter.sendError(client, indexGet.id, new Exception($"No Index found for key {indexGet.index}"));
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
                            APIWriter.sendInt(client, indexRecordCount.id, count);
                        }
                        else {
                            APIWriter.sendError(client, indexRecordCount.id, new Exception($"No Index found for key {indexRecordCount.index}"));
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
                                APIWriter.sendError(client, indexRecordSize.id, new Exception($"No Record found for key {indexRecordSize.key} in index {indexRecordSize.index}"));
                            }
                            else {
                                APIWriter.sendLong(client, indexRecordSize.id, ((long)size));
                            }
                        }
                        else {
                            APIWriter.sendError(client, indexRecordSize.id, new Exception($"No Index found for key {indexRecordSize.index}"));
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
                            APIWriter.sendBool(client, indexHas.id, index.has(indexHas.key));
                        }
                        else {
                            APIWriter.sendError(client, indexHas.id, new Exception($"No Index found for key {indexHas.index}"));
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
                            APIWriter.sendList(client, indexGetKeys.id, index.getKeys());
                        }
                        else {
                            APIWriter.sendError(client, indexGetKeys.id, new Exception($"No Index found for key {indexGetKeys.index}"));
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
                            Console.WriteLine($"IndexSet: {indexSet.key} -> { indexSet.value.Length } bytes");
#endif
                            index.set(indexSet.key, indexSet.value, -1);
                            APIWriter.sendOk(client, indexSet.id);
                        }
                        else {
                            APIWriter.sendError(client, indexSet.id, new Exception($"No Index found for key {indexSet.index}"));
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
                                APIWriter.sendError(client, indexReadChunk.id, new Exception($"No Record found for key {indexReadChunk.key} in index {indexReadChunk.index}"));
                            }
                            else {
                                APIWriter.sendBinary(client, indexReadChunk.id, data);
                            }
                        }
                        else {
                            APIWriter.sendError(client, indexReadChunk.id, new Exception($"No Index found for key {indexReadChunk.index}"));
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
                                APIWriter.sendError(client, indexReadUntil.id, new Exception($"No Record found for key {indexReadUntil.key} in index {indexReadUntil.index}"));
                            }
                            else {
                                APIWriter.sendBinary(client, indexReadUntil.id, data);
                            }
                        }
                        else {
                            APIWriter.sendError(client, indexReadUntil.id, new Exception($"No Index found for key {indexReadUntil.index}"));
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
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_SET_IF_NOT_EXIST:
                        var createSetIfNotExist = (CreateSetIfNotExist)command;

                        db = this.getDbOrFail(createSetIfNotExist.database, createSetIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addSetIfNotExist(createSetIfNotExist.set);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_SET:
                        var deleteSet = (DeleteSet)command;

                        db = this.getDbOrFail(deleteSet.database, deleteSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteSet(deleteSet.set);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_SET:
                        var hasSet = (HasSet)command;

                        db = this.getDbOrFail(hasSet.database, hasSet.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendBool(client, command.id, db.hasSet(hasSet.set));
                        break;
                    case ApiMessageType.GET_SETS:
                        var getSets = (GetSets)command;

                        db = this.getDbOrFail(getSets.database, getSets.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendList(client, command.id, db.getSets());
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
                            APIWriter.sendOk(client, setClear.id);
                        }
                        else {
                            APIWriter.sendError(client, setClear.id, new Exception($"No Set found for key {setClear.set}"));
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
                            APIWriter.sendOk(client, setDelete.id);
                        }
                        else {
                            APIWriter.sendError(client, setDelete.id, new Exception($"No Set found for key {setDelete.set}"));
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
                            APIWriter.sendBool(client, setHas.id, set.has(setHas.key));
                        }
                        else {
                            APIWriter.sendError(client, setHas.id, new Exception($"No Set found for key {setHas.set}"));
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
                            APIWriter.sendList(client, setGetKeys.id, set.getKeys());
                        }
                        else {
                            APIWriter.sendError(client, setGetKeys.id, new Exception($"No Set found for key {setGetKeys.set}"));
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
                            APIWriter.sendOk(client, setAdd.id);
                        }
                        else {
                            APIWriter.sendError(client, setAdd.id, new Exception($"No Set found for key {setAdd.set}"));
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
                            APIWriter.sendInt(client, setRecordCount.id, count);
                        }
                        else {
                            APIWriter.sendError(client, setRecordCount.id, new Exception($"No Set found for key {setRecordCount.set}"));
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
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST:
                        var createTimeSeriesIfNotExist = (CreateTimeSeriesIfNotExist)command;

                        db = this.getDbOrFail(createTimeSeriesIfNotExist.database, createTimeSeriesIfNotExist.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.addTimeSeriesIfNotExist(createTimeSeriesIfNotExist.timeSeries, createTimeSeriesIfNotExist.pageSize);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_TIME_SERIES:
                        var deleteTimeSeries = (DeleteTimeSeries)command;

                        db = this.getDbOrFail(deleteTimeSeries.database, deleteTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        db.deleteTimeSeries(deleteTimeSeries.timeSeries);
                        APIWriter.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_TIME_SERIES:
                        var hasTimeSeries = (HasTimeSeries)command;

                        db = this.getDbOrFail(hasTimeSeries.database, hasTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendBool(client, command.id, db.hasTimeSeries(hasTimeSeries.timeSeries));
                        break;
                    case ApiMessageType.GET_TIME_SERIES:
                        var getTimeSeries = (GetTimeSeries)command;

                        db = this.getDbOrFail(getTimeSeries.database, getTimeSeries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        APIWriter.sendList(client, command.id, db.getTimeSeries());
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
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesClear.timeSeries}"));
                        }
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
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesDeleteEntry.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_HAS_ENTRY:
                        var timeSeriesHasEntry = (TimeSeriesHasEntry)command;

                        db = this.getDbOrFail(timeSeriesHasEntry.database, timeSeriesHasEntry.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesHasEntry.timeSeries);

                        if (timeSeries != null) {
                            APIWriter.sendBool(client, command.id, timeSeries.hasEntry(timeSeriesHasEntry.key, timeSeriesHasEntry.timestamp));
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesHasEntry.timeSeries}"));
                        }

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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntry.timeSeries}"));
                        }

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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetFirstEntryAfterTimestamp.timeSeries}"));
                        }
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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLastEntryBeforeTimestamp.timeSeries}"));
                        }
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
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntriesBetweenTimestamps.timeSeries}"));
                        }
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
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLastNEntries.timeSeries}"));
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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEarliestEntry.timeSeries}"));
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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetLatestEntry.timeSeries}"));
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
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesDeleteSerie.timeSeries}"));
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
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetNearestEntryToTimestamp.timeSeries}"));
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
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesPutEntry.timeSeries}"));
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
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetFullSerie.timeSeries}"));
                        }
                        break;
                    case ApiMessageType.TIME_SERIES_GET_FULL_SERIE_ENTRIES:
                        var timeSeriesGetFullSerieEntries = (TimeSeriesGetFullSerieEntries)command;

                        db = this.getDbOrFail(timeSeriesGetFullSerieEntries.database, timeSeriesGetFullSerieEntries.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetFullSerieEntries.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getFullSerieEntries(timeSeriesGetFullSerieEntries.key);
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetFullSerieEntries.timeSeries}"));
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
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetSeries.timeSeries}"));
                        }

                        break;
                    case ApiMessageType.TIME_SERIES_GET_ENTRIES_BEFORE_TIMESTAMP:
                        var timeSeriesGetEntriesBeforeTimestamp = (TimeSeriesGetEntriesBefore)command;

                        db = this.getDbOrFail(timeSeriesGetEntriesBeforeTimestamp.database, timeSeriesGetEntriesBeforeTimestamp.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetEntriesBeforeTimestamp.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getEntriesBeforeTimestamp(timeSeriesGetEntriesBeforeTimestamp.key, timeSeriesGetEntriesBeforeTimestamp.timestamp);
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntriesBeforeTimestamp.timeSeries}"));
                        }

                        break;

                    case ApiMessageType.TIME_SERIES_GET_ENTRIES_AFTER_TIMESTAMP:
                        var timeSeriesGetEntriesAfterTimestamp = (TimeSeriesGetEntriesAfter)command;

                        db = this.getDbOrFail(timeSeriesGetEntriesAfterTimestamp.database, timeSeriesGetEntriesAfterTimestamp.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        timeSeries = db.getTimeSeries(timeSeriesGetEntriesAfterTimestamp.timeSeries);

                        if (timeSeries != null) {
                            var entries = timeSeries.getEntriesAfterTimestamp(timeSeriesGetEntriesAfterTimestamp.key, timeSeriesGetEntriesAfterTimestamp.timestamp);
                            APIWriter.sendList(client, command.id, entries);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No TimeSeries found for key {timeSeriesGetEntriesAfterTimestamp.timeSeries}"));
                        }

                        break;

                    //////// COLLECTIOS

                    case ApiMessageType.COLLECTION_DELETE_TAG:
                        var collectionDeleteTag = (CollectionDeleteTag)command;

                        db = this.getDbOrFail(collectionDeleteTag.database, collectionDeleteTag.id, client, ferrumDb);
                        if (db == null) {
                            return;
                        }

                        collection = db.getCollection(collectionDeleteTag.collectionKey, collectionDeleteTag.collectionType);

                        if (collection != null) {
                            collection.deleteCollectionTag(collectionDeleteTag.tag);
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No Collection found for key {collectionDeleteTag.collectionKey}"));
                        }

                        break;

                    case ApiMessageType.COLLECTION_GET_TAG_ENTRY:
                        var collectionGetTagEntry = (CollectionGetTagEntry)command;

                        db = this.getDbOrFail(collectionGetTagEntry.database, collectionGetTagEntry.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        collection = db.getCollection(collectionGetTagEntry.collectionKey, collectionGetTagEntry.collectionType);

                        if (collection != null) {
                            var entry = collection.getCollectionTag(collectionGetTagEntry.tag);
                            APIWriter.sendBinary(client, command.id, entry);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No Collection found for key {collectionGetTagEntry.collectionKey}"));
                        }

                        break;

                    case ApiMessageType.COLLECTION_GET_TAGS:
                        var collectionGetTags = (CollectionGetTags)command;

                        db = this.getDbOrFail(collectionGetTags.database, collectionGetTags.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        collection = db.getCollection(collectionGetTags.collectionKey, collectionGetTags.collectionType);

                        if (collection != null) {
                            var tags = collection.getCollectionTags();
                            APIWriter.sendList(client, command.id, tags);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No Collection found for key {collectionGetTags.collectionKey}"));
                        }

                        break;

                    case ApiMessageType.COLLECTION_HAS_TAG:
                        var collectionHasTag = (CollectionHasTag)command;

                        db = this.getDbOrFail(collectionHasTag.database, collectionHasTag.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        collection = db.getCollection(collectionHasTag.collectionKey, collectionHasTag.collectionType);

                        if (collection != null) {
                            var hasTag = collection.hasCollectionTag(collectionHasTag.tag);
                            APIWriter.sendBool(client, command.id, hasTag);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No Collection found for key {collectionHasTag.collectionKey}"));
                        }

                        break;

                    case ApiMessageType.COLLECTION_SET_TAG:
                        var collectionSetTag = (CollectionSetTag)command;

                        db = this.getDbOrFail(collectionSetTag.database, collectionSetTag.id, client, ferrumDb);

                        if (db == null) {
                            return;
                        }

                        collection = db.getCollection(collectionSetTag.collectionKey, collectionSetTag.collectionType);

                        if (collection != null) {
                            collection.setCollectionTag(collectionSetTag.tag, collectionSetTag.value);
                            APIWriter.sendOk(client, command.id);
                        }
                        else {
                            APIWriter.sendError(client, command.id, new Exception($"No Collection found for key {collectionSetTag.collectionKey}"));
                        }

                        break;
                    default:
                        APIWriter.sendError(client, command.id, new Exception($"Command not implemented: {command.type}"));
                        break;
                }
            }
            catch (Exception e) {
                APIWriter.sendError(client, command.id, e);
            }
        }

        private Database? getDbOrFail(string database, uint id, NetworkStream client, FerrumDb ferrumDb) {
            var db = ferrumDb.getDatabase(database);

            if (db == null) {
                APIWriter.sendError(client, id, new Exception($"No DB found for key {database}"));
            }
            return db;
        }


        private async void listenForConnections() {
            var id = 0;
            while (true) {
                var client = await server.AcceptTcpClientAsync();
                if (client != null) {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        var thread = new Thread(() => this.handleClient(client));
                        thread.Name = "Network " + id++;
                        thread.Start();
                    });
                    ioEvents.Set();
                }
            }
        }
    }
}