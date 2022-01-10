using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server.protocol {
    public class CreateIndex : Message {
        public readonly string database;
        public readonly string index;
        public readonly uint pageSize;

        public CreateIndex(uint id, string database, string index, uint pageSize) : base(ApiMessageType.CREATE_INDEX, id) {
            this.database = database;
            this.index = index;
            this.pageSize = pageSize;
        }
    }
    public class CreateIndexIfNotExist : Message {
        public readonly string database;
        public readonly string index;
        public readonly uint pageSize;

        public CreateIndexIfNotExist(uint id, string database, string index, uint pageSize) : base(ApiMessageType.CREATE_INDEX_IF_NOT_EXIST, id) {
            this.database = database;
            this.index = index;
            this.pageSize = pageSize;
        }
    }

    public class DeleteIndex : Message {
        public readonly string database;
        public readonly string index;

        public DeleteIndex(uint id, string database, string index) : base(ApiMessageType.DELETE_INDEX, id) {
            this.database = database;
            this.index = index;
        }
    }
    public class HasIndex : Message {
        public readonly string database;
        public readonly string index;

        public HasIndex(uint id, string database, string index) : base(ApiMessageType.HAS_INDEX, id) {
            this.database = database;
            this.index = index;
        }
    }

    public class GetIndexes : Message {
        public readonly string database;

        public GetIndexes(uint id, string database) : base(ApiMessageType.GET_INDEXES, id) {
            this.database = database;
        }
    }
    public class IndexHas : Message {
        public readonly string database;
        public readonly string index;
        public readonly string key;

        public IndexHas(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_HAS, id) {
            this.database = database;
            this.index = index;
            this.key = key;
        }
    }

    public class IndexGet : Message {
        public readonly string database;
        public readonly string index;
        public readonly string key;

        public IndexGet(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_GET, id) {
            this.database = database;
            this.index = index;
            this.key = key;
        }
    }

    public class IndexRecordCount : Message {
        public readonly string database;
        public readonly string index;
        public IndexRecordCount(uint id, string database, string index) : base(ApiMessageType.INDEX_GET_RECORD_COUNT, id) {
            this.database = database;
            this.index = index;
        }
    }

    public class IndexGetRecordSize : Message {
        public readonly string database;
        public readonly string index;
        public readonly string key;

        public IndexGetRecordSize(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_GET_RECORD_SIZE, id) {
            this.database = database;
            this.index = index;
            this.key = key;
        }
    }

    public class IndexReadChunk : Message {
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

    public class IndexReadUntil : Message {
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

    public class IndexOpenWriteStream : Message {
        public readonly string database;
        public readonly string index;
        public readonly string key;

        public IndexOpenWriteStream(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_OPEN_WRITE_STREAM, id) {
            this.database = database;
            this.index = index;
            this.key = key;
        }
    }

    public class IndexCloseWriteStream : Message {
        public readonly string database;
        public readonly string index;
        public readonly long streamId;

        public IndexCloseWriteStream(uint id, string database, string index, long streamId) : base(ApiMessageType.INDEX_CLOSE_WRITE_STREAM, id) {
            this.database = database;
            this.index = index;
            this.streamId = streamId;
        }
    }

    public class IndexWriteStreamWriteChunk : Message {
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

    public class IndexSet : Message {
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

    public class IndexDelete : Message {
        public readonly string database;
        public readonly string index;
        public readonly string key;

        public IndexDelete(uint id, string database, string index, string key) : base(ApiMessageType.INDEX_DELETE, id) {
            this.database = database;
            this.index = index;
            this.key = key;
        }
    }

    public class IndexClear : Message {
        public readonly string database;
        public readonly string index;

        public IndexClear(uint id, string database, string index) : base(ApiMessageType.INDEX_CLEAR, id) {
            this.database = database;
            this.index = index;
        }
    }

    public class IndexGetKeys : Message {
        public readonly string database;
        public readonly string index;

        public IndexGetKeys(uint id, string database, string index) : base(ApiMessageType.INDEX_GET_KEYS, id) {
            this.database = database;
            this.index = index;
        }
    }


}