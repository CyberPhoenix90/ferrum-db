// package: 
// file: shared.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class EmptyRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EmptyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EmptyRequest;
    static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
    export type AsObject = {
    }
}

export class SuccessResponse extends jspb.Message { 
    getCode(): SuccessResponseCode;
    setCode(value: SuccessResponseCode): SuccessResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): SuccessResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuccessResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SuccessResponse): SuccessResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SuccessResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuccessResponse;
    static deserializeBinaryFromReader(message: SuccessResponse, reader: jspb.BinaryReader): SuccessResponse;
}

export namespace SuccessResponse {
    export type AsObject = {
        code: SuccessResponseCode,
        error?: string,
    }
}

export enum SuccessResponseCode {
    OK = 0,
    NO_ACTION_TAKEN = 1,
    NOT_FOUND = 2,
    ALREADY_EXISTS = 3,
    SERVER_ERROR = 4,
    REQUEST_ERROR = 5,
}
