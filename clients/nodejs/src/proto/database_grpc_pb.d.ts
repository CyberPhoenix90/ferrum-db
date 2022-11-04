// package: 
// file: database.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as database_pb from "./database_pb";
import * as shared_pb from "./shared_pb";

interface IDatabaseService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createIndex: IDatabaseService_ICreateIndex;
    createIndexIfNotExist: IDatabaseService_ICreateIndexIfNotExist;
    deleteIndex: IDatabaseService_IDeleteIndex;
    hasIndex: IDatabaseService_IHasIndex;
    listIndexes: IDatabaseService_IListIndexes;
    createSet: IDatabaseService_ICreateSet;
    createSetIfNotExist: IDatabaseService_ICreateSetIfNotExist;
    deleteSet: IDatabaseService_IDeleteSet;
    hasSet: IDatabaseService_IHasSet;
    listSets: IDatabaseService_IListSets;
    createTimeSeries: IDatabaseService_ICreateTimeSeries;
    createTimeSeriesIfNotExist: IDatabaseService_ICreateTimeSeriesIfNotExist;
    deleteTimeSeries: IDatabaseService_IDeleteTimeSeries;
    hasTimeSeries: IDatabaseService_IHasTimeSeries;
    listTimeSeries: IDatabaseService_IListTimeSeries;
}

interface IDatabaseService_ICreateIndex extends grpc.MethodDefinition<database_pb.CreateIndexRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateIndex";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateIndexRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateIndexRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_ICreateIndexIfNotExist extends grpc.MethodDefinition<database_pb.CreateIndexRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateIndexIfNotExist";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateIndexRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateIndexRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IDeleteIndex extends grpc.MethodDefinition<database_pb.DeleteIndexRequest, shared_pb.SuccessResponse> {
    path: "/Database/DeleteIndex";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.DeleteIndexRequest>;
    requestDeserialize: grpc.deserialize<database_pb.DeleteIndexRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IHasIndex extends grpc.MethodDefinition<database_pb.HasIndexRequest, database_pb.HasIndexResponse> {
    path: "/Database/HasIndex";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.HasIndexRequest>;
    requestDeserialize: grpc.deserialize<database_pb.HasIndexRequest>;
    responseSerialize: grpc.serialize<database_pb.HasIndexResponse>;
    responseDeserialize: grpc.deserialize<database_pb.HasIndexResponse>;
}
interface IDatabaseService_IListIndexes extends grpc.MethodDefinition<database_pb.ListIndexesRequest, database_pb.ListIndexesResponse> {
    path: "/Database/ListIndexes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.ListIndexesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.ListIndexesRequest>;
    responseSerialize: grpc.serialize<database_pb.ListIndexesResponse>;
    responseDeserialize: grpc.deserialize<database_pb.ListIndexesResponse>;
}
interface IDatabaseService_ICreateSet extends grpc.MethodDefinition<database_pb.CreateSetRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateSet";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateSetRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateSetRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_ICreateSetIfNotExist extends grpc.MethodDefinition<database_pb.CreateSetRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateSetIfNotExist";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateSetRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateSetRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IDeleteSet extends grpc.MethodDefinition<database_pb.DeleteSetRequest, shared_pb.SuccessResponse> {
    path: "/Database/DeleteSet";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.DeleteSetRequest>;
    requestDeserialize: grpc.deserialize<database_pb.DeleteSetRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IHasSet extends grpc.MethodDefinition<database_pb.HasSetRequest, database_pb.HasSetResponse> {
    path: "/Database/HasSet";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.HasSetRequest>;
    requestDeserialize: grpc.deserialize<database_pb.HasSetRequest>;
    responseSerialize: grpc.serialize<database_pb.HasSetResponse>;
    responseDeserialize: grpc.deserialize<database_pb.HasSetResponse>;
}
interface IDatabaseService_IListSets extends grpc.MethodDefinition<database_pb.ListSetsRequest, database_pb.ListSetsResponse> {
    path: "/Database/ListSets";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.ListSetsRequest>;
    requestDeserialize: grpc.deserialize<database_pb.ListSetsRequest>;
    responseSerialize: grpc.serialize<database_pb.ListSetsResponse>;
    responseDeserialize: grpc.deserialize<database_pb.ListSetsResponse>;
}
interface IDatabaseService_ICreateTimeSeries extends grpc.MethodDefinition<database_pb.CreateTimeSeriesRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateTimeSeries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateTimeSeriesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateTimeSeriesRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_ICreateTimeSeriesIfNotExist extends grpc.MethodDefinition<database_pb.CreateTimeSeriesRequest, shared_pb.SuccessResponse> {
    path: "/Database/CreateTimeSeriesIfNotExist";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.CreateTimeSeriesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.CreateTimeSeriesRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IDeleteTimeSeries extends grpc.MethodDefinition<database_pb.DeleteTimeSeriesRequest, shared_pb.SuccessResponse> {
    path: "/Database/DeleteTimeSeries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.DeleteTimeSeriesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.DeleteTimeSeriesRequest>;
    responseSerialize: grpc.serialize<shared_pb.SuccessResponse>;
    responseDeserialize: grpc.deserialize<shared_pb.SuccessResponse>;
}
interface IDatabaseService_IHasTimeSeries extends grpc.MethodDefinition<database_pb.HasTimeSeriesRequest, database_pb.HasTimeSeriesResponse> {
    path: "/Database/HasTimeSeries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.HasTimeSeriesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.HasTimeSeriesRequest>;
    responseSerialize: grpc.serialize<database_pb.HasTimeSeriesResponse>;
    responseDeserialize: grpc.deserialize<database_pb.HasTimeSeriesResponse>;
}
interface IDatabaseService_IListTimeSeries extends grpc.MethodDefinition<database_pb.ListTimeSeriesRequest, database_pb.ListTimeSeriesResponse> {
    path: "/Database/ListTimeSeries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<database_pb.ListTimeSeriesRequest>;
    requestDeserialize: grpc.deserialize<database_pb.ListTimeSeriesRequest>;
    responseSerialize: grpc.serialize<database_pb.ListTimeSeriesResponse>;
    responseDeserialize: grpc.deserialize<database_pb.ListTimeSeriesResponse>;
}

export const DatabaseService: IDatabaseService;

export interface IDatabaseServer extends grpc.UntypedServiceImplementation {
    createIndex: grpc.handleUnaryCall<database_pb.CreateIndexRequest, shared_pb.SuccessResponse>;
    createIndexIfNotExist: grpc.handleUnaryCall<database_pb.CreateIndexRequest, shared_pb.SuccessResponse>;
    deleteIndex: grpc.handleUnaryCall<database_pb.DeleteIndexRequest, shared_pb.SuccessResponse>;
    hasIndex: grpc.handleUnaryCall<database_pb.HasIndexRequest, database_pb.HasIndexResponse>;
    listIndexes: grpc.handleUnaryCall<database_pb.ListIndexesRequest, database_pb.ListIndexesResponse>;
    createSet: grpc.handleUnaryCall<database_pb.CreateSetRequest, shared_pb.SuccessResponse>;
    createSetIfNotExist: grpc.handleUnaryCall<database_pb.CreateSetRequest, shared_pb.SuccessResponse>;
    deleteSet: grpc.handleUnaryCall<database_pb.DeleteSetRequest, shared_pb.SuccessResponse>;
    hasSet: grpc.handleUnaryCall<database_pb.HasSetRequest, database_pb.HasSetResponse>;
    listSets: grpc.handleUnaryCall<database_pb.ListSetsRequest, database_pb.ListSetsResponse>;
    createTimeSeries: grpc.handleUnaryCall<database_pb.CreateTimeSeriesRequest, shared_pb.SuccessResponse>;
    createTimeSeriesIfNotExist: grpc.handleUnaryCall<database_pb.CreateTimeSeriesRequest, shared_pb.SuccessResponse>;
    deleteTimeSeries: grpc.handleUnaryCall<database_pb.DeleteTimeSeriesRequest, shared_pb.SuccessResponse>;
    hasTimeSeries: grpc.handleUnaryCall<database_pb.HasTimeSeriesRequest, database_pb.HasTimeSeriesResponse>;
    listTimeSeries: grpc.handleUnaryCall<database_pb.ListTimeSeriesRequest, database_pb.ListTimeSeriesResponse>;
}

export interface IDatabaseClient {
    createIndex(request: database_pb.CreateIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createIndex(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createIndex(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createIndexIfNotExist(request: database_pb.CreateIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createIndexIfNotExist(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createIndexIfNotExist(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteIndex(request: database_pb.DeleteIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteIndex(request: database_pb.DeleteIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteIndex(request: database_pb.DeleteIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    hasIndex(request: database_pb.HasIndexRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    hasIndex(request: database_pb.HasIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    hasIndex(request: database_pb.HasIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    listIndexes(request: database_pb.ListIndexesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    listIndexes(request: database_pb.ListIndexesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    listIndexes(request: database_pb.ListIndexesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    createSet(request: database_pb.CreateSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createSet(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createSet(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createSetIfNotExist(request: database_pb.CreateSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createSetIfNotExist(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createSetIfNotExist(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteSet(request: database_pb.DeleteSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteSet(request: database_pb.DeleteSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteSet(request: database_pb.DeleteSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    hasSet(request: database_pb.HasSetRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    hasSet(request: database_pb.HasSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    hasSet(request: database_pb.HasSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    listSets(request: database_pb.ListSetsRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    listSets(request: database_pb.ListSetsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    listSets(request: database_pb.ListSetsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    createTimeSeries(request: database_pb.CreateTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createTimeSeries(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createTimeSeries(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    hasTimeSeries(request: database_pb.HasTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    hasTimeSeries(request: database_pb.HasTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    hasTimeSeries(request: database_pb.HasTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    listTimeSeries(request: database_pb.ListTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    listTimeSeries(request: database_pb.ListTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    listTimeSeries(request: database_pb.ListTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
}

export class DatabaseClient extends grpc.Client implements IDatabaseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createIndex(request: database_pb.CreateIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createIndex(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createIndex(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createIndexIfNotExist(request: database_pb.CreateIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createIndexIfNotExist(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createIndexIfNotExist(request: database_pb.CreateIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteIndex(request: database_pb.DeleteIndexRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteIndex(request: database_pb.DeleteIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteIndex(request: database_pb.DeleteIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public hasIndex(request: database_pb.HasIndexRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    public hasIndex(request: database_pb.HasIndexRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    public hasIndex(request: database_pb.HasIndexRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasIndexResponse) => void): grpc.ClientUnaryCall;
    public listIndexes(request: database_pb.ListIndexesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    public listIndexes(request: database_pb.ListIndexesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    public listIndexes(request: database_pb.ListIndexesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListIndexesResponse) => void): grpc.ClientUnaryCall;
    public createSet(request: database_pb.CreateSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createSet(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createSet(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createSetIfNotExist(request: database_pb.CreateSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createSetIfNotExist(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createSetIfNotExist(request: database_pb.CreateSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteSet(request: database_pb.DeleteSetRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteSet(request: database_pb.DeleteSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteSet(request: database_pb.DeleteSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public hasSet(request: database_pb.HasSetRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    public hasSet(request: database_pb.HasSetRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    public hasSet(request: database_pb.HasSetRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasSetResponse) => void): grpc.ClientUnaryCall;
    public listSets(request: database_pb.ListSetsRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    public listSets(request: database_pb.ListSetsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    public listSets(request: database_pb.ListSetsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListSetsResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeries(request: database_pb.CreateTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeries(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeries(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public createTimeSeriesIfNotExist(request: database_pb.CreateTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public deleteTimeSeries(request: database_pb.DeleteTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: shared_pb.SuccessResponse) => void): grpc.ClientUnaryCall;
    public hasTimeSeries(request: database_pb.HasTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    public hasTimeSeries(request: database_pb.HasTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    public hasTimeSeries(request: database_pb.HasTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.HasTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    public listTimeSeries(request: database_pb.ListTimeSeriesRequest, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    public listTimeSeries(request: database_pb.ListTimeSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
    public listTimeSeries(request: database_pb.ListTimeSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: database_pb.ListTimeSeriesResponse) => void): grpc.ClientUnaryCall;
}
