using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Net.Client;
using GrpcAPI;

namespace csharp.src {
    public class Client {

        private GrpcChannel channel;

        public Client(string host, int port) {
            var httpHandler = new HttpClientHandler();
            httpHandler.ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;

            this.channel = GrpcChannel.ForAddress($"https://{host}:{port}", new GrpcChannelOptions { HttpHandler = httpHandler });
        }

        public DatabaseRemote GetDatabase(string database) {
            return new DatabaseRemote(this.channel, database);
        }

        public async Task<HasDatabaseResponse> HasDatabase(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new HasDatabaseRequest { Name = name };
            return await client.HasDatabaseAsync(request);
        }

        public async Task<SuccessResponse> CreateDatabase(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new CreateDatabaseRequest { Name = name };
            return await client.CreateDatabaseAsync(request);
        }

        public async Task<SuccessResponse> CreateDatabaseIfNotExist(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new CreateDatabaseRequest { Name = name };
            return await client.CreateDatabaseIfNotExistAsync(request);
        }

        public async Task<SuccessResponse> DropDatabase(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new DropDatabaseRequest { Name = name };
            return await client.DropDatabaseAsync(request);
        }

        public async Task<SuccessResponse> ClearDatabase(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new ClearDatabaseRequest { Name = name };
            return await client.ClearDatabaseAsync(request);
        }

        public async Task<ListDatabasesResponse> ListDatabases() {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new EmptyRequest { };
            return await client.ListDatabasesAsync(request);
        }

        public async Task<SuccessResponse> CompactDatabase(string name) {
            var client = new DatabaseServer.DatabaseServerClient(this.channel);
            var request = new CompactDatabaseRequest { Name = name };
            return await client.CompactDatabaseAsync(request);
        }
    }
}