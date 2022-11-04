// package: collection
// file: collection.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as collection_pb from "./collection_pb";
import * as shared_pb from "./shared_pb";

interface ICollectionService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    listTags: ICollectionService_IListTags;
    deleteTag: ICollectionService_IDeleteTag;
    hasTag: ICollectionService_IHasTag;
    getTag: ICollectionService_IGetTag;
    setTag: ICollectionService_ISetTag;
}

interface ICollectionService_IListTags extends grpc.MethodDefinition<collection_pb.ListTagsRequest, collection_pb.ListTagsResponse> {
    path: "/collection.Collection/ListTags";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.ListTagsRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.ListTagsRequest>;
    responseSerialize: grpc.serialize<collection_pb.ListTagsResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.ListTagsResponse>;
}
interface ICollectionService_IDeleteTag extends grpc.MethodDefinition<collection_pb.DeleteTagRequest, collection_pb.DeleteTagResponse> {
    path: "/collection.Collection/DeleteTag";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.DeleteTagRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.DeleteTagRequest>;
    responseSerialize: grpc.serialize<collection_pb.DeleteTagResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.DeleteTagResponse>;
}
interface ICollectionService_IHasTag extends grpc.MethodDefinition<collection_pb.HasTagRequest, collection_pb.HasTagResponse> {
    path: "/collection.Collection/HasTag";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.HasTagRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.HasTagRequest>;
    responseSerialize: grpc.serialize<collection_pb.HasTagResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.HasTagResponse>;
}
interface ICollectionService_IGetTag extends grpc.MethodDefinition<collection_pb.GetTagRequest, collection_pb.GetTagResponse> {
    path: "/collection.Collection/GetTag";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.GetTagRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.GetTagRequest>;
    responseSerialize: grpc.serialize<collection_pb.GetTagResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.GetTagResponse>;
}
interface ICollectionService_ISetTag extends grpc.MethodDefinition<collection_pb.SetTagRequest, collection_pb.SetTagResponse> {
    path: "/collection.Collection/SetTag";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<collection_pb.SetTagRequest>;
    requestDeserialize: grpc.deserialize<collection_pb.SetTagRequest>;
    responseSerialize: grpc.serialize<collection_pb.SetTagResponse>;
    responseDeserialize: grpc.deserialize<collection_pb.SetTagResponse>;
}

export const CollectionService: ICollectionService;

export interface ICollectionServer extends grpc.UntypedServiceImplementation {
    listTags: grpc.handleUnaryCall<collection_pb.ListTagsRequest, collection_pb.ListTagsResponse>;
    deleteTag: grpc.handleUnaryCall<collection_pb.DeleteTagRequest, collection_pb.DeleteTagResponse>;
    hasTag: grpc.handleUnaryCall<collection_pb.HasTagRequest, collection_pb.HasTagResponse>;
    getTag: grpc.handleUnaryCall<collection_pb.GetTagRequest, collection_pb.GetTagResponse>;
    setTag: grpc.handleUnaryCall<collection_pb.SetTagRequest, collection_pb.SetTagResponse>;
}

export interface ICollectionClient {
    listTags(request: collection_pb.ListTagsRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    listTags(request: collection_pb.ListTagsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    listTags(request: collection_pb.ListTagsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    deleteTag(request: collection_pb.DeleteTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    deleteTag(request: collection_pb.DeleteTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    deleteTag(request: collection_pb.DeleteTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    hasTag(request: collection_pb.HasTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    hasTag(request: collection_pb.HasTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    hasTag(request: collection_pb.HasTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    getTag(request: collection_pb.GetTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    getTag(request: collection_pb.GetTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    getTag(request: collection_pb.GetTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    setTag(request: collection_pb.SetTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
    setTag(request: collection_pb.SetTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
    setTag(request: collection_pb.SetTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
}

export class CollectionClient extends grpc.Client implements ICollectionClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public listTags(request: collection_pb.ListTagsRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public listTags(request: collection_pb.ListTagsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public listTags(request: collection_pb.ListTagsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.ListTagsResponse) => void): grpc.ClientUnaryCall;
    public deleteTag(request: collection_pb.DeleteTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    public deleteTag(request: collection_pb.DeleteTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    public deleteTag(request: collection_pb.DeleteTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.DeleteTagResponse) => void): grpc.ClientUnaryCall;
    public hasTag(request: collection_pb.HasTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    public hasTag(request: collection_pb.HasTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    public hasTag(request: collection_pb.HasTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.HasTagResponse) => void): grpc.ClientUnaryCall;
    public getTag(request: collection_pb.GetTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    public getTag(request: collection_pb.GetTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    public getTag(request: collection_pb.GetTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.GetTagResponse) => void): grpc.ClientUnaryCall;
    public setTag(request: collection_pb.SetTagRequest, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
    public setTag(request: collection_pb.SetTagRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
    public setTag(request: collection_pb.SetTagRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: collection_pb.SetTagResponse) => void): grpc.ClientUnaryCall;
}
