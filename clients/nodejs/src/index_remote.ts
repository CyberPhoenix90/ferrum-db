import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionRemote } from './collection_remote';
import { CollectionType } from './proto/collection_pb';
import { IndexClient } from './proto/index_grpc_pb';
import {
    ClearRequest,
    DeleteRequest,
    GetChunkRequest,
    GetRecordCountRequest,
    GetRecordSizeRequest,
    GetRequest,
    HasRequest,
    ListKeysRequest,
    PutRequest,
} from './proto/index_pb';
import { CallbackReturnType, decodeValue, encodeValue, promisify, SupportedCompressionTypes, SupportedEncodingTypes } from './util';
import { Channel } from '@grpc/grpc-js/build/src/channel';

export class IndexRemote<T> extends CollectionRemote {
    private encoding: SupportedEncodingTypes;
    private compression: SupportedCompressionTypes;
    private client: IndexClient;

    constructor(channel: Channel, database: string, indexName: string, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes) {
        super(channel, CollectionType.INDEX, database, indexName);
        this.client = new IndexClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        this.encoding = encoding;
        this.compression = compression;
    }

    public async has(key: string): Promise<boolean> {
        const msg = new HasRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);

        const res = await promisify<CallbackReturnType<typeof this.client.has>, HasRequest>(this.client.has.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHas();
    }

    public async getRecordSize(key: string): Promise<number> {
        const msg = new GetRecordSizeRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);

        const res = await promisify<CallbackReturnType<typeof this.client.getRecordSize>, GetRecordSizeRequest>(
            this.client.getRecordSize.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getSize();
    }

    public async getRecordCount(): Promise<number> {
        const msg = new GetRecordCountRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.getRecordCount>, GetRecordCountRequest>(
            this.client.getRecordCount.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getCount();
    }

    public async get(key: string): Promise<T> {
        const msg = new GetRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);

        const res = await promisify<CallbackReturnType<typeof this.client.get>, GetRequest>(this.client.get.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return decodeValue(res.getValue_asU8(), this.encoding, this.compression);
    }

    public async getOrNull(key: string): Promise<T | null> {
        const msg = new GetRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);

        const res = await promisify<CallbackReturnType<typeof this.client.get>, GetRequest>(this.client.get.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        if (res.getNotfound()) {
            return null;
        }

        return decodeValue(res.getValue_asU8(), this.encoding, this.compression);
    }

    public async delete(key: string): Promise<void> {
        const msg = new DeleteRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);

        const res = await promisify<CallbackReturnType<typeof this.client.delete>, DeleteRequest>(this.client.delete.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async readChunk(key: string, offset: number, size: number): Promise<Buffer> {
        const msg = new GetChunkRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);
        msg.setOffset(offset);

        const res = await promisify<CallbackReturnType<typeof this.client.getChunk>, GetChunkRequest>(this.client.getChunk.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return Buffer.from(res.getChunk_asU8());
    }

    // Alias for set
    public put(key: string, value: T): Promise<void> {
        return this.set(key, value);
    }

    public async set(key: string, value: T): Promise<void> {
        const msg = new PutRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);
        msg.setKey(key);
        msg.setValue(await encodeValue(value, this.encoding, this.compression));

        const res = await promisify<CallbackReturnType<typeof this.client.put>, PutRequest>(this.client.put.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async clear(): Promise<void> {
        const msg = new ClearRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.clear>, ClearRequest>(this.client.clear.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async getKeys(): Promise<string[]> {
        const msg = new ListKeysRequest();

        msg.setDatabase(this.database);
        msg.setIndexname(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.listKeys>, ListKeysRequest>(this.client.listKeys.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getKeysList();
    }
}
