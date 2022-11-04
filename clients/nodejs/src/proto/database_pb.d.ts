// package: 
// file: database.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class CreateIndexRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): CreateIndexRequest;
    getIndexname(): string;
    setIndexname(value: string): CreateIndexRequest;
    getPagesize(): number;
    setPagesize(value: number): CreateIndexRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateIndexRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateIndexRequest): CreateIndexRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateIndexRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateIndexRequest;
    static deserializeBinaryFromReader(message: CreateIndexRequest, reader: jspb.BinaryReader): CreateIndexRequest;
}

export namespace CreateIndexRequest {
    export type AsObject = {
        database: string,
        indexname: string,
        pagesize: number,
    }
}

export class DeleteIndexRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteIndexRequest;
    getIndexname(): string;
    setIndexname(value: string): DeleteIndexRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteIndexRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteIndexRequest): DeleteIndexRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteIndexRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteIndexRequest;
    static deserializeBinaryFromReader(message: DeleteIndexRequest, reader: jspb.BinaryReader): DeleteIndexRequest;
}

export namespace DeleteIndexRequest {
    export type AsObject = {
        database: string,
        indexname: string,
    }
}

export class HasIndexRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasIndexRequest;
    getIndexname(): string;
    setIndexname(value: string): HasIndexRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasIndexRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasIndexRequest): HasIndexRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasIndexRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasIndexRequest;
    static deserializeBinaryFromReader(message: HasIndexRequest, reader: jspb.BinaryReader): HasIndexRequest;
}

export namespace HasIndexRequest {
    export type AsObject = {
        database: string,
        indexname: string,
    }
}

export class HasIndexResponse extends jspb.Message { 
    getHasindex(): boolean;
    setHasindex(value: boolean): HasIndexResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasIndexResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasIndexResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasIndexResponse): HasIndexResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasIndexResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasIndexResponse;
    static deserializeBinaryFromReader(message: HasIndexResponse, reader: jspb.BinaryReader): HasIndexResponse;
}

export namespace HasIndexResponse {
    export type AsObject = {
        hasindex: boolean,
        error?: string,
    }
}

export class ListIndexesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListIndexesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListIndexesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListIndexesRequest): ListIndexesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListIndexesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListIndexesRequest;
    static deserializeBinaryFromReader(message: ListIndexesRequest, reader: jspb.BinaryReader): ListIndexesRequest;
}

export namespace ListIndexesRequest {
    export type AsObject = {
        database: string,
    }
}

export class ListIndexesResponse extends jspb.Message { 
    clearIndexnamesList(): void;
    getIndexnamesList(): Array<string>;
    setIndexnamesList(value: Array<string>): ListIndexesResponse;
    addIndexnames(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListIndexesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListIndexesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListIndexesResponse): ListIndexesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListIndexesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListIndexesResponse;
    static deserializeBinaryFromReader(message: ListIndexesResponse, reader: jspb.BinaryReader): ListIndexesResponse;
}

export namespace ListIndexesResponse {
    export type AsObject = {
        indexnamesList: Array<string>,
        error?: string,
    }
}

export class CreateSetRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): CreateSetRequest;
    getSetname(): string;
    setSetname(value: string): CreateSetRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSetRequest): CreateSetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSetRequest;
    static deserializeBinaryFromReader(message: CreateSetRequest, reader: jspb.BinaryReader): CreateSetRequest;
}

export namespace CreateSetRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class DeleteSetRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteSetRequest;
    getSetname(): string;
    setSetname(value: string): DeleteSetRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteSetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteSetRequest): DeleteSetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteSetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteSetRequest;
    static deserializeBinaryFromReader(message: DeleteSetRequest, reader: jspb.BinaryReader): DeleteSetRequest;
}

export namespace DeleteSetRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class HasSetRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasSetRequest;
    getSetname(): string;
    setSetname(value: string): HasSetRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasSetRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasSetRequest): HasSetRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasSetRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasSetRequest;
    static deserializeBinaryFromReader(message: HasSetRequest, reader: jspb.BinaryReader): HasSetRequest;
}

export namespace HasSetRequest {
    export type AsObject = {
        database: string,
        setname: string,
    }
}

export class HasSetResponse extends jspb.Message { 
    getHasset(): boolean;
    setHasset(value: boolean): HasSetResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasSetResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasSetResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasSetResponse): HasSetResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasSetResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasSetResponse;
    static deserializeBinaryFromReader(message: HasSetResponse, reader: jspb.BinaryReader): HasSetResponse;
}

export namespace HasSetResponse {
    export type AsObject = {
        hasset: boolean,
        error?: string,
    }
}

export class ListSetsRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListSetsRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListSetsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListSetsRequest): ListSetsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListSetsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListSetsRequest;
    static deserializeBinaryFromReader(message: ListSetsRequest, reader: jspb.BinaryReader): ListSetsRequest;
}

export namespace ListSetsRequest {
    export type AsObject = {
        database: string,
    }
}

export class ListSetsResponse extends jspb.Message { 
    clearSetnamesList(): void;
    getSetnamesList(): Array<string>;
    setSetnamesList(value: Array<string>): ListSetsResponse;
    addSetnames(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListSetsResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListSetsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListSetsResponse): ListSetsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListSetsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListSetsResponse;
    static deserializeBinaryFromReader(message: ListSetsResponse, reader: jspb.BinaryReader): ListSetsResponse;
}

export namespace ListSetsResponse {
    export type AsObject = {
        setnamesList: Array<string>,
        error?: string,
    }
}

export class CreateTimeSeriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): CreateTimeSeriesRequest;
    getTimeseriesname(): string;
    setTimeseriesname(value: string): CreateTimeSeriesRequest;
    getPagesize(): number;
    setPagesize(value: number): CreateTimeSeriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateTimeSeriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateTimeSeriesRequest): CreateTimeSeriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateTimeSeriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateTimeSeriesRequest;
    static deserializeBinaryFromReader(message: CreateTimeSeriesRequest, reader: jspb.BinaryReader): CreateTimeSeriesRequest;
}

export namespace CreateTimeSeriesRequest {
    export type AsObject = {
        database: string,
        timeseriesname: string,
        pagesize: number,
    }
}

export class DeleteTimeSeriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteTimeSeriesRequest;
    getTimeseriesname(): string;
    setTimeseriesname(value: string): DeleteTimeSeriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteTimeSeriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteTimeSeriesRequest): DeleteTimeSeriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteTimeSeriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteTimeSeriesRequest;
    static deserializeBinaryFromReader(message: DeleteTimeSeriesRequest, reader: jspb.BinaryReader): DeleteTimeSeriesRequest;
}

export namespace DeleteTimeSeriesRequest {
    export type AsObject = {
        database: string,
        timeseriesname: string,
    }
}

export class HasTimeSeriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasTimeSeriesRequest;
    getTimeseriesname(): string;
    setTimeseriesname(value: string): HasTimeSeriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasTimeSeriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasTimeSeriesRequest): HasTimeSeriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasTimeSeriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasTimeSeriesRequest;
    static deserializeBinaryFromReader(message: HasTimeSeriesRequest, reader: jspb.BinaryReader): HasTimeSeriesRequest;
}

export namespace HasTimeSeriesRequest {
    export type AsObject = {
        database: string,
        timeseriesname: string,
    }
}

export class HasTimeSeriesResponse extends jspb.Message { 
    getHastimeseries(): boolean;
    setHastimeseries(value: boolean): HasTimeSeriesResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasTimeSeriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasTimeSeriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasTimeSeriesResponse): HasTimeSeriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasTimeSeriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasTimeSeriesResponse;
    static deserializeBinaryFromReader(message: HasTimeSeriesResponse, reader: jspb.BinaryReader): HasTimeSeriesResponse;
}

export namespace HasTimeSeriesResponse {
    export type AsObject = {
        hastimeseries: boolean,
        error?: string,
    }
}

export class ListTimeSeriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListTimeSeriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTimeSeriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListTimeSeriesRequest): ListTimeSeriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTimeSeriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTimeSeriesRequest;
    static deserializeBinaryFromReader(message: ListTimeSeriesRequest, reader: jspb.BinaryReader): ListTimeSeriesRequest;
}

export namespace ListTimeSeriesRequest {
    export type AsObject = {
        database: string,
    }
}

export class ListTimeSeriesResponse extends jspb.Message { 
    clearTimeseriesnamesList(): void;
    getTimeseriesnamesList(): Array<string>;
    setTimeseriesnamesList(value: Array<string>): ListTimeSeriesResponse;
    addTimeseriesnames(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListTimeSeriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTimeSeriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTimeSeriesResponse): ListTimeSeriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTimeSeriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTimeSeriesResponse;
    static deserializeBinaryFromReader(message: ListTimeSeriesResponse, reader: jspb.BinaryReader): ListTimeSeriesResponse;
}

export namespace ListTimeSeriesResponse {
    export type AsObject = {
        timeseriesnamesList: Array<string>,
        error?: string,
    }
}
