// package: timeseries
// file: timeseries.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as timeseries_pb from "./timeseries_pb";
import * as shared_pb from "./shared_pb";

interface ITimeSeriesService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    hasSerie: ITimeSeriesService_IHasSerie;
    deleteSerie: ITimeSeriesService_IDeleteSerie;
    clearSerie: ITimeSeriesService_IClearSerie;
    listSeries: ITimeSeriesService_IListSeries;
    listEntries: ITimeSeriesService_IListEntries;
    getEntries: ITimeSeriesService_IGetEntries;
    hasEntry: ITimeSeriesService_IHasEntry;
    getEntry: ITimeSeriesService_IGetEntry;
    putEntry: ITimeSeriesService_IPutEntry;
    deleteEntry: ITimeSeriesService_IDeleteEntry;
    getNearestEntry: ITimeSeriesService_IGetNearestEntry;
    getFirstEntryBefore: ITimeSeriesService_IGetFirstEntryBefore;
    getFirstEntryAfter: ITimeSeriesService_IGetFirstEntryAfter;
    getFirstEntry: ITimeSeriesService_IGetFirstEntry;
    getLastEntry: ITimeSeriesService_IGetLastEntry;
    getEntriesBetween: ITimeSeriesService_IGetEntriesBetween;
    getFirstNEntries: ITimeSeriesService_IGetFirstNEntries;
    getLastNEntries: ITimeSeriesService_IGetLastNEntries;
    getEntriesBefore: ITimeSeriesService_IGetEntriesBefore;
    getEntriesAfter: ITimeSeriesService_IGetEntriesAfter;
}

interface ITimeSeriesService_IHasSerie extends grpc.MethodDefinition<timeseries_pb.HasSerieRequest, timeseries_pb.HasSerieResponse> {
    path: "/timeseries.TimeSeries/HasSerie";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.HasSerieRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.HasSerieRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.HasSerieResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.HasSerieResponse>;
}
interface ITimeSeriesService_IDeleteSerie extends grpc.MethodDefinition<timeseries_pb.DeleteSerieRequest, timeseries_pb.DeleteSerieResponse> {
    path: "/timeseries.TimeSeries/DeleteSerie";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.DeleteSerieRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.DeleteSerieRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.DeleteSerieResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.DeleteSerieResponse>;
}
interface ITimeSeriesService_IClearSerie extends grpc.MethodDefinition<timeseries_pb.ClearSerieRequest, timeseries_pb.ClearSerieResponse> {
    path: "/timeseries.TimeSeries/ClearSerie";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.ClearSerieRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.ClearSerieRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.ClearSerieResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.ClearSerieResponse>;
}
interface ITimeSeriesService_IListSeries extends grpc.MethodDefinition<timeseries_pb.ListSeriesRequest, timeseries_pb.ListSeriesResponse> {
    path: "/timeseries.TimeSeries/ListSeries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.ListSeriesRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.ListSeriesRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.ListSeriesResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.ListSeriesResponse>;
}
interface ITimeSeriesService_IListEntries extends grpc.MethodDefinition<timeseries_pb.ListEntriesRequest, timeseries_pb.ListEntriesResponse> {
    path: "/timeseries.TimeSeries/ListEntries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.ListEntriesRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.ListEntriesRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.ListEntriesResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.ListEntriesResponse>;
}
interface ITimeSeriesService_IGetEntries extends grpc.MethodDefinition<timeseries_pb.GetEntriesRequest, timeseries_pb.GetEntriesResponse> {
    path: "/timeseries.TimeSeries/GetEntries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetEntriesRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetEntriesRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetEntriesResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetEntriesResponse>;
}
interface ITimeSeriesService_IHasEntry extends grpc.MethodDefinition<timeseries_pb.HasEntryRequest, timeseries_pb.HasEntryResponse> {
    path: "/timeseries.TimeSeries/HasEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.HasEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.HasEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.HasEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.HasEntryResponse>;
}
interface ITimeSeriesService_IGetEntry extends grpc.MethodDefinition<timeseries_pb.GetEntryRequest, timeseries_pb.GetEntryResponse> {
    path: "/timeseries.TimeSeries/GetEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetEntryResponse>;
}
interface ITimeSeriesService_IPutEntry extends grpc.MethodDefinition<timeseries_pb.PutEntryRequest, timeseries_pb.PutEntryResponse> {
    path: "/timeseries.TimeSeries/PutEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.PutEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.PutEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.PutEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.PutEntryResponse>;
}
interface ITimeSeriesService_IDeleteEntry extends grpc.MethodDefinition<timeseries_pb.DeleteEntryRequest, timeseries_pb.DeleteEntryResponse> {
    path: "/timeseries.TimeSeries/DeleteEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.DeleteEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.DeleteEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.DeleteEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.DeleteEntryResponse>;
}
interface ITimeSeriesService_IGetNearestEntry extends grpc.MethodDefinition<timeseries_pb.GetNearestEntryRequest, timeseries_pb.GetNearestEntryResponse> {
    path: "/timeseries.TimeSeries/GetNearestEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetNearestEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetNearestEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetNearestEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetNearestEntryResponse>;
}
interface ITimeSeriesService_IGetFirstEntryBefore extends grpc.MethodDefinition<timeseries_pb.GetFirstEntryBeforeRequest, timeseries_pb.GetFirstEntryBeforeResponse> {
    path: "/timeseries.TimeSeries/GetFirstEntryBefore";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetFirstEntryBeforeRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryBeforeRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetFirstEntryBeforeResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryBeforeResponse>;
}
interface ITimeSeriesService_IGetFirstEntryAfter extends grpc.MethodDefinition<timeseries_pb.GetFirstEntryAfterRequest, timeseries_pb.GetFirstEntryAfterResponse> {
    path: "/timeseries.TimeSeries/GetFirstEntryAfter";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetFirstEntryAfterRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryAfterRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetFirstEntryAfterResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryAfterResponse>;
}
interface ITimeSeriesService_IGetFirstEntry extends grpc.MethodDefinition<timeseries_pb.GetFirstEntryRequest, timeseries_pb.GetFirstEntryResponse> {
    path: "/timeseries.TimeSeries/GetFirstEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetFirstEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetFirstEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetFirstEntryResponse>;
}
interface ITimeSeriesService_IGetLastEntry extends grpc.MethodDefinition<timeseries_pb.GetLastEntryRequest, timeseries_pb.GetLastEntryResponse> {
    path: "/timeseries.TimeSeries/GetLastEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetLastEntryRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetLastEntryRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetLastEntryResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetLastEntryResponse>;
}
interface ITimeSeriesService_IGetEntriesBetween extends grpc.MethodDefinition<timeseries_pb.GetEntriesBetweenRequest, timeseries_pb.GetEntriesBetweenResponse> {
    path: "/timeseries.TimeSeries/GetEntriesBetween";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetEntriesBetweenRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetEntriesBetweenRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetEntriesBetweenResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetEntriesBetweenResponse>;
}
interface ITimeSeriesService_IGetFirstNEntries extends grpc.MethodDefinition<timeseries_pb.GetFirstNEntriesRequest, timeseries_pb.GetFirstNEntriesResponse> {
    path: "/timeseries.TimeSeries/GetFirstNEntries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetFirstNEntriesRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetFirstNEntriesRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetFirstNEntriesResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetFirstNEntriesResponse>;
}
interface ITimeSeriesService_IGetLastNEntries extends grpc.MethodDefinition<timeseries_pb.GetLastNEntriesRequest, timeseries_pb.GetLastNEntriesResponse> {
    path: "/timeseries.TimeSeries/GetLastNEntries";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetLastNEntriesRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetLastNEntriesRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetLastNEntriesResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetLastNEntriesResponse>;
}
interface ITimeSeriesService_IGetEntriesBefore extends grpc.MethodDefinition<timeseries_pb.GetEntriesBeforeRequest, timeseries_pb.GetEntriesBeforeResponse> {
    path: "/timeseries.TimeSeries/GetEntriesBefore";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetEntriesBeforeRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetEntriesBeforeRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetEntriesBeforeResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetEntriesBeforeResponse>;
}
interface ITimeSeriesService_IGetEntriesAfter extends grpc.MethodDefinition<timeseries_pb.GetEntriesAfterRequest, timeseries_pb.GetEntriesAfterResponse> {
    path: "/timeseries.TimeSeries/GetEntriesAfter";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<timeseries_pb.GetEntriesAfterRequest>;
    requestDeserialize: grpc.deserialize<timeseries_pb.GetEntriesAfterRequest>;
    responseSerialize: grpc.serialize<timeseries_pb.GetEntriesAfterResponse>;
    responseDeserialize: grpc.deserialize<timeseries_pb.GetEntriesAfterResponse>;
}

export const TimeSeriesService: ITimeSeriesService;

export interface ITimeSeriesServer extends grpc.UntypedServiceImplementation {
    hasSerie: grpc.handleUnaryCall<timeseries_pb.HasSerieRequest, timeseries_pb.HasSerieResponse>;
    deleteSerie: grpc.handleUnaryCall<timeseries_pb.DeleteSerieRequest, timeseries_pb.DeleteSerieResponse>;
    clearSerie: grpc.handleUnaryCall<timeseries_pb.ClearSerieRequest, timeseries_pb.ClearSerieResponse>;
    listSeries: grpc.handleUnaryCall<timeseries_pb.ListSeriesRequest, timeseries_pb.ListSeriesResponse>;
    listEntries: grpc.handleUnaryCall<timeseries_pb.ListEntriesRequest, timeseries_pb.ListEntriesResponse>;
    getEntries: grpc.handleUnaryCall<timeseries_pb.GetEntriesRequest, timeseries_pb.GetEntriesResponse>;
    hasEntry: grpc.handleUnaryCall<timeseries_pb.HasEntryRequest, timeseries_pb.HasEntryResponse>;
    getEntry: grpc.handleUnaryCall<timeseries_pb.GetEntryRequest, timeseries_pb.GetEntryResponse>;
    putEntry: grpc.handleUnaryCall<timeseries_pb.PutEntryRequest, timeseries_pb.PutEntryResponse>;
    deleteEntry: grpc.handleUnaryCall<timeseries_pb.DeleteEntryRequest, timeseries_pb.DeleteEntryResponse>;
    getNearestEntry: grpc.handleUnaryCall<timeseries_pb.GetNearestEntryRequest, timeseries_pb.GetNearestEntryResponse>;
    getFirstEntryBefore: grpc.handleUnaryCall<timeseries_pb.GetFirstEntryBeforeRequest, timeseries_pb.GetFirstEntryBeforeResponse>;
    getFirstEntryAfter: grpc.handleUnaryCall<timeseries_pb.GetFirstEntryAfterRequest, timeseries_pb.GetFirstEntryAfterResponse>;
    getFirstEntry: grpc.handleUnaryCall<timeseries_pb.GetFirstEntryRequest, timeseries_pb.GetFirstEntryResponse>;
    getLastEntry: grpc.handleUnaryCall<timeseries_pb.GetLastEntryRequest, timeseries_pb.GetLastEntryResponse>;
    getEntriesBetween: grpc.handleUnaryCall<timeseries_pb.GetEntriesBetweenRequest, timeseries_pb.GetEntriesBetweenResponse>;
    getFirstNEntries: grpc.handleUnaryCall<timeseries_pb.GetFirstNEntriesRequest, timeseries_pb.GetFirstNEntriesResponse>;
    getLastNEntries: grpc.handleUnaryCall<timeseries_pb.GetLastNEntriesRequest, timeseries_pb.GetLastNEntriesResponse>;
    getEntriesBefore: grpc.handleUnaryCall<timeseries_pb.GetEntriesBeforeRequest, timeseries_pb.GetEntriesBeforeResponse>;
    getEntriesAfter: grpc.handleUnaryCall<timeseries_pb.GetEntriesAfterRequest, timeseries_pb.GetEntriesAfterResponse>;
}

export interface ITimeSeriesClient {
    hasSerie(request: timeseries_pb.HasSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    hasSerie(request: timeseries_pb.HasSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    hasSerie(request: timeseries_pb.HasSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    deleteSerie(request: timeseries_pb.DeleteSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    deleteSerie(request: timeseries_pb.DeleteSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    deleteSerie(request: timeseries_pb.DeleteSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    clearSerie(request: timeseries_pb.ClearSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    clearSerie(request: timeseries_pb.ClearSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    clearSerie(request: timeseries_pb.ClearSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    listSeries(request: timeseries_pb.ListSeriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    listSeries(request: timeseries_pb.ListSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    listSeries(request: timeseries_pb.ListSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    listEntries(request: timeseries_pb.ListEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    listEntries(request: timeseries_pb.ListEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    listEntries(request: timeseries_pb.ListEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    getEntries(request: timeseries_pb.GetEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    getEntries(request: timeseries_pb.GetEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    getEntries(request: timeseries_pb.GetEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    hasEntry(request: timeseries_pb.HasEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    hasEntry(request: timeseries_pb.HasEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    hasEntry(request: timeseries_pb.HasEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    getEntry(request: timeseries_pb.GetEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    getEntry(request: timeseries_pb.GetEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    getEntry(request: timeseries_pb.GetEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    putEntry(request: timeseries_pb.PutEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    putEntry(request: timeseries_pb.PutEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    putEntry(request: timeseries_pb.PutEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    deleteEntry(request: timeseries_pb.DeleteEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    deleteEntry(request: timeseries_pb.DeleteEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    deleteEntry(request: timeseries_pb.DeleteEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    getLastEntry(request: timeseries_pb.GetLastEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    getLastEntry(request: timeseries_pb.GetLastEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    getLastEntry(request: timeseries_pb.GetLastEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
    getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
    getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
}

export class TimeSeriesClient extends grpc.Client implements ITimeSeriesClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public hasSerie(request: timeseries_pb.HasSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    public hasSerie(request: timeseries_pb.HasSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    public hasSerie(request: timeseries_pb.HasSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasSerieResponse) => void): grpc.ClientUnaryCall;
    public deleteSerie(request: timeseries_pb.DeleteSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    public deleteSerie(request: timeseries_pb.DeleteSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    public deleteSerie(request: timeseries_pb.DeleteSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteSerieResponse) => void): grpc.ClientUnaryCall;
    public clearSerie(request: timeseries_pb.ClearSerieRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    public clearSerie(request: timeseries_pb.ClearSerieRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    public clearSerie(request: timeseries_pb.ClearSerieRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ClearSerieResponse) => void): grpc.ClientUnaryCall;
    public listSeries(request: timeseries_pb.ListSeriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    public listSeries(request: timeseries_pb.ListSeriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    public listSeries(request: timeseries_pb.ListSeriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListSeriesResponse) => void): grpc.ClientUnaryCall;
    public listEntries(request: timeseries_pb.ListEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    public listEntries(request: timeseries_pb.ListEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    public listEntries(request: timeseries_pb.ListEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.ListEntriesResponse) => void): grpc.ClientUnaryCall;
    public getEntries(request: timeseries_pb.GetEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    public getEntries(request: timeseries_pb.GetEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    public getEntries(request: timeseries_pb.GetEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesResponse) => void): grpc.ClientUnaryCall;
    public hasEntry(request: timeseries_pb.HasEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    public hasEntry(request: timeseries_pb.HasEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    public hasEntry(request: timeseries_pb.HasEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.HasEntryResponse) => void): grpc.ClientUnaryCall;
    public getEntry(request: timeseries_pb.GetEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    public getEntry(request: timeseries_pb.GetEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    public getEntry(request: timeseries_pb.GetEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntryResponse) => void): grpc.ClientUnaryCall;
    public putEntry(request: timeseries_pb.PutEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    public putEntry(request: timeseries_pb.PutEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    public putEntry(request: timeseries_pb.PutEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.PutEntryResponse) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: timeseries_pb.DeleteEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: timeseries_pb.DeleteEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: timeseries_pb.DeleteEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.DeleteEntryResponse) => void): grpc.ClientUnaryCall;
    public getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    public getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    public getNearestEntry(request: timeseries_pb.GetNearestEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetNearestEntryResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryBefore(request: timeseries_pb.GetFirstEntryBeforeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryBeforeResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntryAfter(request: timeseries_pb.GetFirstEntryAfterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryAfterResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    public getFirstEntry(request: timeseries_pb.GetFirstEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstEntryResponse) => void): grpc.ClientUnaryCall;
    public getLastEntry(request: timeseries_pb.GetLastEntryRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    public getLastEntry(request: timeseries_pb.GetLastEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    public getLastEntry(request: timeseries_pb.GetLastEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastEntryResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBetween(request: timeseries_pb.GetEntriesBetweenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBetweenResponse) => void): grpc.ClientUnaryCall;
    public getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getFirstNEntries(request: timeseries_pb.GetFirstNEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetFirstNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getLastNEntries(request: timeseries_pb.GetLastNEntriesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetLastNEntriesResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    public getEntriesBefore(request: timeseries_pb.GetEntriesBeforeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesBeforeResponse) => void): grpc.ClientUnaryCall;
    public getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
    public getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
    public getEntriesAfter(request: timeseries_pb.GetEntriesAfterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: timeseries_pb.GetEntriesAfterResponse) => void): grpc.ClientUnaryCall;
}
