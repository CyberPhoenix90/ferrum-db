// package: 
// file: database_server.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class CreateDatabaseRequest extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): CreateDatabaseRequest;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): CreateDatabaseRequest;
    getName(): string;
    setName(value: string): CreateDatabaseRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateDatabaseRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateDatabaseRequest): CreateDatabaseRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateDatabaseRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateDatabaseRequest;
    static deserializeBinaryFromReader(message: CreateDatabaseRequest, reader: jspb.BinaryReader): CreateDatabaseRequest;
}

export namespace CreateDatabaseRequest {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        name: string,
    }
}

export class HasDatabaseRequest extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): HasDatabaseRequest;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasDatabaseRequest;
    getName(): string;
    setName(value: string): HasDatabaseRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasDatabaseRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasDatabaseRequest): HasDatabaseRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasDatabaseRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasDatabaseRequest;
    static deserializeBinaryFromReader(message: HasDatabaseRequest, reader: jspb.BinaryReader): HasDatabaseRequest;
}

export namespace HasDatabaseRequest {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        name: string,
    }
}

export class HasDatabaseResponse extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): HasDatabaseResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasDatabaseResponse;
    getHasdatabase(): boolean;
    setHasdatabase(value: boolean): HasDatabaseResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasDatabaseResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasDatabaseResponse): HasDatabaseResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasDatabaseResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasDatabaseResponse;
    static deserializeBinaryFromReader(message: HasDatabaseResponse, reader: jspb.BinaryReader): HasDatabaseResponse;
}

export namespace HasDatabaseResponse {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        hasdatabase: boolean,
    }
}

export class DropDatabaseRequest extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): DropDatabaseRequest;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): DropDatabaseRequest;
    getName(): string;
    setName(value: string): DropDatabaseRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DropDatabaseRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DropDatabaseRequest): DropDatabaseRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DropDatabaseRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DropDatabaseRequest;
    static deserializeBinaryFromReader(message: DropDatabaseRequest, reader: jspb.BinaryReader): DropDatabaseRequest;
}

export namespace DropDatabaseRequest {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        name: string,
    }
}

export class ClearDatabaseRequest extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): ClearDatabaseRequest;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ClearDatabaseRequest;
    getName(): string;
    setName(value: string): ClearDatabaseRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearDatabaseRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ClearDatabaseRequest): ClearDatabaseRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearDatabaseRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearDatabaseRequest;
    static deserializeBinaryFromReader(message: ClearDatabaseRequest, reader: jspb.BinaryReader): ClearDatabaseRequest;
}

export namespace ClearDatabaseRequest {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        name: string,
    }
}

export class ListDatabasesResponse extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): ListDatabasesResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListDatabasesResponse;
    clearDatabasesList(): void;
    getDatabasesList(): Array<string>;
    setDatabasesList(value: Array<string>): ListDatabasesResponse;
    addDatabases(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListDatabasesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListDatabasesResponse): ListDatabasesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListDatabasesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListDatabasesResponse;
    static deserializeBinaryFromReader(message: ListDatabasesResponse, reader: jspb.BinaryReader): ListDatabasesResponse;
}

export namespace ListDatabasesResponse {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        databasesList: Array<string>,
    }
}

export class GrpcAPIVersionResponse extends jspb.Message { 
    getCode(): shared_pb.SuccessResponseCode;
    setCode(value: shared_pb.SuccessResponseCode): GrpcAPIVersionResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GrpcAPIVersionResponse;
    getVersion(): string;
    setVersion(value: string): GrpcAPIVersionResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GrpcAPIVersionResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GrpcAPIVersionResponse): GrpcAPIVersionResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GrpcAPIVersionResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GrpcAPIVersionResponse;
    static deserializeBinaryFromReader(message: GrpcAPIVersionResponse, reader: jspb.BinaryReader): GrpcAPIVersionResponse;
}

export namespace GrpcAPIVersionResponse {
    export type AsObject = {
        code: shared_pb.SuccessResponseCode,
        error?: string,
        version: string,
    }
}
