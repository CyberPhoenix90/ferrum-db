// package: collection
// file: collection.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class ListTagsRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListTagsRequest;
    getCollectiontype(): CollectionType;
    setCollectiontype(value: CollectionType): ListTagsRequest;
    getCollection(): string;
    setCollection(value: string): ListTagsRequest;
    getKey(): string;
    setKey(value: string): ListTagsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTagsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListTagsRequest): ListTagsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTagsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTagsRequest;
    static deserializeBinaryFromReader(message: ListTagsRequest, reader: jspb.BinaryReader): ListTagsRequest;
}

export namespace ListTagsRequest {
    export type AsObject = {
        database: string,
        collectiontype: CollectionType,
        collection: string,
        key: string,
    }
}

export class ListTagsResponse extends jspb.Message { 
    clearTagsList(): void;
    getTagsList(): Array<string>;
    setTagsList(value: Array<string>): ListTagsResponse;
    addTags(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListTagsResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTagsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTagsResponse): ListTagsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTagsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTagsResponse;
    static deserializeBinaryFromReader(message: ListTagsResponse, reader: jspb.BinaryReader): ListTagsResponse;
}

export namespace ListTagsResponse {
    export type AsObject = {
        tagsList: Array<string>,
        error?: string,
    }
}

export class DeleteTagRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteTagRequest;
    getCollectiontype(): CollectionType;
    setCollectiontype(value: CollectionType): DeleteTagRequest;
    getCollection(): string;
    setCollection(value: string): DeleteTagRequest;
    getKey(): string;
    setKey(value: string): DeleteTagRequest;
    getTag(): string;
    setTag(value: string): DeleteTagRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteTagRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteTagRequest): DeleteTagRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteTagRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteTagRequest;
    static deserializeBinaryFromReader(message: DeleteTagRequest, reader: jspb.BinaryReader): DeleteTagRequest;
}

export namespace DeleteTagRequest {
    export type AsObject = {
        database: string,
        collectiontype: CollectionType,
        collection: string,
        key: string,
        tag: string,
    }
}

export class DeleteTagResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): DeleteTagResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteTagResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteTagResponse): DeleteTagResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteTagResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteTagResponse;
    static deserializeBinaryFromReader(message: DeleteTagResponse, reader: jspb.BinaryReader): DeleteTagResponse;
}

export namespace DeleteTagResponse {
    export type AsObject = {
        error?: string,
    }
}

export class HasTagRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasTagRequest;
    getCollectiontype(): CollectionType;
    setCollectiontype(value: CollectionType): HasTagRequest;
    getCollection(): string;
    setCollection(value: string): HasTagRequest;
    getKey(): string;
    setKey(value: string): HasTagRequest;
    getTag(): string;
    setTag(value: string): HasTagRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasTagRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasTagRequest): HasTagRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasTagRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasTagRequest;
    static deserializeBinaryFromReader(message: HasTagRequest, reader: jspb.BinaryReader): HasTagRequest;
}

export namespace HasTagRequest {
    export type AsObject = {
        database: string,
        collectiontype: CollectionType,
        collection: string,
        key: string,
        tag: string,
    }
}

export class HasTagResponse extends jspb.Message { 

    hasHastag(): boolean;
    clearHastag(): void;
    getHastag(): boolean | undefined;
    setHastag(value: boolean): HasTagResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasTagResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasTagResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasTagResponse): HasTagResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasTagResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasTagResponse;
    static deserializeBinaryFromReader(message: HasTagResponse, reader: jspb.BinaryReader): HasTagResponse;
}

export namespace HasTagResponse {
    export type AsObject = {
        hastag?: boolean,
        error?: string,
    }
}

export class GetTagRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetTagRequest;
    getCollectiontype(): CollectionType;
    setCollectiontype(value: CollectionType): GetTagRequest;
    getCollection(): string;
    setCollection(value: string): GetTagRequest;
    getTag(): string;
    setTag(value: string): GetTagRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetTagRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetTagRequest): GetTagRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetTagRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetTagRequest;
    static deserializeBinaryFromReader(message: GetTagRequest, reader: jspb.BinaryReader): GetTagRequest;
}

export namespace GetTagRequest {
    export type AsObject = {
        database: string,
        collectiontype: CollectionType,
        collection: string,
        tag: string,
    }
}

export class GetTagResponse extends jspb.Message { 
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): GetTagResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetTagResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetTagResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetTagResponse): GetTagResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetTagResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetTagResponse;
    static deserializeBinaryFromReader(message: GetTagResponse, reader: jspb.BinaryReader): GetTagResponse;
}

export namespace GetTagResponse {
    export type AsObject = {
        value: Uint8Array | string,
        error?: string,
    }
}

export class SetTagRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): SetTagRequest;
    getCollectiontype(): CollectionType;
    setCollectiontype(value: CollectionType): SetTagRequest;
    getCollection(): string;
    setCollection(value: string): SetTagRequest;
    getTag(): string;
    setTag(value: string): SetTagRequest;
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): SetTagRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetTagRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetTagRequest): SetTagRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetTagRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetTagRequest;
    static deserializeBinaryFromReader(message: SetTagRequest, reader: jspb.BinaryReader): SetTagRequest;
}

export namespace SetTagRequest {
    export type AsObject = {
        database: string,
        collectiontype: CollectionType,
        collection: string,
        tag: string,
        value: Uint8Array | string,
    }
}

export class SetTagResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): SetTagResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetTagResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SetTagResponse): SetTagResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetTagResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetTagResponse;
    static deserializeBinaryFromReader(message: SetTagResponse, reader: jspb.BinaryReader): SetTagResponse;
}

export namespace SetTagResponse {
    export type AsObject = {
        error?: string,
    }
}

export enum CollectionType {
    INDEX = 0,
    SET = 1,
    TIMESERIES = 2,
}
