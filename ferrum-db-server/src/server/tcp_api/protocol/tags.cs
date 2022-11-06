using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ferrum_db_server.src.db.collections;
using GrpcAPI.collection;

namespace ferrum_db_server.src.server.protocol {
    public class Tags {
        public class CollectionGetTags : Message {
            public readonly string database;
            public readonly string collectionKey;
            public readonly CollectionType collectionType;

            public CollectionGetTags(uint id, string database, string collectionKey, byte collectionType) : base(ApiMessageType.COLLECTION_GET_TAGS, id) {
                this.database = database;
                this.collectionKey = collectionKey;
                this.collectionType = (CollectionType)collectionType;
            }
        }

        public class CollectionDeleteTag : Message {
            public readonly string database;
            public readonly string collectionKey;
            public readonly CollectionType collectionType;
            public readonly string tag;

            public CollectionDeleteTag(uint id, string database, string collectionKey, byte collectionType, string tag) : base(ApiMessageType.COLLECTION_DELETE_TAG, id) {
                this.database = database;
                this.collectionKey = collectionKey;
                this.collectionType = (CollectionType)collectionType;
                this.tag = tag;
            }
        }

        public class CollectionHasTag : Message {
            public readonly string database;
            public readonly string collectionKey;
            public readonly CollectionType collectionType;
            public readonly string tag;

            public CollectionHasTag(uint id, string database, string collectionKey, byte collectionType, string tag) : base(ApiMessageType.COLLECTION_HAS_TAG, id) {
                this.database = database;
                this.collectionKey = collectionKey;
                this.collectionType = (CollectionType)collectionType;
                this.tag = tag;
            }
        }

        public class CollectionGetTagEntry : Message {
            public readonly string database;
            public readonly string collectionKey;
            public readonly CollectionType collectionType;
            public readonly string tag;

            public CollectionGetTagEntry(uint id, string database, string collectionKey, byte collectionType, string tag) : base(ApiMessageType.COLLECTION_GET_TAG_ENTRY, id) {
                this.database = database;
                this.collectionKey = collectionKey;
                this.collectionType = (CollectionType)collectionType;
                this.tag = tag;
            }
        }

        public class CollectionSetTag : Message {
            public readonly string database;
            public readonly string collectionKey;
            public readonly CollectionType collectionType;
            public readonly string tag;
            public readonly byte[] value;

            public CollectionSetTag(uint id, string database, string collectionKey, byte collectionType, string tag, byte[] value) : base(ApiMessageType.COLLECTION_SET_TAG, id) {
                this.database = database;
                this.collectionKey = collectionKey;
                this.collectionType = (CollectionType)collectionType;
                this.tag = tag;
                this.value = value;
            }
        }
    }
}