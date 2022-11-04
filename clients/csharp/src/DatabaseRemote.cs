using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Net.Client;
using GrpcAPI;

namespace csharp.src {
    public class DatabaseRemote {
        private GrpcChannel channel;
        private string database;

        public DatabaseRemote(GrpcChannel channel, string database) {
            this.channel = channel;
            this.database = database;
        }

        public IndexRemote GetIndex<T>(string index) {
            return new IndexRemote(this.channel, this.database, index);
        }

        public async Task<SuccessResponse> CreateIndex(string name, uint pageSize) {
            var client = new Database.DatabaseClient(this.channel);
            var request = new CreateIndexRequest { Database = this.database, IndexName = name, PageSize = pageSize };
            return await client.CreateIndexAsync(request);
        }

        public async Task<SuccessResponse> CreateIndexIfNotExist(string name, uint pageSize) {
            var client = new Database.DatabaseClient(this.channel);
            var request = new CreateIndexRequest { Database = this.database, IndexName = name, PageSize = pageSize };
            return await client.CreateIndexIfNotExistAsync(request);
        }

        public async Task<SuccessResponse> DropIndex(string name) {
            var client = new Database.DatabaseClient(this.channel);
            var request = new DeleteIndexRequest { Database = this.database, IndexName = name };
            return await client.DeleteIndexAsync(request);
        }

        public async Task<HasIndexResponse> HasIndex(string name) {
            var client = new Database.DatabaseClient(this.channel);
            var request = new HasIndexRequest { Database = this.database, IndexName = name };
            return await client.HasIndexAsync(request);
        }

        public async Task<ListIndexesResponse> ListIndexes() {
            var client = new Database.DatabaseClient(this.channel);
            var request = new ListIndexesRequest { Database = this.database };
            return await client.ListIndexesAsync(request);
        }
    }
}