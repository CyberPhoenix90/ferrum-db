using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Net.Client;
using GrpcAPI.index;
using Newtonsoft.Json;

namespace csharp.src {
    public class IndexRemote {
        private string index;
        private GrpcChannel channel;
        private string database;

        public IndexRemote(GrpcChannel channel, string database, string index) {
            this.channel = channel;
            this.database = database;
            this.index = index;
        }

        public async Task<HasResponse> Has(string index, string key) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new HasRequest { Database = this.database, IndexName = index, Key = key };
            return await client.HasAsync(request);
        }

        public async Task<GetResponse> Get(string index, string key) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new GetRequest { Database = this.database, IndexName = index, Key = key };
            return await client.GetAsync(request);
        }

        public async Task<T> GetJSON<T>(string index, string key) {
            var response = await this.Get(index, key);
            return JsonConvert.DeserializeObject<T>(response.Value.ToStringUtf8());
        }

        public async Task<string> GetString(string index, string key) {
            var response = await this.Get(index, key);
            return response.Value.ToStringUtf8();
        }

        public async Task<int> GetInteger(string index, string key) {
            var response = await this.Get(index, key);
            return BitConverter.ToInt32(response.Value.ToByteArray());
        }

        public async Task<long> GetLong(string index, string key) {
            var response = await this.Get(index, key);
            return BitConverter.ToInt64(response.Value.ToByteArray());
        }

        public async Task<float> GetFloat(string index, string key) {
            var response = await this.Get(index, key);
            return BitConverter.ToSingle(response.Value.ToByteArray());
        }

        public async Task<double> GetDouble(string index, string key) {
            var response = await this.Get(index, key);
            return BitConverter.ToDouble(response.Value.ToByteArray());
        }

        public async Task<GetChunkResponse> GetChunk(string index, string key, uint offset, uint length) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new GetChunkRequest { Database = this.database, IndexName = index, Key = key, Offset = offset, ChunkSize = length };
            return await client.GetChunkAsync(request);
        }

        public async Task<GetUntilResponse> GetUntil(string index, string key, byte delimiter) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new GetUntilRequest { Database = this.database, IndexName = index, Key = key, Terminator = delimiter };
            return await client.GetUntilAsync(request);
        }

        public async Task<SuccessResponse> Put(string index, string key, byte[] value) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new PutRequest { Database = this.database, IndexName = index, Key = key, Value = Google.Protobuf.ByteString.CopyFrom(value) };
            return await client.PutAsync(request);
        }

        public async Task<SuccessResponse> Put(string index, string key, object value) {
            var json = JsonConvert.SerializeObject(value);
            return await this.Put(index, key, System.Text.Encoding.UTF8.GetBytes(json));
        }

        public async Task<SuccessResponse> Put(string index, string key, string value) {
            return await this.Put(index, key, System.Text.Encoding.UTF8.GetBytes(value));
        }

        public async Task<SuccessResponse> Put(string index, string key, int value) {
            return await this.Put(index, key, BitConverter.GetBytes(value));
        }

        public async Task<SuccessResponse> Put(string index, string key, long value) {
            return await this.Put(index, key, BitConverter.GetBytes(value));
        }

        public async Task<SuccessResponse> Put(string index, string key, float value) {
            return await this.Put(index, key, BitConverter.GetBytes(value));
        }

        public async Task<SuccessResponse> Put(string index, string key, double value) {
            return await this.Put(index, key, BitConverter.GetBytes(value));
        }



        public async Task<SuccessResponse> Delete(string index, string key) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new DeleteRequest { Database = this.database, IndexName = index, Key = key };
            return await client.DeleteAsync(request);
        }

        public async Task<SuccessResponse> Clear(string index) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new ClearRequest { Database = this.database, IndexName = index };
            return await client.ClearAsync(request);
        }

        public async Task<SizeResponse> Size(string index) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new SizeRequest { Database = this.database, IndexName = index };
            return await client.SizeAsync(request);
        }

        public async Task<GetRecordSizeResponse> GetRecordSize(string index, string key) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new GetRecordSizeRequest { Database = this.database, IndexName = index, Key = key };
            return await client.GetRecordSizeAsync(request);
        }

        public async Task<ListKeysResponse> GetKeys(string index) {
            var client = new GrpcAPI.index.Index.IndexClient(this.channel);
            var request = new ListKeysRequest { Database = this.database, IndexName = index };
            return await client.ListKeysAsync(request);
        }

    }
}