// package: set
// file: set.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class HasRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasRequest;
    getSetname(): string;
    setSetname(value: string): HasRequest;
    getKey(): string;
    setKey(value: string): HasRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasRequest): HasRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasRequest;
    static deserializeBinaryFromReader(message: HasRequest, reader: jspb.BinaryReader): HasRequest;
}

export namespace HasRequest {
    export type AsObject = {
        database: string,
        setname: string,
        key: string,
    }
}

export class HasResponse extends jspb.Message { 
    getHas(): boolean;
    setHas(value: boolean): HasResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasResponse): HasResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasResponse;
    static deserializeBinaryFromReader(message: HasResponse, reader: jspb.BinaryReader): HasResponse;
}

export namespace HasResponse {
    export type AsObject = {
        has: boolean,
        error?: string,
    }
}

export class PutRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): PutRequest;
    getSetname(): string;
    setSetname(value: string): PutRequest;
    getKey(): string;
    setKey(value: string): PutRequest;
    getValue(): string;
    setValue(value: string): PutRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PutRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PutRequest): PutRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PutRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PutRequest;
    static deserializeBinaryFromReader(message: PutRequest, reader: jspb.BinaryReader): PutRequest;
}

export namespace PutRequest {
    export type AsObject = {
        database: string,
        setname: string,
        key: string,
        value: string,
    }
}

export class DeleteRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteRequest;
    getSetname(): string;
    setSetname(value: string): DeleteRequest;
    getKey(): string;
    setKey(value: string): DeleteRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteRequest): DeleteRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteRequest;
    static deserializeBinaryFromReader(message: DeleteRequest, reader: jspb.BinaryReader): DeleteRequest;
}

export namespace DeleteRequest {
    export type AsObject = {
        database: string,
        setname: string,
        key: string,
    }
}

export class ClearRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ClearRequest;
    getSetname(): string;
    setSetname(value: string): ClearRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ClearRequest): ClearRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearRequest;
    static deserializeBinaryFromReader(message: ClearRequest, reader: jspb.BinaryReader): ClearRequest;
}

export namespace ClearRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class SizeRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): SizeRequest;
    getSetname(): string;
    setSetname(value: string): SizeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SizeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SizeRequest): SizeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SizeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SizeRequest;
    static deserializeBinaryFromReader(message: SizeRequest, reader: jspb.BinaryReader): SizeRequest;
}

export namespace SizeRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class SizeResponse extends jspb.Message { 
    getSize(): number;
    setSize(value: number): SizeResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): SizeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SizeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SizeResponse): SizeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SizeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SizeResponse;
    static deserializeBinaryFromReader(message: SizeResponse, reader: jspb.BinaryReader): SizeResponse;
}

export namespace SizeResponse {
    export type AsObject = {
        size: number,
        error?: string,
    }
}

export class ListKeysRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListKeysRequest;
    getSetname(): string;
    setSetname(value: string): ListKeysRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListKeysRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListKeysRequest): ListKeysRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListKeysRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListKeysRequest;
    static deserializeBinaryFromReader(message: ListKeysRequest, reader: jspb.BinaryReader): ListKeysRequest;
}

export namespace ListKeysRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class ListKeysResponse extends jspb.Message { 
    clearKeysList(): void;
    getKeysList(): Array<string>;
    setKeysList(value: Array<string>): ListKeysResponse;
    addKeys(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListKeysResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListKeysResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListKeysResponse): ListKeysResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListKeysResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListKeysResponse;
    static deserializeBinaryFromReader(message: ListKeysResponse, reader: jspb.BinaryReader): ListKeysResponse;
}

export namespace ListKeysResponse {
    export type AsObject = {
        keysList: Array<string>,
        error?: string,
    }
}
