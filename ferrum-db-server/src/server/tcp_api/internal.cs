using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ferrum_db_server.src.server.protocol;

namespace ferrum_db_server.src.server {
    public class GetConnections : Message {

        public GetConnections(uint id) : base(ApiMessageType.GET_CONNECTIONS, id) {
        }
    }

    public class GetConnectionInfo : Message {
        public readonly string connectionId;
        public GetConnectionInfo(uint id, string connectionId) : base(ApiMessageType.GET_CONNECTION_INFO, id) {
            this.connectionId = connectionId;
        }
    }

    public class KickConnection : Message {
        public readonly string connectionId;
        public KickConnection(uint id, string connectionId) : base(ApiMessageType.KICK_CONNECTION, id) {
            this.connectionId = connectionId;
        }
    }
}