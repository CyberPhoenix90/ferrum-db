// package: index
// file: index.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as index_pb from "./index_pb";
import * as shared_pb from "./shared_pb";

interface IIndexService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    has: IIndexService_IHas;
    get: IIndexService_IGet;
    getChunk: IIndexService_IGetChunk;
    getUntil: IIndexService_IGetUntil;
    put: IIndexService_IPut;
    delete: IIndexService_IDelete;
    clear: IIndexService_IClear;
    size: IIndexService_ISize;
    getRecordSize: IIndexService_IGetRecordSize;
    getRecordCount: IIndexService_IGetRecordCount;
    listKeys: IIndexService_IListKeys;
}

interface IIndexService_IHas extends grpc.MethodDefinition<index_pb.HasRequest, index_pb.HasResponse> {
    path: "/index.Index/Has";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.HasRequest>;
    requestDeserialize: grpc.deserialize<index_pb.HasRequest>;
    responseSerialize: grpc.serialize<index_pb.HasResponse>;
    responseDeserialize: grpc.deserialize<index_pb.HasResponse>;
}
interface IIndexService_IGet extends grpc.MethodDefinition<index_pb.GetRequest, index_pb.GetResponse> {
    path: "/index.Index/Get";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.GetRequest>;
    requestDeserialize: grpc.deserialize<index_pb.GetRequest>;
    responseSerialize: grpc.serialize<index_pb.GetResponse>;
    responseDeserialize: grpc.deserialize<index_pb.GetResponse>;
}
interface IIndexService_IGetChunk extends grpc.MethodDefinition<index_pb.GetChunkRequest, index_pb.GetChunkResponse> {
    path: "/index.Index/GetChunk";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.GetChunkRequest>;
    requestDeserialize: grpc.deserialize<index_pb.GetChunkRequest>;
    responseSerialize: grpc.serialize<index_pb.GetChunkResponse>;
    responseDeserialize: grpc.deserialize<index_pb.GetChunkResponse>;
}
interface IIndexService_IGetUntil extends grpc.MethodDefinition<index_pb.GetUntilRequest, index_pb.GetUntilResponse> {
    path: "/index.Index/GetUntil";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.GetUntilRequest>;
    requestDeserialize: grpc.deserialize<index_pb.GetUntilRequest>;
    responseSerialize: grpc.serialize<index_pb.GetUntilResponse>;
    responseDeserialize: grpc.deserialize<index_pb.GetUntilResponse>;
}
interface IIndexService_IPut extends grpc.MethodDefinition<index_pb.PutRequest, shared_pb.SuccessResponse> {
    path: "/index.Index/Put";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.PutRequest>;
    requestDeserialize: grpc.deserialize<index_pb.PutRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IIndexService_IDelete extends grpc.MethodDefinition<index_pb.DeleteRequest, shared_pb.SuccessResponse> {
    path: "/index.Index/Delete";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.DeleteRequest>;
    requestDeserialize: grpc.deserialize<index_pb.DeleteRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IIndexService_IClear extends grpc.MethodDefinition<index_pb.ClearRequest, shared_pb.SuccessResponse> {
    path: "/index.Index/Clear";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.ClearRequest>;
    requestDeserialize: grpc.deserialize<index_pb.ClearRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IIndexService_ISize extends grpc.MethodDefinition<index_pb.SizeRequest, index_pb.SizeResponse> {
    path: "/index.Index/Size";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.SizeRequest>;
    requestDeserialize: grpc.deserialize<index_pb.SizeRequest>;
    responseSerialize: grpc.serialize<index_pb.SizeResponse>;
    responseDeserialize: grpc.deserialize<index_pb.SizeResponse>;
}
interface IIndexService_IGetRecordSize extends grpc.MethodDefinition<index_pb.GetRecordSizeRequest, index_pb.GetRecordSizeResponse> {
    path: "/index.Index/GetRecordSize";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.GetRecordSizeRequest>;
    requestDeserialize: grpc.deserialize<index_pb.GetRecordSizeRequest>;
    responseSerialize: grpc.serialize<index_pb.GetRecordSizeResponse>;
    responseDeserialize: grpc.deserialize<index_pb.GetRecordSizeResponse>;
}
interface IIndexService_IGetRecordCount extends grpc.MethodDefinition<index_pb.GetRecordCountRequest, index_pb.GetRecordCountResponse> {
    path: "/index.Index/GetRecordCount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.GetRecordCountRequest>;
    requestDeserialize: grpc.deserialize<index_pb.GetRecordCountRequest>;
    responseSerialize: grpc.serialize<index_pb.GetRecordCountResponse>;
    responseDeserialize: grpc.deserialize<index_pb.GetRecordCountResponse>;
}
interface IIndexService_IListKeys extends grpc.MethodDefinition<index_pb.ListKeysRequest, index_pb.ListKeysResponse> {
    path: "/index.Index/ListKeys";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<index_pb.ListKeysRequest>;
    requestDeserialize: grpc.deserialize<index_pb.ListKeysRequest>;
    responseSerialize: grpc.serialize<index_pb.ListKeysResponse>;
    responseDeserialize: grpc.deserialize<index_pb.ListKeysResponse>;
}

export const IndexService: IIndexService;

export interface IIndexServer extends grpc.UntypedServiceImplementation {
    has: grpc.handleUnaryCall<index_pb.HasRequest, index_pb.HasResponse>;
    get: grpc.handleUnaryCall<index_pb.GetRequest, index_pb.GetResponse>;
    getChunk: grpc.handleUnaryCall<index_pb.GetChunkRequest, index_pb.GetChunkResponse>;
    getUntil: grpc.handleUnaryCall<index_pb.GetUntilRequest, index_pb.GetUntilResponse>;
    put: grpc.handleUnaryCall<index_pb.PutRequest, shared_pb.SuccessResponse>;
    delete: grpc.handleUnaryCall<index_pb.DeleteRequest, shared_pb.SuccessResponse>;
    clear: grpc.handleUnaryCall<index_pb.ClearRequest, shared_pb.SuccessResponse>;
    size: grpc.handleUnaryCall<index_pb.SizeRequest, index_pb.SizeResponse>;
    getRecordSize: grpc.handleUnaryCall<index_pb.GetRecordSizeRequest, index_pb.GetRecordSizeResponse>;
    getRecordCount: grpc.handleUnaryCall<index_pb.GetRecordCountRequest, index_pb.GetRecordCountResponse>;
    listKeys: grpc.handleUnaryCall<index_pb.ListKeysRequest, index_pb.ListKeysResponse>;
}

export interface IIndexClient {
    has(request: index_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: index_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: index_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    get(request: index_pb.GetRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    get(request: index_pb.GetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    get(request: index_pb.GetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: index_pb.GetChunkRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: index_pb.GetChunkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: index_pb.GetChunkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: index_pb.GetUntilRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: index_pb.GetUntilRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: index_pb.GetUntilRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    put(request: index_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: index_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: index_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: index_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: index_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: index_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: index_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: index_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: index_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    size(request: index_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: index_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: index_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: index_pb.GetRecordSizeRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: index_pb.GetRecordSizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: index_pb.GetRecordSizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: index_pb.GetRecordCountRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: index_pb.GetRecordCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: index_pb.GetRecordCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: index_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: index_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: index_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}

export class IndexClient extends grpc.Client implements IIndexClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public has(request: index_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: index_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: index_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public get(request: index_pb.GetRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public get(request: index_pb.GetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public get(request: index_pb.GetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: index_pb.GetChunkRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: index_pb.GetChunkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: index_pb.GetChunkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: index_pb.GetUntilRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: index_pb.GetUntilRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: index_pb.GetUntilRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public put(request: index_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: index_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: index_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: index_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: index_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: index_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: index_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: index_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: index_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public size(request: index_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: index_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: index_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: index_pb.GetRecordSizeRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: index_pb.GetRecordSizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: index_pb.GetRecordSizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: index_pb.GetRecordCountRequest, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: index_pb.GetRecordCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: index_pb.GetRecordCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: index_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: index_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: index_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: index_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}
