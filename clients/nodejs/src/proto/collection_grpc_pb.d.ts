// package: 
// file: collection.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as collection_pb from "./collection_pb";
import * as shared_pb from "./shared_pb";

interface ICollectionService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    listMeta: ICollectionService_IListMeta;
    deleteMeta: ICollectionService_IDeleteMeta;
    hasMeta: ICollectionService_IHasMeta;
    getMeta: ICollectionService_IGetMeta;
    setMeta: ICollectionService_ISetMeta;
    has: ICollectionService_IHas;
    get: ICollectionService_IGet;
    getChunk: ICollectionService_IGetChunk;
    getUntil: ICollectionService_IGetUntil;
    put: ICollectionService_IPut;
    delete: ICollectionService_IDelete;
    clear: ICollectionService_IClear;
    size: ICollectionService_ISize;
    getRecordSize: ICollectionService_IGetRecordSize;
    getRecordCount: ICollectionService_IGetRecordCount;
    listKeys: ICollectionService_IListKeys;
}

interface ICollectionService_IListMeta extends grpc.MethodDefinition<collection_pb.ListMetaRequest, collection_pb.ListMetaResponse> {
    path: "/Collection/ListMeta";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.ListMetaRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.ListMetaRequest>;
    responseSerialize: grpc.serialize<collection_pb.ListMetaResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.ListMetaResponse>;
}
interface ICollectionService_IDeleteMeta extends grpc.MethodDefinition<collection_pb.DeleteMetaRequest, collection_pb.DeleteMetaResponse> {
    path: "/Collection/DeleteMeta";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.DeleteMetaRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.DeleteMetaRequest>;
    responseSerialize: grpc.serialize<collection_pb.DeleteMetaResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.DeleteMetaResponse>;
}
interface ICollectionService_IHasMeta extends grpc.MethodDefinition<collection_pb.HasMetaRequest, collection_pb.HasMetaResponse> {
    path: "/Collection/HasMeta";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.HasMetaRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.HasMetaRequest>;
    responseSerialize: grpc.serialize<collection_pb.HasMetaResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.HasMetaResponse>;
}
interface ICollectionService_IGetMeta extends grpc.MethodDefinition<collection_pb.GetMetaRequest, collection_pb.GetMetaResponse> {
    path: "/Collection/GetMeta";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetMetaRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetMetaRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetMetaResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetMetaResponse>;
}
interface ICollectionService_ISetMeta extends grpc.MethodDefinition<collection_pb.SetMetaRequest, collection_pb.SetMetaResponse> {
    path: "/Collection/SetMeta";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.SetMetaRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.SetMetaRequest>;
    responseSerialize: grpc.serialize<collection_pb.SetMetaResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.SetMetaResponse>;
}
interface ICollectionService_IHas extends grpc.MethodDefinition<collection_pb.HasRequest, collection_pb.HasResponse> {
    path: "/Collection/Has";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.HasRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.HasRequest>;
    responseSerialize: grpc.serialize<collection_pb.HasResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.HasResponse>;
}
interface ICollectionService_IGet extends grpc.MethodDefinition<collection_pb.GetRequest, collection_pb.GetResponse> {
    path: "/Collection/Get";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetResponse>;
}
interface ICollectionService_IGetChunk extends grpc.MethodDefinition<collection_pb.GetChunkRequest, collection_pb.GetChunkResponse> {
    path: "/Collection/GetChunk";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetChunkRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetChunkRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetChunkResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetChunkResponse>;
}
interface ICollectionService_IGetUntil extends grpc.MethodDefinition<collection_pb.GetUntilRequest, collection_pb.GetUntilResponse> {
    path: "/Collection/GetUntil";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetUntilRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetUntilRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetUntilResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetUntilResponse>;
}
interface ICollectionService_IPut extends grpc.MethodDefinition<collection_pb.PutRequest, shared_pb.SuccessResponse> {
    path: "/Collection/Put";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.PutRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.PutRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ICollectionService_IDelete extends grpc.MethodDefinition<collection_pb.DeleteRequest, shared_pb.SuccessResponse> {
    path: "/Collection/Delete";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.DeleteRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.DeleteRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ICollectionService_IClear extends grpc.MethodDefinition<collection_pb.ClearRequest, shared_pb.SuccessResponse> {
    path: "/Collection/Clear";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.ClearRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.ClearRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ICollectionService_ISize extends grpc.MethodDefinition<collection_pb.SizeRequest, collection_pb.SizeResponse> {
    path: "/Collection/Size";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.SizeRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.SizeRequest>;
    responseSerialize: grpc.serialize<collection_pb.SizeResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.SizeResponse>;
}
interface ICollectionService_IGetRecordSize extends grpc.MethodDefinition<collection_pb.GetRecordSizeRequest, collection_pb.GetRecordSizeResponse> {
    path: "/Collection/GetRecordSize";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetRecordSizeRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetRecordSizeRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetRecordSizeResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetRecordSizeResponse>;
}
interface ICollectionService_IGetRecordCount extends grpc.MethodDefinition<collection_pb.GetRecordCountRequest, collection_pb.GetRecordCountResponse> {
    path: "/Collection/GetRecordCount";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetRecordCountRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetRecordCountRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetRecordCountResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetRecordCountResponse>;
}
interface ICollectionService_IListKeys extends grpc.MethodDefinition<collection_pb.ListKeysRequest, collection_pb.ListKeysResponse> {
    path: "/Collection/ListKeys";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.ListKeysRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.ListKeysRequest>;
    responseSerialize: grpc.serialize<collection_pb.ListKeysResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.ListKeysResponse>;
}

export const CollectionService: ICollectionService;

export interface ICollectionServer extends grpc.UntypedServiceImplementation {
    listMeta: grpc.handleUnaryCall<collection_pb.ListMetaRequest, collection_pb.ListMetaResponse>;
    deleteMeta: grpc.handleUnaryCall<collection_pb.DeleteMetaRequest, collection_pb.DeleteMetaResponse>;
    hasMeta: grpc.handleUnaryCall<collection_pb.HasMetaRequest, collection_pb.HasMetaResponse>;
    getMeta: grpc.handleUnaryCall<collection_pb.GetMetaRequest, collection_pb.GetMetaResponse>;
    setMeta: grpc.handleUnaryCall<collection_pb.SetMetaRequest, collection_pb.SetMetaResponse>;
    has: grpc.handleUnaryCall<collection_pb.HasRequest, collection_pb.HasResponse>;
    get: grpc.handleUnaryCall<collection_pb.GetRequest, collection_pb.GetResponse>;
    getChunk: grpc.handleUnaryCall<collection_pb.GetChunkRequest, collection_pb.GetChunkResponse>;
    getUntil: grpc.handleUnaryCall<collection_pb.GetUntilRequest, collection_pb.GetUntilResponse>;
    put: grpc.handleUnaryCall<collection_pb.PutRequest, shared_pb.SuccessResponse>;
    delete: grpc.handleUnaryCall<collection_pb.DeleteRequest, shared_pb.SuccessResponse>;
    clear: grpc.handleUnaryCall<collection_pb.ClearRequest, shared_pb.SuccessResponse>;
    size: grpc.handleUnaryCall<collection_pb.SizeRequest, collection_pb.SizeResponse>;
    getRecordSize: grpc.handleUnaryCall<collection_pb.GetRecordSizeRequest, collection_pb.GetRecordSizeResponse>;
    getRecordCount: grpc.handleUnaryCall<collection_pb.GetRecordCountRequest, collection_pb.GetRecordCountResponse>;
    listKeys: grpc.handleUnaryCall<collection_pb.ListKeysRequest, collection_pb.ListKeysResponse>;
}

export interface ICollectionClient {
    listMeta(request: collection_pb.ListMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    listMeta(request: collection_pb.ListMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    listMeta(request: collection_pb.ListMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    deleteMeta(request: collection_pb.DeleteMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    deleteMeta(request: collection_pb.DeleteMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    deleteMeta(request: collection_pb.DeleteMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    hasMeta(request: collection_pb.HasMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    hasMeta(request: collection_pb.HasMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    hasMeta(request: collection_pb.HasMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    getMeta(request: collection_pb.GetMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    getMeta(request: collection_pb.GetMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    getMeta(request: collection_pb.GetMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    setMeta(request: collection_pb.SetMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    setMeta(request: collection_pb.SetMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    setMeta(request: collection_pb.SetMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    has(request: collection_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: collection_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: collection_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    get(request: collection_pb.GetRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    get(request: collection_pb.GetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    get(request: collection_pb.GetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: collection_pb.GetChunkRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: collection_pb.GetChunkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getChunk(request: collection_pb.GetChunkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: collection_pb.GetUntilRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: collection_pb.GetUntilRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    getUntil(request: collection_pb.GetUntilRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    put(request: collection_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: collection_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: collection_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: collection_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: collection_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: collection_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: collection_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: collection_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: collection_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    size(request: collection_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: collection_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: collection_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: collection_pb.GetRecordSizeRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: collection_pb.GetRecordSizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordSize(request: collection_pb.GetRecordSizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: collection_pb.GetRecordCountRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: collection_pb.GetRecordCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    getRecordCount(request: collection_pb.GetRecordCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: collection_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: collection_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: collection_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}

export class CollectionClient extends grpc.Client implements ICollectionClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public listMeta(request: collection_pb.ListMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    public listMeta(request: collection_pb.ListMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    public listMeta(request: collection_pb.ListMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListMetaResponse) => void): grpc.ClientUnaryCall;
    public deleteMeta(request: collection_pb.DeleteMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    public deleteMeta(request: collection_pb.DeleteMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    public deleteMeta(request: collection_pb.DeleteMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteMetaResponse) => void): grpc.ClientUnaryCall;
    public hasMeta(request: collection_pb.HasMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    public hasMeta(request: collection_pb.HasMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    public hasMeta(request: collection_pb.HasMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasMetaResponse) => void): grpc.ClientUnaryCall;
    public getMeta(request: collection_pb.GetMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    public getMeta(request: collection_pb.GetMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    public getMeta(request: collection_pb.GetMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetMetaResponse) => void): grpc.ClientUnaryCall;
    public setMeta(request: collection_pb.SetMetaRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    public setMeta(request: collection_pb.SetMetaRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    public setMeta(request: collection_pb.SetMetaRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SetMetaResponse) => void): grpc.ClientUnaryCall;
    public has(request: collection_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: collection_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: collection_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public get(request: collection_pb.GetRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public get(request: collection_pb.GetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public get(request: collection_pb.GetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: collection_pb.GetChunkRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: collection_pb.GetChunkRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getChunk(request: collection_pb.GetChunkRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetChunkResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: collection_pb.GetUntilRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: collection_pb.GetUntilRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public getUntil(request: collection_pb.GetUntilRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetUntilResponse) => void): grpc.ClientUnaryCall;
    public put(request: collection_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: collection_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: collection_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: collection_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: collection_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: collection_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: collection_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: collection_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: collection_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public size(request: collection_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: collection_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: collection_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: collection_pb.GetRecordSizeRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: collection_pb.GetRecordSizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordSize(request: collection_pb.GetRecordSizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordSizeResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: collection_pb.GetRecordCountRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: collection_pb.GetRecordCountRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public getRecordCount(request: collection_pb.GetRecordCountRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetRecordCountResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: collection_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: collection_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: collection_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}
