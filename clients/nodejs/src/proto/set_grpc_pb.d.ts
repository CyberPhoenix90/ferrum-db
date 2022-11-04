// package: set
// file: set.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as set_pb from "./set_pb";
import * as shared_pb from "./shared_pb";

interface ISetService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    has: ISetService_IHas;
    put: ISetService_IPut;
    delete: ISetService_IDelete;
    clear: ISetService_IClear;
    size: ISetService_ISize;
    listKeys: ISetService_IListKeys;
}

interface ISetService_IHas extends grpc.MethodDefinition<set_pb.HasRequest, set_pb.HasResponse> {
    path: "/set.Set/Has";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.HasRequest>;
    requestDeserialize: grpc.deserialize<set_pb.HasRequest>;
    responseSerialize: grpc.serialize<set_pb.HasResponse>;
    responseDeserialize: grpc.deserialize<set_pb.HasResponse>;
}
interface ISetService_IPut extends grpc.MethodDefinition<set_pb.PutRequest, shared_pb.SuccessResponse> {
    path: "/set.Set/Put";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.PutRequest>;
    requestDeserialize: grpc.deserialize<set_pb.PutRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ISetService_IDelete extends grpc.MethodDefinition<set_pb.DeleteRequest, shared_pb.SuccessResponse> {
    path: "/set.Set/Delete";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.DeleteRequest>;
    requestDeserialize: grpc.deserialize<set_pb.DeleteRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ISetService_IClear extends grpc.MethodDefinition<set_pb.ClearRequest, shared_pb.SuccessResponse> {
    path: "/set.Set/Clear";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.ClearRequest>;
    requestDeserialize: grpc.deserialize<set_pb.ClearRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface ISetService_ISize extends grpc.MethodDefinition<set_pb.SizeRequest, set_pb.SizeResponse> {
    path: "/set.Set/Size";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.SizeRequest>;
    requestDeserialize: grpc.deserialize<set_pb.SizeRequest>;
    responseSerialize: grpc.serialize<set_pb.SizeResponse>;
    responseDeserialize: grpc.deserialize<set_pb.SizeResponse>;
}
interface ISetService_IListKeys extends grpc.MethodDefinition<set_pb.ListKeysRequest, set_pb.ListKeysResponse> {
    path: "/set.Set/ListKeys";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<set_pb.ListKeysRequest>;
    requestDeserialize: grpc.deserialize<set_pb.ListKeysRequest>;
    responseSerialize: grpc.serialize<set_pb.ListKeysResponse>;
    responseDeserialize: grpc.deserialize<set_pb.ListKeysResponse>;
}

export const SetService: ISetService;

export interface ISetServer extends grpc.UntypedServiceImplementation {
    has: grpc.handleUnaryCall<set_pb.HasRequest, set_pb.HasResponse>;
    put: grpc.handleUnaryCall<set_pb.PutRequest, shared_pb.SuccessResponse>;
    delete: grpc.handleUnaryCall<set_pb.DeleteRequest, shared_pb.SuccessResponse>;
    clear: grpc.handleUnaryCall<set_pb.ClearRequest, shared_pb.SuccessResponse>;
    size: grpc.handleUnaryCall<set_pb.SizeRequest, set_pb.SizeResponse>;
    listKeys: grpc.handleUnaryCall<set_pb.ListKeysRequest, set_pb.ListKeysResponse>;
}

export interface ISetClient {
    has(request: set_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: set_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    has(request: set_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    put(request: set_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: set_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    put(request: set_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: set_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: set_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    delete(request: set_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: set_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: set_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clear(request: set_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    size(request: set_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: set_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    size(request: set_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: set_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: set_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    listKeys(request: set_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}

export class SetClient extends grpc.Client implements ISetClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public has(request: set_pb.HasRequest, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: set_pb.HasRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public has(request: set_pb.HasRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.HasResponse) => void): grpc.ClientUnaryCall;
    public put(request: set_pb.PutRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: set_pb.PutRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public put(request: set_pb.PutRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: set_pb.DeleteRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: set_pb.DeleteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public delete(request: set_pb.DeleteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: set_pb.ClearRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: set_pb.ClearRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clear(request: set_pb.ClearRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public size(request: set_pb.SizeRequest, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: set_pb.SizeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public size(request: set_pb.SizeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.SizeResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: set_pb.ListKeysRequest, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: set_pb.ListKeysRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
    public listKeys(request: set_pb.ListKeysRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: set_pb.ListKeysResponse) => void): grpc.ClientUnaryCall;
}
