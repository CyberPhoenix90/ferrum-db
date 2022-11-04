// package: 
// file: database_server.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as database_server_pb from "./database_server_pb";
import * as shared_pb from "./shared_pb";

interface IDatabaseServerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createDatabase: IDatabaseServerService_ICreateDatabase;
    createDatabaseIfNotExist: IDatabaseServerService_ICreateDatabaseIfNotExist;
    hasDatabase: IDatabaseServerService_IHasDatabase;
    dropDatabase: IDatabaseServerService_IDropDatabase;
    clearDatabase: IDatabaseServerService_IClearDatabase;
    listDatabases: IDatabaseServerService_IListDatabases;
    compactDatabase: IDatabaseServerService_ICompactDatabase;
}

interface IDatabaseServerService_ICreateDatabase extends grpc.MethodDefinition<database_server_pb.CreateDatabaseRequest, shared_pb.SuccessResponse> {
    path: "/DatabaseServer/CreateDatabase";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.CreateDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.CreateDatabaseRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseServerService_ICreateDatabaseIfNotExist extends grpc.MethodDefinition<database_server_pb.CreateDatabaseRequest, shared_pb.SuccessResponse> {
    path: "/DatabaseServer/CreateDatabaseIfNotExist";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.CreateDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.CreateDatabaseRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseServerService_IHasDatabase extends grpc.MethodDefinition<database_server_pb.HasDatabaseRequest, database_server_pb.HasDatabaseResponse> {
    path: "/DatabaseServer/HasDatabase";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.HasDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.HasDatabaseRequest>;
    responseSerialize: grpc.serialize<database_server_pb.HasDatabaseResponse>;
    responseDeserialize: grpc.deserialize<database_server_pb.HasDatabaseResponse>;
}
interface IDatabaseServerService_IDropDatabase extends grpc.MethodDefinition<database_server_pb.DropDatabaseRequest, shared_pb.SuccessResponse> {
    path: "/DatabaseServer/DropDatabase";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.DropDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.DropDatabaseRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseServerService_IClearDatabase extends grpc.MethodDefinition<database_server_pb.ClearDatabaseRequest, shared_pb.SuccessResponse> {
    path: "/DatabaseServer/ClearDatabase";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.ClearDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.ClearDatabaseRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseServerService_IListDatabases extends grpc.MethodDefinition<shared_pb.EmptyRequest, database_server_pb.ListDatabasesResponse> {
    path: "/DatabaseServer/ListDatabases";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<shared_pb.EmptyRequest>;
    requestDeserialize: grpc.deserialize<shared_pb.EmptyRequest>;
    responseSerialize: grpc.serialize<database_server_pb.ListDatabasesResponse>;
    responseDeserialize: grpc.deserialize<database_server_pb.ListDatabasesResponse>;
}
interface IDatabaseServerService_ICompactDatabase extends grpc.MethodDefinition<database_server_pb.CompactDatabaseRequest, shared_pb.SuccessResponse> {
    path: "/DatabaseServer/CompactDatabase";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_server_pb.CompactDatabaseRequest>;
    requestDeserialize: grpc.deserialize<database_server_pb.CompactDatabaseRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}

export const DatabaseServerService: IDatabaseServerService;

export interface IDatabaseServerServer extends grpc.UntypedServiceImplementation {
    createDatabase: grpc.handleUnaryCall<database_server_pb.CreateDatabaseRequest, shared_pb.SuccessResponse>;
    createDatabaseIfNotExist: grpc.handleUnaryCall<database_server_pb.CreateDatabaseRequest, shared_pb.SuccessResponse>;
    hasDatabase: grpc.handleUnaryCall<database_server_pb.HasDatabaseRequest, database_server_pb.HasDatabaseResponse>;
    dropDatabase: grpc.handleUnaryCall<database_server_pb.DropDatabaseRequest, shared_pb.SuccessResponse>;
    clearDatabase: grpc.handleUnaryCall<database_server_pb.ClearDatabaseRequest, shared_pb.SuccessResponse>;
    listDatabases: grpc.handleUnaryCall<shared_pb.EmptyRequest, database_server_pb.ListDatabasesResponse>;
    compactDatabase: grpc.handleUnaryCall<database_server_pb.CompactDatabaseRequest, shared_pb.SuccessResponse>;
}

export interface IDatabaseServerClient {
    createDatabase(request: database_server_pb.CreateDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createDatabase(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createDatabase(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    hasDatabase(request: database_server_pb.HasDatabaseRequest, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    hasDatabase(request: database_server_pb.HasDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    hasDatabase(request: database_server_pb.HasDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    dropDatabase(request: database_server_pb.DropDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    dropDatabase(request: database_server_pb.DropDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    dropDatabase(request: database_server_pb.DropDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clearDatabase(request: database_server_pb.ClearDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clearDatabase(request: database_server_pb.ClearDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    clearDatabase(request: database_server_pb.ClearDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    listDatabases(request: shared_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    listDatabases(request: shared_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    listDatabases(request: shared_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    compactDatabase(request: database_server_pb.CompactDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    compactDatabase(request: database_server_pb.CompactDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    compactDatabase(request: database_server_pb.CompactDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
}

export class DatabaseServerClient extends grpc.Client implements IDatabaseServerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createDatabase(request: database_server_pb.CreateDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createDatabase(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createDatabase(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createDatabaseIfNotExist(request: database_server_pb.CreateDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public hasDatabase(request: database_server_pb.HasDatabaseRequest, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    public hasDatabase(request: database_server_pb.HasDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    public hasDatabase(request: database_server_pb.HasDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_server_pb.HasDatabaseResponse) => void): grpc.ClientUnaryCall;
    public dropDatabase(request: database_server_pb.DropDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public dropDatabase(request: database_server_pb.DropDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public dropDatabase(request: database_server_pb.DropDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clearDatabase(request: database_server_pb.ClearDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clearDatabase(request: database_server_pb.ClearDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public clearDatabase(request: database_server_pb.ClearDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public listDatabases(request: shared_pb.EmptyRequest, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    public listDatabases(request: shared_pb.EmptyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    public listDatabases(request: shared_pb.EmptyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_server_pb.ListDatabasesResponse) => void): grpc.ClientUnaryCall;
    public compactDatabase(request: database_server_pb.CompactDatabaseRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public compactDatabase(request: database_server_pb.CompactDatabaseRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public compactDatabase(request: database_server_pb.CompactDatabaseRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
}
