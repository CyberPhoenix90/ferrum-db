import { ChannelCredentials } from '@grpc/grpc-js';
import { IndexRemote } from './index_remote';
import { DatabaseClient } from './proto/database_grpc_pb';
import {
    CreateIndexRequest,
    CreateSetRequest,
    CreateTimeSeriesRequest,
    DeleteIndexRequest,
    DeleteSetRequest,
    DeleteTimeSeriesRequest,
    HasIndexRequest,
    HasSetRequest,
    HasTimeSeriesRequest,
    ListIndexesRequest,
    ListSetsRequest,
    ListTimeSeriesRequest,
} from './proto/database_pb';
import { SetRemote } from './set_remote';
import { TimeSeriesRemote } from './time_series_remote';
import { SupportedCompressionTypes, SupportedEncodingTypes, CallbackReturnType, performRPC, ObserverConfig, EventEmitter } from './util';
import { Channel } from '@grpc/grpc-js/build/src/channel';

export class FerrumDBRemote {
    private client: DatabaseClient;
    public readonly name: string;
    private channel: Channel;
    private observerConfig: ObserverConfig;
    private onReconnect: EventEmitter<Channel>;

    constructor(channel: Channel, onReconnect: EventEmitter<Channel>, dbName: string, observerConfig: ObserverConfig) {
        this.onReconnect = onReconnect;
        onReconnect.subscribe((ch) => {
            this.client = new DatabaseClient(ch.getTarget(), ChannelCredentials.createSsl(), {
                channelFactoryOverride: () => ch,
                'grpc.max_send_message_length': -1,
                'grpc.max_receive_message_length': -1,
            });
            this.channel = ch;
        });
        this.channel = channel;
        this.name = dbName;
        this.client = new DatabaseClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        this.observerConfig = observerConfig;
    }

    public async createIndexIfNotExist<T>(
        index: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<IndexRemote<T>> {
        const msg = new CreateIndexRequest();
        msg.setDatabase(this.name);
        msg.setIndexname(index);
        msg.setPagesize(pageFileSize);

        await performRPC<CallbackReturnType<typeof this.client.createIndexIfNotExist>, CreateIndexRequest>(
            this.observerConfig,
            this.client.createIndexIfNotExist.bind(this.client),
            msg,
        );

        return this.getIndex(index, encoding, compression);
    }

    public getIndex<T>(index: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): IndexRemote<T> {
        return new IndexRemote<T>(this.channel, this.onReconnect, this.name, index, encoding, compression, this.observerConfig);
    }

    public async deleteIndex(index: string): Promise<void> {
        const msg = new DeleteIndexRequest();

        msg.setDatabase(this.name);
        msg.setIndexname(index);

        const res = await performRPC<CallbackReturnType<typeof this.client.deleteIndex>, DeleteIndexRequest>(
            this.observerConfig,
            this.client.deleteIndex.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async createIndex<T>(
        index: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<IndexRemote<T>> {
        const msg = new CreateIndexRequest();

        msg.setDatabase(this.name);
        msg.setIndexname(index);
        msg.setPagesize(pageFileSize);

        const res = await performRPC<CallbackReturnType<typeof this.client.createIndex>, CreateIndexRequest>(
            this.observerConfig,
            this.client.createIndex.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getIndex(index, encoding, compression);
    }

    public async hasIndex(index: string): Promise<boolean> {
        const msg = new HasIndexRequest();

        msg.setDatabase(this.name);
        msg.setIndexname(index);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasIndex>, HasIndexRequest>(
            this.observerConfig,
            this.client.hasIndex.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasindex();
    }

    public async listIndexes(): Promise<string[]> {
        const msg = new ListIndexesRequest();

        msg.setDatabase(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.listIndexes>, ListIndexesRequest>(
            this.observerConfig,
            this.client.listIndexes.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getIndexnamesList();
    }

    public async createSetIfNotExist(set: string): Promise<SetRemote> {
        const msg = new CreateSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await performRPC<CallbackReturnType<typeof this.client.createSetIfNotExist>, CreateSetRequest>(
            this.observerConfig,
            this.client.createSetIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getSet(set);
    }

    public getSet(set: string): SetRemote {
        return new SetRemote(this.channel, this.onReconnect, this.name, set, this.observerConfig);
    }

    public async deleteSet(set: string): Promise<void> {
        const msg = new DeleteSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await performRPC<CallbackReturnType<typeof this.client.deleteSet>, DeleteSetRequest>(
            this.observerConfig,
            this.client.deleteSet.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async createSet(set: string): Promise<SetRemote> {
        const msg = new CreateSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await performRPC<CallbackReturnType<typeof this.client.createSet>, CreateSetRequest>(
            this.observerConfig,
            this.client.createSet.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getSet(set);
    }

    public async hasSet(set: string): Promise<boolean> {
        const msg = new HasSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasSet>, HasSetRequest>(
            this.observerConfig,
            this.client.hasSet.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasset();
    }

    public async listSets(): Promise<string[]> {
        const msg = new ListSetsRequest();

        msg.setDatabase(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.listSets>, ListSetsRequest>(
            this.observerConfig,
            this.client.listSets.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getSetnamesList();
    }

    public async createTimeSeriesIfNotExist<T>(
        name: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<TimeSeriesRemote<T>> {
        const msg = new CreateTimeSeriesRequest();

        msg.setDatabase(this.name);
        msg.setTimeseriesname(name);
        msg.setPagesize(pageFileSize);

        const res = await performRPC<CallbackReturnType<typeof this.client.createTimeSeriesIfNotExist>, CreateTimeSeriesRequest>(
            this.observerConfig,
            this.client.createTimeSeriesIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getTimeSeries(name, encoding, compression);
    }

    public getTimeSeries<T>(name: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): TimeSeriesRemote<T> {
        return new TimeSeriesRemote<T>(this.channel, this.onReconnect, this.name, name, encoding, compression, this.observerConfig);
    }

    public async deleteTimeSeries(name: string): Promise<void> {
        const msg = new DeleteTimeSeriesRequest();

        msg.setDatabase(this.name);
        msg.setTimeseriesname(name);

        const res = await performRPC<CallbackReturnType<typeof this.client.deleteTimeSeries>, DeleteTimeSeriesRequest>(
            this.observerConfig,
            this.client.deleteTimeSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async createTimeSeries<T>(
        name: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<TimeSeriesRemote<T>> {
        const msg = new CreateTimeSeriesRequest();

        msg.setDatabase(this.name);
        msg.setTimeseriesname(name);
        msg.setPagesize(pageFileSize);

        const res = await performRPC<CallbackReturnType<typeof this.client.createTimeSeries>, CreateTimeSeriesRequest>(
            this.observerConfig,
            this.client.createTimeSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getTimeSeries(name, encoding, compression);
    }

    public async hasTimeSeries(name: string): Promise<boolean> {
        const msg = new HasTimeSeriesRequest();

        msg.setDatabase(this.name);
        msg.setTimeseriesname(name);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasTimeSeries>, HasTimeSeriesRequest>(
            this.observerConfig,
            this.client.hasTimeSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHastimeseries();
    }

    public async getListOfTimeSeries(): Promise<string[]> {
        const msg = new ListTimeSeriesRequest();

        msg.setDatabase(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.listTimeSeries>, ListTimeSeriesRequest>(
            this.observerConfig,
            this.client.listTimeSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getTimeseriesnamesList();
    }
}
