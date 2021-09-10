enum ApiMessageType : int {
    CREATE_DATABASE = 0,
    CREATE_DATABASE_IF_NOT_EXIST = 1,
    HAS_DATABASE = 2,
    DROP_DATABASE = 3,
    LIST_DATABASES = 4,
    CLEAR_DATABASE = 5,
    CREATE_INDEX = 6,
    CREATE_INDEX_IF_NOT_EXIST = 7,
    DELETE_INDEX = 8,
    HAS_INDEX = 9,
    GET_INDEXES = 10,
    COMPACT = 11,
    INDEX_HAS = 12,
    INDEX_GET = 13,
    INDEX_SET = 14,
    INDEX_DELETE = 15,
    INDEX_GET_KEYS = 16,
    INDEX_CLEAR = 17,
    INDEX_GET_RECORD_COUNT = 18,
    INDEX_GET_RECORD_SIZE = 19,
    INDEX_READ_CHUNK = 20,
    INDEX_READ_UNTIL = 21,
    INDEX_OPEN_WRITE_STREAM = 22,
    INDEX_CLOSE_WRITE_STREAM = 23,
    INDEX_WRITE_STREAM_WRITE_CHUNK = 24,
}

abstract class Message {
    public readonly ApiMessageType type;
    public readonly uint id;

    protected Message(ApiMessageType type, uint id) {
        this.type = type;
        this.id = id;
    }
}

class CreateDatabase : Message {
    public readonly string name;

    public CreateDatabase(uint id, string name) : base(ApiMessageType.CREATE_DATABASE, id) {
        this.name = name;
    }
}

class CreateDatabaseIfNotExist : Message {
    public readonly string name;

    public CreateDatabaseIfNotExist(uint id, string name) : base(ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST, id) {
        this.name = name;
    }
}

class HasDatabase : Message {
    public readonly string name;

    public HasDatabase(uint id, string name) : base(ApiMessageType.HAS_DATABASE, id) {
        this.name = name;
    }
}

class DropDatabase : Message {
    public readonly string name;

    public DropDatabase(uint id, string name) : base(ApiMessageType.DROP_DATABASE, id) {
        this.name = name;
    }
}

class ClearDatabase : Message
{
    public readonly string name;

    public ClearDatabase(uint id, string name) : base(ApiMessageType.CLEAR_DATABASE, id)
    {
        this.name = name;
    }
}

class ListDatabases : Message
{

    public ListDatabases(uint id) : base(ApiMessageType.LIST_DATABASES, id)
    {
    }
}

class CreateIndex : Message {
    public readonly string database;
    public readonly string index;
    public readonly uint pageSize;

    public CreateIndex(uint id, string database, string index, uint pageSize) : base(ApiMessageType.CREATE_INDEX, id) {
        this.database = database;
        this.index = index;
        this.pageSize = pageSize;
    }
}
class CreateIndexIfNotExist : Message {
    public readonly string database;
    public readonly string index;
    public readonly uint pageSize;

    public CreateIndexIfNotExist(uint id, string database, string index, uint pageSize) : base(ApiMessageType.CREATE_INDEX_IF_NOT_EXIST, id) {
        this.database = database;
        this.index = index;
        this.pageSize = pageSize;
    }
}

class DeleteIndex : Message {
    public readonly string database;
    public readonly string index;

    public DeleteIndex(uint id, string database, string index) : base(ApiMessageType.DELETE_INDEX, id) {
        this.database = database;
        this.index = index;
    }
}
class HasIndex : Message {
    public readonly string database;
    public readonly string index;

    public HasIndex(uint id, string database, string index) : base(ApiMessageType.HAS_INDEX, id) {
        this.database = database;
        this.index = index;
    }
}

class GetIndexes : Message {
    public readonly string database;

    public GetIndexes(uint id, string database) : base(ApiMessageType.GET_INDEXES, id) {
        this.database = database;
    }
}

class Compact : Message {

    public Compact(uint id) : base(ApiMessageType.COMPACT, id) {
    }
}
class IndexHas : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;

    public IndexHas(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_HAS, id) {
        this.database = database;
        this.index = index;
        this.key = key;
    }
}

class IndexGet : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;

    public IndexGet(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_GET, id) {
        this.database = database;
        this.index = index;
        this.key = key;
    }
}

class IndexRecordCount : Message {
    public readonly string database;
    public readonly string index;
    public IndexRecordCount(uint id, string database, string index) : base(ApiMessageType.INDEX_GET_RECORD_COUNT, id) {
        this.database = database;
        this.index = index;
    }
}

class IndexGetRecordSize : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;

    public IndexGetRecordSize(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_GET_RECORD_SIZE, id) {
        this.database = database;
        this.index = index;
        this.key = key;
    }
}

class IndexReadChunk : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;
    public readonly long offset;
    public readonly uint size;

    public IndexReadChunk(uint id, string database, string index, string key, long offset, uint size) : base(ApiMessageType.INDEX_READ_CHUNK, id) {
        this.database = database;
        this.index = index;
        this.key = key;
        this.offset = offset;
        this.size = size;
    }
}

class IndexReadUntil : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;
    public readonly long offset;
    public readonly byte until;

    public IndexReadUntil(uint id, string database, string index, string key, long offset, byte until) : base(ApiMessageType.INDEX_READ_UNTIL, id) {
        this.database = database;
        this.index = index;
        this.key = key;
        this.offset = offset;
        this.until = until;
    }
}

class IndexOpenWriteStream : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;

    public IndexOpenWriteStream(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_OPEN_WRITE_STREAM, id) {
        this.database = database;
        this.index = index;
        this.key = key;
    }
}

class IndexCloseWriteStream : Message {
    public readonly string database;
    public readonly string index;
    public readonly long streamId;

    public IndexCloseWriteStream(uint id, string database, string index, long streamId) : base(ApiMessageType.INDEX_CLOSE_WRITE_STREAM, id) {
        this.database = database;
        this.index = index;
        this.streamId = streamId;
    }
}

class IndexWriteStreamWriteChunk : Message {
    public readonly string database;
    public readonly string index;
    public readonly long streamId;
    public readonly byte[] data;

    public IndexWriteStreamWriteChunk(uint id, string database, string index, long streamId, byte[] data) : base(ApiMessageType.INDEX_WRITE_STREAM_WRITE_CHUNK, id) {
        this.database = database;
        this.index = index;
        this.streamId = streamId;
        this.data = data;
    }
}

class IndexSet : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;
    public readonly byte[] value;

    public IndexSet(uint id, string database, string index, string key, byte[] value) : base(ApiMessageType.INDEX_SET, id) {
        this.database = database;
        this.index = index;
        this.key = key;
        this.value = value;
    }
}

class IndexDelete : Message {
    public readonly string database;
    public readonly string index;
    public readonly string key;

    public IndexDelete(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_DELETE, id) {
        this.database = database;
        this.index = index;
        this.key = key;
    }
}

class IndexClear : Message {
    public readonly string database;
    public readonly string index;

    public IndexClear(uint id, string database, string index) : base(ApiMessageType.INDEX_CLEAR, id) {
        this.database = database;
        this.index = index;
    }
}

class IndexGetKeys : Message {
    public readonly string database;
    public readonly string index;

    public IndexGetKeys(uint id, string database, string index) : base(ApiMessageType.INDEX_GET_KEYS, id) {
        this.database = database;
        this.index = index;
    }
}
