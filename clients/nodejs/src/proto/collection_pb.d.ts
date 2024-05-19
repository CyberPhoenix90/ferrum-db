// package: 
// file: collection.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class ListMetaRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListMetaRequest;
    getCollection(): string;
    setCollection(value: string): ListMetaRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListMetaRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListMetaRequest): ListMetaRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListMetaRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListMetaRequest;
    static deserializeBinaryFromReader(message: ListMetaRequest, reader: jspb.BinaryReader): ListMetaRequest;
}

export namespace ListMetaRequest {
    export type AsObject = {
        database: string,
        collection: string,
    }
}

export class ListMetaResponse extends jspb.Message { 

    getMetaMap(): jspb.Map<string, string>;
    clearMetaMap(): void;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListMetaResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListMetaResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListMetaResponse): ListMetaResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListMetaResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListMetaResponse;
    static deserializeBinaryFromReader(message: ListMetaResponse, reader: jspb.BinaryReader): ListMetaResponse;
}

export namespace ListMetaResponse {
    export type AsObject = {

        metaMap: Array<[string, string]>,
        error?: string,
    }
}

export class DeleteMetaRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteMetaRequest;
    getCollection(): string;
    setCollection(value: string): DeleteMetaRequest;
    getKey(): string;
    setKey(value: string): DeleteMetaRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteMetaRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteMetaRequest): DeleteMetaRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteMetaRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteMetaRequest;
    static deserializeBinaryFromReader(message: DeleteMetaRequest, reader: jspb.BinaryReader): DeleteMetaRequest;
}

export namespace DeleteMetaRequest {
    export type AsObject = {
        database: string,
        collection: string,
        key: string,
    }
}

export class DeleteMetaResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): DeleteMetaResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteMetaResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteMetaResponse): DeleteMetaResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteMetaResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteMetaResponse;
    static deserializeBinaryFromReader(message: DeleteMetaResponse, reader: jspb.BinaryReader): DeleteMetaResponse;
}

export namespace DeleteMetaResponse {
    export type AsObject = {
        error?: string,
    }
}

export class HasMetaRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasMetaRequest;
    getCollection(): string;
    setCollection(value: string): HasMetaRequest;
    getKey(): string;
    setKey(value: string): HasMetaRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasMetaRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasMetaRequest): HasMetaRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasMetaRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasMetaRequest;
    static deserializeBinaryFromReader(message: HasMetaRequest, reader: jspb.BinaryReader): HasMetaRequest;
}

export namespace HasMetaRequest {
    export type AsObject = {
        database: string,
        collection: string,
        key: string,
    }
}

export class HasMetaResponse extends jspb.Message { 

    hasHasmeta(): boolean;
    clearHasmeta(): void;
    getHasmeta(): boolean | undefined;
    setHasmeta(value: boolean): HasMetaResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasMetaResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasMetaResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasMetaResponse): HasMetaResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasMetaResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasMetaResponse;
    static deserializeBinaryFromReader(message: HasMetaResponse, reader: jspb.BinaryReader): HasMetaResponse;
}

export namespace HasMetaResponse {
    export type AsObject = {
        hasmeta?: boolean,
        error?: string,
    }
}

export class GetMetaRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetMetaRequest;
    getCollection(): string;
    setCollection(value: string): GetMetaRequest;
    getKey(): string;
    setKey(value: string): GetMetaRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetMetaRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetMetaRequest): GetMetaRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetMetaRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetMetaRequest;
    static deserializeBinaryFromReader(message: GetMetaRequest, reader: jspb.BinaryReader): GetMetaRequest;
}

export namespace GetMetaRequest {
    export type AsObject = {
        database: string,
        collection: string,
        key: string,
    }
}

export class GetMetaResponse extends jspb.Message { 
    getValue(): string;
    setValue(value: string): GetMetaResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetMetaResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetMetaResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetMetaResponse): GetMetaResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetMetaResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetMetaResponse;
    static deserializeBinaryFromReader(message: GetMetaResponse, reader: jspb.BinaryReader): GetMetaResponse;
}

export namespace GetMetaResponse {
    export type AsObject = {
        value: string,
        error?: string,
    }
}

export class SetMetaRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): SetMetaRequest;
    getCollection(): string;
    setCollection(value: string): SetMetaRequest;
    getKey(): string;
    setKey(value: string): SetMetaRequest;
    getValue(): string;
    setValue(value: string): SetMetaRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetMetaRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SetMetaRequest): SetMetaRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetMetaRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetMetaRequest;
    static deserializeBinaryFromReader(message: SetMetaRequest, reader: jspb.BinaryReader): SetMetaRequest;
}

export namespace SetMetaRequest {
    export type AsObject = {
        database: string,
        collection: string,
        key: string,
        value: string,
    }
}

export class SetMetaResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): SetMetaResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SetMetaResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SetMetaResponse): SetMetaResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SetMetaResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SetMetaResponse;
    static deserializeBinaryFromReader(message: SetMetaResponse, reader: jspb.BinaryReader): SetMetaResponse;
}

export namespace SetMetaResponse {
    export type AsObject = {
        error?: string,
    }
}

export class HasRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasRequest;
    getName(): string;
    setName(value: string): HasRequest;
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
        name: string,
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

export class GetRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetRequest;
    getName(): string;
    setName(value: string): GetRequest;
    getKey(): string;
    setKey(value: string): GetRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetRequest): GetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRequest;
    static deserializeBinaryFromReader(message: GetRequest, reader: jspb.BinaryReader): GetRequest;
}

export namespace GetRequest {
    export type AsObject = {
        database: string,
        name: string,
        key: string,
    }
}

export class GetResponse extends jspb.Message { 
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): GetResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetResponse): GetResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetResponse;
    static deserializeBinaryFromReader(message: GetResponse, reader: jspb.BinaryReader): GetResponse;
}

export namespace GetResponse {
    export type AsObject = {
        value: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetChunkRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetChunkRequest;
    getName(): string;
    setName(value: string): GetChunkRequest;
    getKey(): string;
    setKey(value: string): GetChunkRequest;
    getOffset(): number;
    setOffset(value: number): GetChunkRequest;
    getChunksize(): number;
    setChunksize(value: number): GetChunkRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetChunkRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetChunkRequest): GetChunkRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetChunkRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetChunkRequest;
    static deserializeBinaryFromReader(message: GetChunkRequest, reader: jspb.BinaryReader): GetChunkRequest;
}

export namespace GetChunkRequest {
    export type AsObject = {
        database: string,
        name: string,
        key: string,
        offset: number,
        chunksize: number,
    }
}

export class GetChunkResponse extends jspb.Message { 
    getChunk(): Uint8Array | string;
    getChunk_asU8(): Uint8Array;
    getChunk_asB64(): string;
    setChunk(value: Uint8Array | string): GetChunkResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetChunkResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetChunkResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetChunkResponse): GetChunkResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetChunkResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetChunkResponse;
    static deserializeBinaryFromReader(message: GetChunkResponse, reader: jspb.BinaryReader): GetChunkResponse;
}

export namespace GetChunkResponse {
    export type AsObject = {
        chunk: Uint8Array | string,
        error?: string,
    }
}

export class GetUntilRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetUntilRequest;
    getName(): string;
    setName(value: string): GetUntilRequest;
    getKey(): string;
    setKey(value: string): GetUntilRequest;
    getOffset(): number;
    setOffset(value: number): GetUntilRequest;
    getTerminator(): number;
    setTerminator(value: number): GetUntilRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetUntilRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetUntilRequest): GetUntilRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetUntilRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetUntilRequest;
    static deserializeBinaryFromReader(message: GetUntilRequest, reader: jspb.BinaryReader): GetUntilRequest;
}

export namespace GetUntilRequest {
    export type AsObject = {
        database: string,
        name: string,
        key: string,
        offset: number,
        terminator: number,
    }
}

export class GetUntilResponse extends jspb.Message { 
    getChunk(): Uint8Array | string;
    getChunk_asU8(): Uint8Array;
    getChunk_asB64(): string;
    setChunk(value: Uint8Array | string): GetUntilResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetUntilResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetUntilResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetUntilResponse): GetUntilResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetUntilResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetUntilResponse;
    static deserializeBinaryFromReader(message: GetUntilResponse, reader: jspb.BinaryReader): GetUntilResponse;
}

export namespace GetUntilResponse {
    export type AsObject = {
        chunk: Uint8Array | string,
        error?: string,
    }
}

export class PutRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): PutRequest;
    getName(): string;
    setName(value: string): PutRequest;
    getKey(): string;
    setKey(value: string): PutRequest;
    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): PutRequest;

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
        name: string,
        key: string,
        value: Uint8Array | string,
    }
}

export class DeleteRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteRequest;
    getName(): string;
    setName(value: string): DeleteRequest;
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
        name: string,
        key: string,
    }
}

export class ClearRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ClearRequest;
    getName(): string;
    setName(value: string): ClearRequest;

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
        name: string,
    }
}

export class SizeRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): SizeRequest;
    getName(): string;
    setName(value: string): SizeRequest;

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
        name: string,
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

export class GetRecordSizeRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetRecordSizeRequest;
    getName(): string;
    setName(value: string): GetRecordSizeRequest;
    getKey(): string;
    setKey(value: string): GetRecordSizeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRecordSizeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetRecordSizeRequest): GetRecordSizeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRecordSizeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRecordSizeRequest;
    static deserializeBinaryFromReader(message: GetRecordSizeRequest, reader: jspb.BinaryReader): GetRecordSizeRequest;
}

export namespace GetRecordSizeRequest {
    export type AsObject = {
        database: string,
        name: string,
        key: string,
    }
}

export class GetRecordSizeResponse extends jspb.Message { 
    getSize(): number;
    setSize(value: number): GetRecordSizeResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetRecordSizeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRecordSizeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetRecordSizeResponse): GetRecordSizeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRecordSizeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRecordSizeResponse;
    static deserializeBinaryFromReader(message: GetRecordSizeResponse, reader: jspb.BinaryReader): GetRecordSizeResponse;
}

export namespace GetRecordSizeResponse {
    export type AsObject = {
        size: number,
        error?: string,
    }
}

export class ListKeysRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListKeysRequest;
    getName(): string;
    setName(value: string): ListKeysRequest;

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
        name: string,
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

export class GetRecordCountRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetRecordCountRequest;
    getName(): string;
    setName(value: string): GetRecordCountRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRecordCountRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetRecordCountRequest): GetRecordCountRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRecordCountRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRecordCountRequest;
    static deserializeBinaryFromReader(message: GetRecordCountRequest, reader: jspb.BinaryReader): GetRecordCountRequest;
}

export namespace GetRecordCountRequest {
    export type AsObject = {
        database: string,
        name: string,
    }
}

export class GetRecordCountResponse extends jspb.Message { 
    getCount(): number;
    setCount(value: number): GetRecordCountResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetRecordCountResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetRecordCountResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetRecordCountResponse): GetRecordCountResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetRecordCountResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetRecordCountResponse;
    static deserializeBinaryFromReader(message: GetRecordCountResponse, reader: jspb.BinaryReader): GetRecordCountResponse;
}

export namespace GetRecordCountResponse {
    export type AsObject = {
        count: number,
        error?: string,
    }
}

export enum CollectionKeyType {
    STRINGCOLLECTION = 0,
    NUMBERCOLLECTION = 1,
}

export enum CompressionAlgorithm {
    NONE = 0,
    LZ4 = 1,
    ZSTD = 2,
}

export enum ValueEncodingType {
    BINARY = 0,
    STRING = 1,
    INTEGER = 2,
    FLOAT = 3,
    BOOLEAN = 4,
    JSON = 5,
    VOID = 6,
}
