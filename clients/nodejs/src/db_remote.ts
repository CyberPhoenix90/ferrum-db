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
import { SupportedCompressionTypes, SupportedEncodingTypes, CallbackReturnType, promisify } from './util';
import { Channel } from '@grpc/grpc-js/build/src/channel';

export class FerrumDBRemote {
    private client: DatabaseClient;
    public readonly name: string;
    private channel: Channel;

    constructor(channel: Channel, dbName: string) {
        this.channel = channel;
        this.name = dbName;
        this.client = new DatabaseClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
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

        await promisify<CallbackReturnType<typeof this.client.createIndexIfNotExist>, CreateIndexRequest>(
            this.client.createIndexIfNotExist.bind(this.client),
            msg,
        );

        return this.getIndex(index, encoding, compression);
    }

    public getIndex<T>(index: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): IndexRemote<T> {
        return new IndexRemote<T>(this.channel, this.name, index, encoding, compression);
    }

    public async deleteIndex(index: string): Promise<void> {
        const msg = new DeleteIndexRequest();

        msg.setDatabase(this.name);
        msg.setIndexname(index);

        const res = await promisify<CallbackReturnType<typeof this.client.deleteIndex>, DeleteIndexRequest>(this.client.deleteIndex.bind(this.client), msg);

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

        const res = await promisify<CallbackReturnType<typeof this.client.createIndex>, CreateIndexRequest>(this.client.createIndex.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getIndex(index, encoding, compression);
    }

    public async hasIndex(index: string): Promise<boolean> {
        const msg = new HasIndexRequest();

        msg.setDatabase(this.name);
        msg.setIndexname(index);

        const res = await promisify<CallbackReturnType<typeof this.client.hasIndex>, HasIndexRequest>(this.client.hasIndex.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasindex();
    }

    public async listIndexes(): Promise<string[]> {
        const msg = new ListIndexesRequest();

        msg.setDatabase(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.listIndexes>, ListIndexesRequest>(this.client.listIndexes.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getIndexnamesList();
    }

    public async createSetIfNotExist(set: string): Promise<SetRemote> {
        const msg = new CreateSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await promisify<CallbackReturnType<typeof this.client.createSetIfNotExist>, CreateSetRequest>(
            this.client.createSetIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getSet(set);
    }

    public getSet(set: string): SetRemote {
        return new SetRemote(this.channel, this.name, set);
    }

    public async deleteSet(set: string): Promise<void> {
        const msg = new DeleteSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await promisify<CallbackReturnType<typeof this.client.deleteSet>, DeleteSetRequest>(this.client.deleteSet.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async createSet(set: string): Promise<SetRemote> {
        const msg = new CreateSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await promisify<CallbackReturnType<typeof this.client.createSet>, CreateSetRequest>(this.client.createSet.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getSet(set);
    }

    public async hasSet(set: string): Promise<boolean> {
        const msg = new HasSetRequest();

        msg.setDatabase(this.name);
        msg.setSetname(set);

        const res = await promisify<CallbackReturnType<typeof this.client.hasSet>, HasSetRequest>(this.client.hasSet.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasset();
    }

    public async listSets(): Promise<string[]> {
        const msg = new ListSetsRequest();

        msg.setDatabase(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.listSets>, ListSetsRequest>(this.client.listSets.bind(this.client), msg);

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

        const res = await promisify<CallbackReturnType<typeof this.client.createTimeSeriesIfNotExist>, CreateTimeSeriesRequest>(
            this.client.createTimeSeriesIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return this.getTimeSeries(name, encoding, compression);
    }

    public getTimeSeries<T>(name: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): TimeSeriesRemote<T> {
        return new TimeSeriesRemote<T>(this.channel, this.name, name, encoding, compression);
    }

    public async deleteTimeSeries(name: string): Promise<void> {
        const msg = new DeleteTimeSeriesRequest();

        msg.setDatabase(this.name);
        msg.setTimeseriesname(name);

        const res = await promisify<CallbackReturnType<typeof this.client.deleteTimeSeries>, DeleteTimeSeriesRequest>(
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

        const res = await promisify<CallbackReturnType<typeof this.client.createTimeSeries>, CreateTimeSeriesRequest>(
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

        const res = await promisify<CallbackReturnType<typeof this.client.hasTimeSeries>, HasTimeSeriesRequest>(
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

        const res = await promisify<CallbackReturnType<typeof this.client.listTimeSeries>, ListTimeSeriesRequest>(
            this.client.listTimeSeries.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getTimeseriesnamesList();
    }
}
