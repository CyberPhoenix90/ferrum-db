using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server.protocol {
    public class SetAdd : Message {
        public readonly string database;
        public readonly string set;
        public readonly string key;

        public SetAdd(uint id, string database, string set, string key) : base(ApiMessageType.SET_ADD, id) {
            this.database = database;
            this.set = set;
            this.key = key;
        }
    }

    public class SetDelete : Message {
        public readonly string database;
        public readonly string set;
        public readonly string key;

        public SetDelete(uint id, string database, string set, string key) : base(ApiMessageType.SET_DELETE, id) {
            this.database = database;
            this.set = set;
            this.key = key;
        }
    }

    public class SetClear : Message {
        public readonly string database;
        public readonly string set;

        public SetClear(uint id, string database, string set) : base(ApiMessageType.SET_CLEAR, id) {
            this.database = database;
            this.set = set;
        }
    }

    public class SetGetKeys : Message {
        public readonly string database;
        public readonly string set;

        public SetGetKeys(uint id, string database, string set) : base(ApiMessageType.SET_GET_KEYS, id) {
            this.database = database;
            this.set = set;
        }
    }

    public class CreateSet : Message {
        public readonly string database;
        public readonly string set;

        public CreateSet(uint id, string database, string set) : base(ApiMessageType.CREATE_SET, id) {
            this.database = database;
            this.set = set;
        }
    }
    public class CreateSetIfNotExist : Message {
        public readonly string database;
        public readonly string set;

        public CreateSetIfNotExist(uint id, string database, string set) : base(ApiMessageType.CREATE_SET_IF_NOT_EXIST, id) {
            this.database = database;
            this.set = set;
        }
    }

    public class DeleteSet : Message {
        public readonly string database;
        public readonly string set;

        public DeleteSet(uint id, string database, string set) : base(ApiMessageType.DELETE_SET, id) {
            this.database = database;
            this.set = set;
        }
    }
    public class HasSet : Message {
        public readonly string database;
        public readonly string set;

        public HasSet(uint id, string database, string set) : base(ApiMessageType.HAS_SET, id) {
            this.database = database;
            this.set = set;
        }
    }

    public class GetSets : Message {
        public readonly string database;

        public GetSets(uint id, string database) : base(ApiMessageType.GET_SETS, id) {
            this.database = database;
        }
    }

    public class SetHas : Message {
        public readonly string database;
        public readonly string set;
        public readonly string key;

        public SetHas(uint id, string database, string set, string key) : base(ApiMessageType.SET_HAS, id) {
            this.database = database;
            this.set = set;
            this.key = key;
        }
    }

    public class SetRecordCount : Message {
        public readonly string database;
        public readonly string set;
        public SetRecordCount(uint id, string database, string set) : base(ApiMessageType.SET_GET_RECORD_COUNT, id) {
            this.database = database;
            this.set = set;
        }
    }
}