using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using ferrum_db;
using master_record;

namespace api_server
{
    class APIServer
    {
        private delegate void IoEvent(FerrumDb ferrumDb);
        private AutoResetEvent ioEvents;
        private ConcurrentQueue<IoEvent> ioEventCallbacks;
        private TcpListener server;
        public APIServer(IPAddress ip, int port, FerrumDb ferrumDb)
        {
            this.server = new TcpListener(ip, port);
            this.server.Start();
            this.ioEventCallbacks = new ConcurrentQueue<IoEvent>();
            this.ioEvents = new AutoResetEvent(false);
            this.listenForConnections();

            while (true)
            {
                this.ioEvents.WaitOne();
                while (this.ioEventCallbacks.Count > 0)
                {
                    IoEvent? task;
                    this.ioEventCallbacks.TryDequeue(out task);
                    if (task != null)
                    {
                        task(ferrumDb);
                    }
                }
            }

        }

        private void handleClient(TcpClient client)
        {
            Console.WriteLine("New Client connected");
            byte[] sizeBytes = new byte[4];
            byte[] buffer = new byte[1048576];
            client.ReceiveBufferSize = 1048576 * 256;
            var stream = client.GetStream();
            stream.ReadTimeout = 10000;
            while (client.Connected)
            {
                try
                {
                    var read = stream.Read(sizeBytes, 0, 4);
                    var size = BitConverter.ToInt32(sizeBytes, 0);
                    if (size > 1048576 * 256)
                    {
                        Console.WriteLine("Error: Msg Buffer overflow");
                    }
                    else if (size > buffer.Length)
                    {
                        buffer = new byte[size];
                    }
                    if (read == 0)
                    {
                        Console.WriteLine("Warning: Socket hangup");
                        break;
                    }
                    var offset = 0;
                    while (size > 0 && (read = stream.Read(buffer, offset, size)) > 0)
                    {
                        offset += read;
                        size -= read;
                    }
                    if (size != 0)
                    {
                        Console.WriteLine("Warning: Socket hangup");
                        break;
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    break;
                }

                var command = this.decode(buffer);
                if (command != null)
                {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        this.handleCommand(command, stream, ferrumDb);
                    });
                }
                ioEvents.Set();


            }
            Console.WriteLine("Client dropped");
        }

        private Message? decode(Byte[] buffer)
        {
            try
            {

                using (var reader = new BinaryReader(new MemoryStream(buffer)))
                {
                    var type = reader.ReadInt32();
                    switch ((ApiMessageType)type)
                    {
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
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error while decoding message {e.Message}");
            }

            return null;
        }

        private void handleCommand(Message command, NetworkStream client, FerrumDb ferrumDb)
        {
            Index index;
            Database db;
            try
            {
                switch (command.type)
                {
                    case ApiMessageType.HEARTBEAT:
                        var heartbeat = (HeartBeat)command;
                        this.sendOk(client, heartbeat.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE:
                        var createDatabase = ((CreateDatabase)command);
                        ferrumDb.createDatabase(createDatabase.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST:
                        var createDatabaseIfNotExist = ((CreateDatabaseIfNotExist)command);
                        ferrumDb.createDatabaseIfNotExist(createDatabaseIfNotExist.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_DATABASE:
                        var hasDatabase = ((HasDatabase)command);
                        this.sendBool(client, command.id, ferrumDb.hasDatabase(hasDatabase.name));
                        break;
                    case ApiMessageType.DROP_DATABASE:
                        var dropDatabase = ((DropDatabase)command);
                        ferrumDb.deleteDatabase(dropDatabase.name);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CLEAR_DATABASE:
                        var clearDatabase = ((ClearDatabase)command);
                        ferrumDb.getDatabase(clearDatabase.name).clear();
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.LIST_DATABASES:
                        this.sendList(client, command.id, ferrumDb.getDatabases());
                        break;
                    case ApiMessageType.CREATE_INDEX:
                        var createIndex = ((CreateIndex)command);
                        db = ferrumDb.getDatabase(createIndex.database);
                        db.addIndex(createIndex.index, createIndex.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.CREATE_INDEX_IF_NOT_EXIST:
                        var createIndexIfNotExist = ((CreateIndexIfNotExist)command);
                        db = ferrumDb.getDatabase(createIndexIfNotExist.database);
                        db.addIndexIfNotExist(createIndexIfNotExist.index, createIndexIfNotExist.pageSize);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.DELETE_INDEX:
                        var deleteIndex = ((DeleteIndex)command);
                        db = ferrumDb.getDatabase(deleteIndex.database);
                        db.deleteIndex(deleteIndex.index);
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.HAS_INDEX:
                        var hasIndex = ((HasIndex)command);
                        db = ferrumDb.getDatabase(hasIndex.database);
                        this.sendBool(client, command.id, db.hasIndex(hasIndex.index));
                        break;
                    case ApiMessageType.GET_INDEXES:
                        var getIndexes = ((GetIndexes)command);
                        db = ferrumDb.getDatabase(getIndexes.database);
                        this.sendList(client, command.id, db.getIndexes());
                        break;
                    case ApiMessageType.COMPACT:
                        ferrumDb.compact();
                        this.sendOk(client, command.id);
                        break;
                    case ApiMessageType.INDEX_CLEAR:
                        var indexClear = ((IndexClear)command);
                        db = ferrumDb.getDatabase(indexClear.database);
                        index = db.getIndex(indexClear.index);
                        if (index != null)
                        {
                            index.clear();
                            this.sendOk(client, indexClear.id);
                        }
                        else
                        {
                            this.sendError(client, indexClear.id, new Exception($"No Index found for key {indexClear.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_DELETE:
                        var indexDelete = ((IndexDelete)command);
                        db = ferrumDb.getDatabase(indexDelete.database);
                        index = db.getIndex(indexDelete.index);
                        if (index != null)
                        {
                            index.delete(indexDelete.key);
                            this.sendOk(client, indexDelete.id);
                        }
                        else
                        {
                            this.sendError(client, indexDelete.id, new Exception($"No Index found for key {indexDelete.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET:
                        var indexGet = ((IndexGet)command);
                        db = ferrumDb.getDatabase(indexGet.database);
                        index = db.getIndex(indexGet.index);
                        if (index != null)
                        {
                            var data = index.get(indexGet.key);
                            if (data != null)
                            {
#if DEBUG
                                Console.WriteLine($"IndexGet: {indexGet.key} -> { System.Text.Encoding.Default.GetString(data)}");
#endif
                                this.sendBinary(client, indexGet.id, data);
                            }
                            else
                            {
                                this.sendError(client, indexGet.id, new Exception($"No Record found for key {indexGet.key} in index {indexGet.index}"));
                            }
                        }
                        else
                        {
                            this.sendError(client, indexGet.id, new Exception($"No Index found for key {indexGet.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_RECORD_COUNT:
                        var indexRecordCount = ((IndexRecordCount)command);
                        db = ferrumDb.getDatabase(indexRecordCount.database);
                        index = db.getIndex(indexRecordCount.index);
                        if (index != null)
                        {
                            var count = index.getRecordCount();
                            this.sendInt(client, indexRecordCount.id, count);
                        }
                        else
                        {
                            this.sendError(client, indexRecordCount.id, new Exception($"No Index found for key {indexRecordCount.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_RECORD_SIZE:
                        var indexRecordSize = ((IndexGetRecordSize)command);
                        db = ferrumDb.getDatabase(indexRecordSize.database);
                        index = db.getIndex(indexRecordSize.index);
                        if (index != null)
                        {
                            var size = index.getRecordSize(indexRecordSize.key);
                            if (size == null)
                            {
                                this.sendError(client, indexRecordSize.id, new Exception($"No Record found for key {indexRecordSize.key} in index {indexRecordSize.index}"));
                            }
                            else
                            {
                                this.sendLong(client, indexRecordSize.id, ((long)size));
                            }
                        }
                        else
                        {
                            this.sendError(client, indexRecordSize.id, new Exception($"No Index found for key {indexRecordSize.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_HAS:
                        var indexHas = ((IndexHas)command);
                        db = ferrumDb.getDatabase(indexHas.database);
                        index = db.getIndex(indexHas.index);
                        if (index != null)
                        {
                            this.sendBool(client, indexHas.id, index.has(indexHas.key));
                        }
                        else
                        {
                            this.sendError(client, indexHas.id, new Exception($"No Index found for key {indexHas.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_GET_KEYS:
                        var indexGetKeys = ((IndexGetKeys)command);
                        db = ferrumDb.getDatabase(indexGetKeys.database);
                        index = db.getIndex(indexGetKeys.index);
                        if (index != null)
                        {
                            this.sendList(client, indexGetKeys.id, index.getKeys());
                        }
                        else
                        {
                            this.sendError(client, indexGetKeys.id, new Exception($"No Index found for key {indexGetKeys.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_SET:
                        var indexSet = ((IndexSet)command);
                        db = ferrumDb.getDatabase(indexSet.database);
                        index = db.getIndex(indexSet.index);
                        if (index != null)
                        {
#if DEBUG
                            Console.WriteLine($"IndexSet: {indexSet.key} -> { System.Text.Encoding.Default.GetString(indexSet.value)}");
#endif
                            index.set(indexSet.key, indexSet.value);
                            this.sendOk(client, indexSet.id);
                        }
                        else
                        {
                            this.sendError(client, indexSet.id, new Exception($"No Index found for key {indexSet.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_READ_CHUNK:
                        var indexReadChunk = ((IndexReadChunk)command);
                        db = ferrumDb.getDatabase(indexReadChunk.database);
                        index = db.getIndex(indexReadChunk.index);
                        if (index != null)
                        {
                            var data = index.readChunk(indexReadChunk.key, indexReadChunk.offset, indexReadChunk.size);
                            if (data == null)
                            {
                                this.sendError(client, indexReadChunk.id, new Exception($"No Record found for key {indexReadChunk.key} in index {indexReadChunk.index}"));
                            }
                            else
                            {
                                this.sendBinary(client, indexReadChunk.id, data);
                            }
                        }
                        else
                        {
                            this.sendError(client, indexReadChunk.id, new Exception($"No Index found for key {indexReadChunk.index}"));
                        }
                        break;
                    case ApiMessageType.INDEX_READ_UNTIL:
                        var indexReadUntil = ((IndexReadUntil)command);
                        db = ferrumDb.getDatabase(indexReadUntil.database);
                        index = db.getIndex(indexReadUntil.index);
                        if (index != null)
                        {
                            var data = index.readUntil(indexReadUntil.key, indexReadUntil.offset, indexReadUntil.until);
                            if (data == null)
                            {
                                this.sendError(client, indexReadUntil.id, new Exception($"No Record found for key {indexReadUntil.key} in index {indexReadUntil.index}"));
                            }
                            else
                            {
                                this.sendBinary(client, indexReadUntil.id, data);
                            }
                        }
                        else
                        {
                            this.sendError(client, indexReadUntil.id, new Exception($"No Index found for key {indexReadUntil.index}"));
                        }
                        break;
                }
            }
            catch (Exception e)
            {
                this.sendError(client, command.id, e);
            }
        }

        private BinaryWriter startSend(NetworkStream client)
        {
            var ms = new MemoryStream(64);
            var s = new BinaryWriter(ms);
            return s;
        }

        private void endSend(NetworkStream client, BinaryWriter s)
        {
            try
            {
                var buffer = ((MemoryStream)s.BaseStream).GetBuffer();
                client.Write(BitConverter.GetBytes(buffer.Length));
                client.Write(buffer);
#if DEBUG
                Console.WriteLine($"Sent {buffer.Length} bytes");
#endif
            }
            catch (Exception)
            {
            }
        }

        private void sendLong(NetworkStream client, uint id, long value)
        {
            var s = this.startSend(client);
            s.Write(id);
            s.Write(true);
            s.Write(value);
            this.endSend(client, s);
        }

        private void sendInt(NetworkStream client, uint id, int value)
        {
            var s = this.startSend(client);
            s.Write(id);
            s.Write(true);
            s.Write(value);
            this.endSend(client, s);
        }

        private void sendError(NetworkStream client, uint id, Exception e)
        {
            var s = this.startSend(client);
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ERROR for ID ${id}");
#endif
            Console.WriteLine(e.Message);
            Console.WriteLine(e.StackTrace);

            s.Write(false);
            s.Write(e.Message+'\n'+e.StackTrace);
            this.endSend(client, s);
        }

        private void sendOk(NetworkStream client, uint id)
        {
            var s = this.startSend(client);
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ACK for ID ${id}");
#endif
            s.Write(true);
            this.endSend(client, s);
        }

        private void sendList(NetworkStream client, uint id, string[] list)
        {
            var s = this.startSend(client);
            s.Write(id);
            s.Write(true);
            s.Write(list.Length);
            foreach (var item in list)
            {
                s.Write(item);
            }
            this.endSend(client, s);
        }

        private void sendBinary(NetworkStream client, uint id, byte[] data)
        {
            var s = this.startSend(client);
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending binary for ID ${id}");
#endif
            s.Write(true);
            s.Write(data.Length);
            s.Write(data);
            this.endSend(client, s);
        }

        private void sendBool(NetworkStream client, uint id, bool state)
        {
            var s = this.startSend(client);
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending bool for ID ${id}");
#endif
            s.Write(true);
            s.Write(state);
            this.endSend(client, s);
        }

        private async void listenForConnections()
        {
            while (true)
            {
                var client = await server.AcceptTcpClientAsync();
                if (client != null)
                {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        new Thread(() => this.handleClient(client)).Start();
                    });
                    ioEvents.Set();

                }
            }
        }
    }
}