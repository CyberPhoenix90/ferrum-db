// package: 
// file: database.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as database_pb from "./database_pb";
import * as shared_pb from "./shared_pb";
import * as collection_pb from "./collection_pb";

interface IDatabaseService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createCollection: IDatabaseService_ICreateCollection;
    createCollectionIfNotExist: IDatabaseService_ICreateCollectionIfNotExist;
    deleteCollection: IDatabaseService_IDeleteCollection;
    hasCollection: IDatabaseService_IHasCollection;
    listCollections: IDatabaseService_IListCollections;
}

interface IDatabaseService_ICreateCollection extends grpc.MethodDefinition<database_pb.CreateCollectionRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateCollection";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateCollectionRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateCollectionRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_ICreateCollectionIfNotExist extends grpc.MethodDefinition<database_pb.CreateCollectionRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateCollectionIfNotExist";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateCollectionRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateCollectionRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IDeleteCollection extends grpc.MethodDefinition<database_pb.DeleteCollectionRequest, shared_pb.SuccessResponse> {
    path: "/Database/DeleteCollection";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.DeleteCollectionRequest>;
    requestDeserialize: grpc.deserialize<database_pb.DeleteCollectionRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IHasCollection extends grpc.MethodDefinition<database_pb.HasCollectionRequest, database_pb.HasCollectionResponse> {
    path: "/Database/HasCollection";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.HasCollectionRequest>;
    requestDeserialize: grpc.deserialize<database_pb.HasCollectionRequest>;
    responseSerialize: grpc.serialize<database_pb.HasCollectionResponse>;
    responseDeserialize: grpc.deserialize<database_pb.HasCollectionResponse>;
}
interface IDatabaseService_IListCollections extends grpc.MethodDefinition<database_pb.ListCollectionsRequest, database_pb.ListCollectionsResponse> {
    path: "/Database/ListCollections";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.ListCollectionsRequest>;
    requestDeserialize: grpc.deserialize<database_pb.ListCollectionsRequest>;
    responseSerialize: grpc.serialize<database_pb.ListCollectionsResponse>;
    responseDeserialize: grpc.deserialize<database_pb.ListCollectionsResponse>;
}

export const DatabaseService: IDatabaseService;

export interface IDatabaseServer extends grpc.UntypedServiceImplementation {
    createCollection: grpc.handleUnaryCall<database_pb.CreateCollectionRequest, shared_pb.SuccessResponse>;
    createCollectionIfNotExist: grpc.handleUnaryCall<database_pb.CreateCollectionRequest, shared_pb.SuccessResponse>;
    deleteCollection: grpc.handleUnaryCall<database_pb.DeleteCollectionRequest, shared_pb.SuccessResponse>;
    hasCollection: grpc.handleUnaryCall<database_pb.HasCollectionRequest, database_pb.HasCollectionResponse>;
    listCollections: grpc.handleUnaryCall<database_pb.ListCollectionsRequest, database_pb.ListCollectionsResponse>;
}

export interface IDatabaseClient {
    createCollection(request: database_pb.CreateCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createCollection(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createCollection(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteCollection(request: database_pb.DeleteCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteCollection(request: database_pb.DeleteCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteCollection(request: database_pb.DeleteCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    hasCollection(request: database_pb.HasCollectionRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    hasCollection(request: database_pb.HasCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    hasCollection(request: database_pb.HasCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    listCollections(request: database_pb.ListCollectionsRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
    listCollections(request: database_pb.ListCollectionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
    listCollections(request: database_pb.ListCollectionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
}

export class DatabaseClient extends grpc.Client implements IDatabaseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createCollection(request: database_pb.CreateCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createCollection(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createCollection(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createCollectionIfNotExist(request: database_pb.CreateCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteCollection(request: database_pb.DeleteCollectionRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteCollection(request: database_pb.DeleteCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteCollection(request: database_pb.DeleteCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public hasCollection(request: database_pb.HasCollectionRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    public hasCollection(request: database_pb.HasCollectionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    public hasCollection(request: database_pb.HasCollectionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasCollectionResponse) => void): grpc.ClientUnaryCall;
    public listCollections(request: database_pb.ListCollectionsRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
    public listCollections(request: database_pb.ListCollectionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
    public listCollections(request: database_pb.ListCollectionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListCollectionsResponse) => void): grpc.ClientUnaryCall;
}
