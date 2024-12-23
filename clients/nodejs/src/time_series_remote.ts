import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionRemote } from './collection_remote';
import { CollectionType } from './proto/collection_pb';
import { TimeSeriesClient } from './proto/timeseries_grpc_pb';
import {
    ClearSerieRequest,
    DeleteEntryRequest,
    DeleteSerieRequest,
    GetEntriesAfterRequest,
    GetEntriesBeforeRequest,
    GetEntriesBetweenRequest,
    GetEntriesRequest,
    GetEntryRequest,
    GetFirstEntryAfterRequest,
    GetFirstEntryBeforeRequest,
    GetFirstEntryRequest,
    GetLastEntryRequest,
    GetLastNEntriesRequest,
    GetNearestEntryRequest,
    HasEntryRequest,
    HasSerieRequest,
    ListEntriesRequest,
    ListSeriesRequest,
    PutEntryRequest,
} from './proto/timeseries_pb';
import {
    CallbackReturnType,
    decodeValue,
    encodeValue,
    EventEmitter,
    ObserverConfig,
    performRPC,
    SupportedCompressionTypes,
    SupportedEncodingTypes,
} from './util';
import { Channel } from '@grpc/grpc-js/build/src/channel';

export class TimeSeriesRemote<T> extends CollectionRemote {
    private encoding: SupportedEncodingTypes;
    private compression: SupportedCompressionTypes;
    private client: TimeSeriesClient;

    constructor(
        channel: Channel,
        onReconnect: EventEmitter<Channel>,
        database: string,
        timeSeriesName: string,
        encoding: SupportedEncodingTypes,
        compression: SupportedCompressionTypes,
        observerConfig: ObserverConfig,
    ) {
        super(channel, onReconnect, CollectionType.TIMESERIES, database, timeSeriesName, observerConfig);
        onReconnect.subscribe((ch) => {
            this.client = new TimeSeriesClient(ch.getTarget(), ChannelCredentials.createSsl(), {
                channelFactoryOverride: () => ch,
                'grpc.max_send_message_length': -1,
                'grpc.max_receive_message_length': -1,
            });
        });

        this.client = new TimeSeriesClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        this.encoding = encoding;
        this.compression = compression;
    }

    public async hasSerie(serie: string): Promise<boolean> {
        const msg = new HasSerieRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasSerie>, HasSerieRequest>(
            this.observerConfig,
            this.client.hasSerie.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasserie();
    }

    public async getEntry(serie: string, timestamp: number): Promise<T | null> {
        const msg = new GetEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getEntry>, GetEntryRequest>(
            this.observerConfig,
            this.client.getEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async hasEntry(serie: string, timestamp: number): Promise<boolean> {
        const msg = new HasEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasEntry>, HasEntryRequest>(
            this.observerConfig,
            this.client.hasEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasentry();
    }

    public async deleteEntry(serie: string, timestamp: number): Promise<void> {
        const msg = new DeleteEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.deleteEntry>, DeleteEntryRequest>(
            this.observerConfig,
            this.client.deleteEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async ListEntries(serie: string): Promise<number[]> {
        const msg = new ListEntriesRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.listEntries>, ListEntriesRequest>(
            this.observerConfig,
            this.client.listEntries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getTimestampsList();
    }

    public async getFullSerieEntries(serie: string): Promise<T[]> {
        const msg = new GetEntriesRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.getEntries>, GetEntriesRequest>(
            this.observerConfig,
            this.client.getEntries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Promise.all(res.getEntriesList_asU8().map((entry) => decodeValue<T>(entry, this.encoding, this.compression)));
    }

    public async getNearestEntryToTimestamp(serie: string, timestamp: number): Promise<T | null> {
        const msg = new GetNearestEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getNearestEntry>, GetNearestEntryRequest>(
            this.observerConfig,
            this.client.getNearestEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async getFirstEntryBeforeTimestamp(serie: string, timestamp: number): Promise<T | null> {
        const msg = new GetFirstEntryBeforeRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getFirstEntryBefore>, GetFirstEntryBeforeRequest>(
            this.observerConfig,
            this.client.getFirstEntryBefore.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async getFirstEntryAfterTimestamp(serie: string, timestamp: number): Promise<T | null> {
        const msg = new GetFirstEntryAfterRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getFirstEntryAfter>, GetFirstEntryAfterRequest>(
            this.observerConfig,
            this.client.getFirstEntryAfter.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async getLastEntry(serie: string): Promise<T | null> {
        const msg = new GetLastEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.getLastEntry>, GetLastEntryRequest>(
            this.observerConfig,
            this.client.getLastEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async getFirstEntry(serie: string): Promise<T | null> {
        const msg = new GetFirstEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.getFirstEntry>, GetFirstEntryRequest>(
            this.observerConfig,
            this.client.getFirstEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getEntry_asU8(), this.encoding, this.compression);
    }

    public async getLastNEntries(serie: string, count: number): Promise<T[]> {
        const msg = new GetLastNEntriesRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setN(count);

        const res = await performRPC<CallbackReturnType<typeof this.client.getLastNEntries>, GetLastNEntriesRequest>(
            this.observerConfig,
            this.client.getLastNEntries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Promise.all(res.getEntriesList_asU8().map((entry) => decodeValue<T>(entry, this.encoding, this.compression)));
    }

    public async getEntriesBeforeTimestamp(serie: string, timestamp: number): Promise<T[]> {
        const msg = new GetEntriesBeforeRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getEntriesBefore>, GetEntriesBeforeRequest>(
            this.observerConfig,
            this.client.getEntriesBefore.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Promise.all(res.getEntriesList_asU8().map((entry) => decodeValue<T>(entry, this.encoding, this.compression)));
    }

    public async getEntriesAfterTimestamp(serie: string, timestamp: number): Promise<T[]> {
        const msg = new GetEntriesAfterRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);

        const res = await performRPC<CallbackReturnType<typeof this.client.getEntriesAfter>, GetEntriesAfterRequest>(
            this.observerConfig,
            this.client.getEntriesAfter.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Promise.all(res.getEntriesList_asU8().map((entry) => decodeValue<T>(entry, this.encoding, this.compression)));
    }

    public async getEntriesBetween(serie: string, start: number, end: number): Promise<T[]> {
        const msg = new GetEntriesBetweenRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setFrom(start);
        msg.setTo(end);

        const res = await performRPC<CallbackReturnType<typeof this.client.getEntriesBetween>, GetEntriesBetweenRequest>(
            this.observerConfig,
            this.client.getEntriesBetween.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Promise.all(res.getEntriesList_asU8().map((entry) => decodeValue<T>(entry, this.encoding, this.compression)));
    }

    public async deleteSerie(serie: string): Promise<void> {
        const msg = new DeleteSerieRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);

        const res = await performRPC<CallbackReturnType<typeof this.client.deleteSerie>, DeleteSerieRequest>(
            this.observerConfig,
            this.client.deleteSerie.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    // Alias for set
    public put(serie: string, timestamp: number, value: T): Promise<void> {
        return this.set(serie, timestamp, value);
    }

    public async set(serie: string, timestamp: number, value: T): Promise<void> {
        const msg = new PutEntryRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);
        msg.setSerie(serie);
        msg.setTimestamp(timestamp);
        msg.setEntry(await encodeValue(value, this.encoding, this.compression));

        const res = await performRPC<CallbackReturnType<typeof this.client.putEntry>, PutEntryRequest>(
            this.observerConfig,
            this.client.putEntry.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async clear(): Promise<void> {
        const msg = new ClearSerieRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.clearSerie>, ClearSerieRequest>(
            this.observerConfig,
            this.client.clearSerie.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async listSeries(): Promise<string[]> {
        const msg = new ListSeriesRequest();

        msg.setDatabase(this.database);
        msg.setTimeseries(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.listSeries>, ListSeriesRequest>(
            this.observerConfig,
            this.client.listSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getSeriesList();
    }
}
