// package: 
// file: database.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";
import * as collection_pb from "./collection_pb";

export class CreateCollectionRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): CreateCollectionRequest;
    getName(): string;
    setName(value: string): CreateCollectionRequest;
    getPagesize(): number;
    setPagesize(value: number): CreateCollectionRequest;
    getKeytype(): collection_pb.CollectionKeyType;
    setKeytype(value: collection_pb.CollectionKeyType): CreateCollectionRequest;
    getValuetype(): collection_pb.ValueEncodingType;
    setValuetype(value: collection_pb.ValueEncodingType): CreateCollectionRequest;
    getIsarray(): boolean;
    setIsarray(value: boolean): CreateCollectionRequest;
    getCompressionalgorithm(): collection_pb.CompressionAlgorithm;
    setCompressionalgorithm(value: collection_pb.CompressionAlgorithm): CreateCollectionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateCollectionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateCollectionRequest): CreateCollectionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateCollectionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateCollectionRequest;
    static deserializeBinaryFromReader(message: CreateCollectionRequest, reader: jspb.BinaryReader): CreateCollectionRequest;
}

export namespace CreateCollectionRequest {
    export type AsObject = {
        database: string,
        name: string,
        pagesize: number,
        keytype: collection_pb.CollectionKeyType,
        valuetype: collection_pb.ValueEncodingType,
        isarray: boolean,
        compressionalgorithm: collection_pb.CompressionAlgorithm,
    }
}

export class DeleteCollectionRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteCollectionRequest;
    getName(): string;
    setName(value: string): DeleteCollectionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteCollectionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteCollectionRequest): DeleteCollectionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteCollectionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteCollectionRequest;
    static deserializeBinaryFromReader(message: DeleteCollectionRequest, reader: jspb.BinaryReader): DeleteCollectionRequest;
}

export namespace DeleteCollectionRequest {
    export type AsObject = {
        database: string,
        name: string,
    }
}

export class HasCollectionRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasCollectionRequest;
    getName(): string;
    setName(value: string): HasCollectionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasCollectionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasCollectionRequest): HasCollectionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasCollectionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasCollectionRequest;
    static deserializeBinaryFromReader(message: HasCollectionRequest, reader: jspb.BinaryReader): HasCollectionRequest;
}

export namespace HasCollectionRequest {
    export type AsObject = {
        database: string,
        name: string,
    }
}

export class HasCollectionResponse extends jspb.Message { 
    getHascollection(): boolean;
    setHascollection(value: boolean): HasCollectionResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasCollectionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasCollectionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasCollectionResponse): HasCollectionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasCollectionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasCollectionResponse;
    static deserializeBinaryFromReader(message: HasCollectionResponse, reader: jspb.BinaryReader): HasCollectionResponse;
}

export namespace HasCollectionResponse {
    export type AsObject = {
        hascollection: boolean,
        error?: string,
    }
}

export class ListCollectionsRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListCollectionsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCollectionsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListCollectionsRequest): ListCollectionsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCollectionsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCollectionsRequest;
    static deserializeBinaryFromReader(message: ListCollectionsRequest, reader: jspb.BinaryReader): ListCollectionsRequest;
}

export namespace ListCollectionsRequest {
    export type AsObject = {
        database: string,
    }
}

export class ListCollectionsResponse extends jspb.Message { 
    clearNamesList(): void;
    getNamesList(): Array<string>;
    setNamesList(value: Array<string>): ListCollectionsResponse;
    addNames(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListCollectionsResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCollectionsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListCollectionsResponse): ListCollectionsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCollectionsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCollectionsResponse;
    static deserializeBinaryFromReader(message: ListCollectionsResponse, reader: jspb.BinaryReader): ListCollectionsResponse;
}

export namespace ListCollectionsResponse {
    export type AsObject = {
        namesList: Array<string>,
        error?: string,
    }
}
