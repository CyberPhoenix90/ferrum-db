using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server.protocol {
    public abstract class Message {
        public readonly ApiMessageType type;
        public readonly uint id;

        protected Message(ApiMessageType type, uint id) {
            this.type = type;
            this.id = id;
#if DEBUG
            Console.WriteLine("Message: " + type);
#endif
        }
    }

    public class HeartBeat : Message {
        public HeartBeat(uint id) : base(ApiMessageType.HEARTBEAT, id) {
        }
    }

    public class CreateDatabase : Message {
        public readonly string name;

        public CreateDatabase(uint id, string name) : base(ApiMessageType.CREATE_DATABASE, id) {
            this.name = name;
        }
    }

    public class CreateDatabaseIfNotExist : Message {
        public readonly string name;

        public CreateDatabaseIfNotExist(uint id, string name) : base(ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST, id) {
            this.name = name;
        }
    }

    public class HasDatabase : Message {
        public readonly string name;

        public HasDatabase(uint id, string name) : base(ApiMessageType.HAS_DATABASE, id) {
            this.name = name;
        }
    }

    public class DropDatabase : Message {
        public readonly string name;

        public DropDatabase(uint id, string name) : base(ApiMessageType.DROP_DATABASE, id) {
            this.name = name;
        }
    }

    public class ClearDatabase : Message {
        public readonly string name;

        public ClearDatabase(uint id, string name) : base(ApiMessageType.CLEAR_DATABASE, id) {
            this.name = name;
        }
    }

    public class ListDatabases : Message {

        public ListDatabases(uint id) : base(ApiMessageType.LIST_DATABASES, id) {
        }
    }
    public class Compact : Message {

        public Compact(uint id) : base(ApiMessageType.COMPACT, id) {
        }
    }

}