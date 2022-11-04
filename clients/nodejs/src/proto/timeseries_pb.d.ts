// package: timeseries
// file: timeseries.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as shared_pb from "./shared_pb";

export class HasSerieRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasSerieRequest;
    getSerie(): string;
    setSerie(value: string): HasSerieRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasSerieRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasSerieRequest): HasSerieRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasSerieRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasSerieRequest;
    static deserializeBinaryFromReader(message: HasSerieRequest, reader: jspb.BinaryReader): HasSerieRequest;
}

export namespace HasSerieRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class HasSerieResponse extends jspb.Message { 
    getHasserie(): boolean;
    setHasserie(value: boolean): HasSerieResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasSerieResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasSerieResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasSerieResponse): HasSerieResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasSerieResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasSerieResponse;
    static deserializeBinaryFromReader(message: HasSerieResponse, reader: jspb.BinaryReader): HasSerieResponse;
}

export namespace HasSerieResponse {
    export type AsObject = {
        hasserie: boolean,
        error?: string,
    }
}

export class DeleteSerieRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteSerieRequest;
    getSerie(): string;
    setSerie(value: string): DeleteSerieRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteSerieRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteSerieRequest): DeleteSerieRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteSerieRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteSerieRequest;
    static deserializeBinaryFromReader(message: DeleteSerieRequest, reader: jspb.BinaryReader): DeleteSerieRequest;
}

export namespace DeleteSerieRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class DeleteSerieResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): DeleteSerieResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteSerieResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteSerieResponse): DeleteSerieResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteSerieResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteSerieResponse;
    static deserializeBinaryFromReader(message: DeleteSerieResponse, reader: jspb.BinaryReader): DeleteSerieResponse;
}

export namespace DeleteSerieResponse {
    export type AsObject = {
        error?: string,
    }
}

export class ClearSerieRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ClearSerieRequest;
    getSerie(): string;
    setSerie(value: string): ClearSerieRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearSerieRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ClearSerieRequest): ClearSerieRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearSerieRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearSerieRequest;
    static deserializeBinaryFromReader(message: ClearSerieRequest, reader: jspb.BinaryReader): ClearSerieRequest;
}

export namespace ClearSerieRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class ClearSerieResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ClearSerieResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ClearSerieResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ClearSerieResponse): ClearSerieResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ClearSerieResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ClearSerieResponse;
    static deserializeBinaryFromReader(message: ClearSerieResponse, reader: jspb.BinaryReader): ClearSerieResponse;
}

export namespace ClearSerieResponse {
    export type AsObject = {
        error?: string,
    }
}

export class ListSeriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListSeriesRequest;
    getSerie(): string;
    setSerie(value: string): ListSeriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListSeriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListSeriesRequest): ListSeriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListSeriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListSeriesRequest;
    static deserializeBinaryFromReader(message: ListSeriesRequest, reader: jspb.BinaryReader): ListSeriesRequest;
}

export namespace ListSeriesRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class ListSeriesResponse extends jspb.Message { 
    clearSeriesList(): void;
    getSeriesList(): Array<string>;
    setSeriesList(value: Array<string>): ListSeriesResponse;
    addSeries(value: string, index?: number): string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListSeriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListSeriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListSeriesResponse): ListSeriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListSeriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListSeriesResponse;
    static deserializeBinaryFromReader(message: ListSeriesResponse, reader: jspb.BinaryReader): ListSeriesResponse;
}

export namespace ListSeriesResponse {
    export type AsObject = {
        seriesList: Array<string>,
        error?: string,
    }
}

export class ListEntriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): ListEntriesRequest;
    getSerie(): string;
    setSerie(value: string): ListEntriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListEntriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListEntriesRequest): ListEntriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListEntriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListEntriesRequest;
    static deserializeBinaryFromReader(message: ListEntriesRequest, reader: jspb.BinaryReader): ListEntriesRequest;
}

export namespace ListEntriesRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class ListEntriesResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): ListEntriesResponse;
    addTimestamps(value: number, index?: number): number;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): ListEntriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListEntriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListEntriesResponse): ListEntriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListEntriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListEntriesResponse;
    static deserializeBinaryFromReader(message: ListEntriesResponse, reader: jspb.BinaryReader): ListEntriesResponse;
}

export namespace ListEntriesResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        error?: string,
    }
}

export class GetEntriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetEntriesRequest;
    getSerie(): string;
    setSerie(value: string): GetEntriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesRequest): GetEntriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesRequest;
    static deserializeBinaryFromReader(message: GetEntriesRequest, reader: jspb.BinaryReader): GetEntriesRequest;
}

export namespace GetEntriesRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class GetEntriesResponse extends jspb.Message { 
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetEntriesResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetEntriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesResponse): GetEntriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesResponse;
    static deserializeBinaryFromReader(message: GetEntriesResponse, reader: jspb.BinaryReader): GetEntriesResponse;
}

export namespace GetEntriesResponse {
    export type AsObject = {
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}

export class HasEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): HasEntryRequest;
    getSerie(): string;
    setSerie(value: string): HasEntryRequest;
    getTimestamp(): number;
    setTimestamp(value: number): HasEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: HasEntryRequest): HasEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasEntryRequest;
    static deserializeBinaryFromReader(message: HasEntryRequest, reader: jspb.BinaryReader): HasEntryRequest;
}

export namespace HasEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class HasEntryResponse extends jspb.Message { 
    getHasentry(): boolean;
    setHasentry(value: boolean): HasEntryResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): HasEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HasEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: HasEntryResponse): HasEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HasEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HasEntryResponse;
    static deserializeBinaryFromReader(message: HasEntryResponse, reader: jspb.BinaryReader): HasEntryResponse;
}

export namespace HasEntryResponse {
    export type AsObject = {
        hasentry: boolean,
        error?: string,
    }
}

export class GetEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetEntryRequest;
    getSerie(): string;
    setSerie(value: string): GetEntryRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntryRequest): GetEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntryRequest;
    static deserializeBinaryFromReader(message: GetEntryRequest, reader: jspb.BinaryReader): GetEntryRequest;
}

export namespace GetEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetEntryResponse extends jspb.Message { 
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetEntryResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetEntryResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntryResponse): GetEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntryResponse;
    static deserializeBinaryFromReader(message: GetEntryResponse, reader: jspb.BinaryReader): GetEntryResponse;
}

export namespace GetEntryResponse {
    export type AsObject = {
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class PutEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): PutEntryRequest;
    getSerie(): string;
    setSerie(value: string): PutEntryRequest;
    getTimestamp(): number;
    setTimestamp(value: number): PutEntryRequest;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): PutEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PutEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PutEntryRequest): PutEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PutEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PutEntryRequest;
    static deserializeBinaryFromReader(message: PutEntryRequest, reader: jspb.BinaryReader): PutEntryRequest;
}

export namespace PutEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
        entry: Uint8Array | string,
    }
}

export class PutEntryResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): PutEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PutEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PutEntryResponse): PutEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PutEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PutEntryResponse;
    static deserializeBinaryFromReader(message: PutEntryResponse, reader: jspb.BinaryReader): PutEntryResponse;
}

export namespace PutEntryResponse {
    export type AsObject = {
        error?: string,
    }
}

export class DeleteEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): DeleteEntryRequest;
    getSerie(): string;
    setSerie(value: string): DeleteEntryRequest;
    getTimestamp(): number;
    setTimestamp(value: number): DeleteEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteEntryRequest): DeleteEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteEntryRequest;
    static deserializeBinaryFromReader(message: DeleteEntryRequest, reader: jspb.BinaryReader): DeleteEntryRequest;
}

export namespace DeleteEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class DeleteEntryResponse extends jspb.Message { 

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): DeleteEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteEntryResponse): DeleteEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteEntryResponse;
    static deserializeBinaryFromReader(message: DeleteEntryResponse, reader: jspb.BinaryReader): DeleteEntryResponse;
}

export namespace DeleteEntryResponse {
    export type AsObject = {
        error?: string,
    }
}

export class GetNearestEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetNearestEntryRequest;
    getSerie(): string;
    setSerie(value: string): GetNearestEntryRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetNearestEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNearestEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetNearestEntryRequest): GetNearestEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNearestEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNearestEntryRequest;
    static deserializeBinaryFromReader(message: GetNearestEntryRequest, reader: jspb.BinaryReader): GetNearestEntryRequest;
}

export namespace GetNearestEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetNearestEntryResponse extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): GetNearestEntryResponse;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetNearestEntryResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetNearestEntryResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetNearestEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNearestEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetNearestEntryResponse): GetNearestEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNearestEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNearestEntryResponse;
    static deserializeBinaryFromReader(message: GetNearestEntryResponse, reader: jspb.BinaryReader): GetNearestEntryResponse;
}

export namespace GetNearestEntryResponse {
    export type AsObject = {
        timestamp: number,
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetFirstEntryBeforeRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetFirstEntryBeforeRequest;
    getSerie(): string;
    setSerie(value: string): GetFirstEntryBeforeRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetFirstEntryBeforeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryBeforeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryBeforeRequest): GetFirstEntryBeforeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryBeforeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryBeforeRequest;
    static deserializeBinaryFromReader(message: GetFirstEntryBeforeRequest, reader: jspb.BinaryReader): GetFirstEntryBeforeRequest;
}

export namespace GetFirstEntryBeforeRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetFirstEntryBeforeResponse extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): GetFirstEntryBeforeResponse;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetFirstEntryBeforeResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetFirstEntryBeforeResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetFirstEntryBeforeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryBeforeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryBeforeResponse): GetFirstEntryBeforeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryBeforeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryBeforeResponse;
    static deserializeBinaryFromReader(message: GetFirstEntryBeforeResponse, reader: jspb.BinaryReader): GetFirstEntryBeforeResponse;
}

export namespace GetFirstEntryBeforeResponse {
    export type AsObject = {
        timestamp: number,
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetFirstEntryAfterRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetFirstEntryAfterRequest;
    getSerie(): string;
    setSerie(value: string): GetFirstEntryAfterRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetFirstEntryAfterRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryAfterRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryAfterRequest): GetFirstEntryAfterRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryAfterRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryAfterRequest;
    static deserializeBinaryFromReader(message: GetFirstEntryAfterRequest, reader: jspb.BinaryReader): GetFirstEntryAfterRequest;
}

export namespace GetFirstEntryAfterRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetFirstEntryAfterResponse extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): GetFirstEntryAfterResponse;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetFirstEntryAfterResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetFirstEntryAfterResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetFirstEntryAfterResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryAfterResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryAfterResponse): GetFirstEntryAfterResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryAfterResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryAfterResponse;
    static deserializeBinaryFromReader(message: GetFirstEntryAfterResponse, reader: jspb.BinaryReader): GetFirstEntryAfterResponse;
}

export namespace GetFirstEntryAfterResponse {
    export type AsObject = {
        timestamp: number,
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetFirstEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetFirstEntryRequest;
    getSerie(): string;
    setSerie(value: string): GetFirstEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryRequest): GetFirstEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryRequest;
    static deserializeBinaryFromReader(message: GetFirstEntryRequest, reader: jspb.BinaryReader): GetFirstEntryRequest;
}

export namespace GetFirstEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class GetFirstEntryResponse extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): GetFirstEntryResponse;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetFirstEntryResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetFirstEntryResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetFirstEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstEntryResponse): GetFirstEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstEntryResponse;
    static deserializeBinaryFromReader(message: GetFirstEntryResponse, reader: jspb.BinaryReader): GetFirstEntryResponse;
}

export namespace GetFirstEntryResponse {
    export type AsObject = {
        timestamp: number,
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetLastEntryRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetLastEntryRequest;
    getSerie(): string;
    setSerie(value: string): GetLastEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetLastEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetLastEntryRequest): GetLastEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetLastEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetLastEntryRequest;
    static deserializeBinaryFromReader(message: GetLastEntryRequest, reader: jspb.BinaryReader): GetLastEntryRequest;
}

export namespace GetLastEntryRequest {
    export type AsObject = {
        database: string,
        serie: string,
    }
}

export class GetLastEntryResponse extends jspb.Message { 
    getTimestamp(): number;
    setTimestamp(value: number): GetLastEntryResponse;
    getEntry(): Uint8Array | string;
    getEntry_asU8(): Uint8Array;
    getEntry_asB64(): string;
    setEntry(value: Uint8Array | string): GetLastEntryResponse;
    getNotfound(): boolean;
    setNotfound(value: boolean): GetLastEntryResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetLastEntryResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetLastEntryResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetLastEntryResponse): GetLastEntryResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetLastEntryResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetLastEntryResponse;
    static deserializeBinaryFromReader(message: GetLastEntryResponse, reader: jspb.BinaryReader): GetLastEntryResponse;
}

export namespace GetLastEntryResponse {
    export type AsObject = {
        timestamp: number,
        entry: Uint8Array | string,
        notfound: boolean,
        error?: string,
    }
}

export class GetEntriesBetweenRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetEntriesBetweenRequest;
    getSerie(): string;
    setSerie(value: string): GetEntriesBetweenRequest;
    getFrom(): number;
    setFrom(value: number): GetEntriesBetweenRequest;
    getTo(): number;
    setTo(value: number): GetEntriesBetweenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesBetweenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesBetweenRequest): GetEntriesBetweenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesBetweenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesBetweenRequest;
    static deserializeBinaryFromReader(message: GetEntriesBetweenRequest, reader: jspb.BinaryReader): GetEntriesBetweenRequest;
}

export namespace GetEntriesBetweenRequest {
    export type AsObject = {
        database: string,
        serie: string,
        from: number,
        to: number,
    }
}

export class GetEntriesBetweenResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): GetEntriesBetweenResponse;
    addTimestamps(value: number, index?: number): number;
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetEntriesBetweenResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetEntriesBetweenResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesBetweenResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesBetweenResponse): GetEntriesBetweenResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesBetweenResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesBetweenResponse;
    static deserializeBinaryFromReader(message: GetEntriesBetweenResponse, reader: jspb.BinaryReader): GetEntriesBetweenResponse;
}

export namespace GetEntriesBetweenResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}

export class GetFirstNEntriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetFirstNEntriesRequest;
    getSerie(): string;
    setSerie(value: string): GetFirstNEntriesRequest;
    getN(): number;
    setN(value: number): GetFirstNEntriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstNEntriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstNEntriesRequest): GetFirstNEntriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstNEntriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstNEntriesRequest;
    static deserializeBinaryFromReader(message: GetFirstNEntriesRequest, reader: jspb.BinaryReader): GetFirstNEntriesRequest;
}

export namespace GetFirstNEntriesRequest {
    export type AsObject = {
        database: string,
        serie: string,
        n: number,
    }
}

export class GetFirstNEntriesResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): GetFirstNEntriesResponse;
    addTimestamps(value: number, index?: number): number;
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetFirstNEntriesResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetFirstNEntriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetFirstNEntriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetFirstNEntriesResponse): GetFirstNEntriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetFirstNEntriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetFirstNEntriesResponse;
    static deserializeBinaryFromReader(message: GetFirstNEntriesResponse, reader: jspb.BinaryReader): GetFirstNEntriesResponse;
}

export namespace GetFirstNEntriesResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}

export class GetLastNEntriesRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetLastNEntriesRequest;
    getSerie(): string;
    setSerie(value: string): GetLastNEntriesRequest;
    getN(): number;
    setN(value: number): GetLastNEntriesRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetLastNEntriesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetLastNEntriesRequest): GetLastNEntriesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetLastNEntriesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetLastNEntriesRequest;
    static deserializeBinaryFromReader(message: GetLastNEntriesRequest, reader: jspb.BinaryReader): GetLastNEntriesRequest;
}

export namespace GetLastNEntriesRequest {
    export type AsObject = {
        database: string,
        serie: string,
        n: number,
    }
}

export class GetLastNEntriesResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): GetLastNEntriesResponse;
    addTimestamps(value: number, index?: number): number;
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetLastNEntriesResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetLastNEntriesResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetLastNEntriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetLastNEntriesResponse): GetLastNEntriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetLastNEntriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetLastNEntriesResponse;
    static deserializeBinaryFromReader(message: GetLastNEntriesResponse, reader: jspb.BinaryReader): GetLastNEntriesResponse;
}

export namespace GetLastNEntriesResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}

export class GetEntriesBeforeRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetEntriesBeforeRequest;
    getSerie(): string;
    setSerie(value: string): GetEntriesBeforeRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetEntriesBeforeRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesBeforeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesBeforeRequest): GetEntriesBeforeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesBeforeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesBeforeRequest;
    static deserializeBinaryFromReader(message: GetEntriesBeforeRequest, reader: jspb.BinaryReader): GetEntriesBeforeRequest;
}

export namespace GetEntriesBeforeRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetEntriesBeforeResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): GetEntriesBeforeResponse;
    addTimestamps(value: number, index?: number): number;
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetEntriesBeforeResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetEntriesBeforeResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesBeforeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesBeforeResponse): GetEntriesBeforeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesBeforeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesBeforeResponse;
    static deserializeBinaryFromReader(message: GetEntriesBeforeResponse, reader: jspb.BinaryReader): GetEntriesBeforeResponse;
}

export namespace GetEntriesBeforeResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}

export class GetEntriesAfterRequest extends jspb.Message { 
    getDatabase(): string;
    setDatabase(value: string): GetEntriesAfterRequest;
    getSerie(): string;
    setSerie(value: string): GetEntriesAfterRequest;
    getTimestamp(): number;
    setTimestamp(value: number): GetEntriesAfterRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesAfterRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesAfterRequest): GetEntriesAfterRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesAfterRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesAfterRequest;
    static deserializeBinaryFromReader(message: GetEntriesAfterRequest, reader: jspb.BinaryReader): GetEntriesAfterRequest;
}

export namespace GetEntriesAfterRequest {
    export type AsObject = {
        database: string,
        serie: string,
        timestamp: number,
    }
}

export class GetEntriesAfterResponse extends jspb.Message { 
    clearTimestampsList(): void;
    getTimestampsList(): Array<number>;
    setTimestampsList(value: Array<number>): GetEntriesAfterResponse;
    addTimestamps(value: number, index?: number): number;
    clearEntriesList(): void;
    getEntriesList(): Array<Uint8Array | string>;
    getEntriesList_asU8(): Array<Uint8Array>;
    getEntriesList_asB64(): Array<string>;
    setEntriesList(value: Array<Uint8Array | string>): GetEntriesAfterResponse;
    addEntries(value: Uint8Array | string, index?: number): Uint8Array | string;

    hasError(): boolean;
    clearError(): void;
    getError(): string | undefined;
    setError(value: string): GetEntriesAfterResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetEntriesAfterResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetEntriesAfterResponse): GetEntriesAfterResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetEntriesAfterResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetEntriesAfterResponse;
    static deserializeBinaryFromReader(message: GetEntriesAfterResponse, reader: jspb.BinaryReader): GetEntriesAfterResponse;
}

export namespace GetEntriesAfterResponse {
    export type AsObject = {
        timestampsList: Array<number>,
        entriesList: Array<Uint8Array | string>,
        error?: string,
    }
}
