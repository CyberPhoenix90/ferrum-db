import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionClient } from './proto/collection_grpc_pb';
import { CollectionType, DeleteTagRequest, GetTagRequest, HasTagRequest, ListTagsRequest, SetTagRequest } from './proto/collection_pb';
import { CallbackReturnType, decodeValue, encodeValue, promisify, SupportedCompressionTypes, SupportedEncodingTypes } from './util';

export class CollectionRemote {
    public readonly type: CollectionType;
    public readonly database: string;

    private ip: string;
    private port: number;
    protected collectionKey: string;
    private collectionClient: CollectionClient;

    public get name(): string {
        return this.collectionKey;
    }

    constructor(ip: string, port: number, type: CollectionType, database: string, collectionkey: string) {
        this.collectionClient = new CollectionClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {});
        this.type = type;
        this.database = database;
        this.collectionKey = collectionkey;
        this.ip = ip;
        this.port = port;
    }

    public async hasTag(tag: string = ''): Promise<boolean> {
        const msg = new HasTagRequest();
        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);
        msg.setTag(tag);

        const res = await promisify<CallbackReturnType<typeof this.collectionClient.hasTag>, HasTagRequest>(
            this.collectionClient.hasTag.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHastag();
    }

    public async getTagEntry<T>(tag: string = '', encoding: SupportedEncodingTypes = 'json', compression: SupportedCompressionTypes = 'gzip'): Promise<T> {
        const msg = new GetTagRequest();

        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);
        msg.setTag(tag);

        const res = await promisify<CallbackReturnType<typeof this.collectionClient.getTag>, GetTagRequest>(
            this.collectionClient.getTag.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return decodeValue(res.getValue_asU8(), encoding, compression);
    }

    public async deleteTag(tag: string = ''): Promise<void> {
        const msg = new DeleteTagRequest();

        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);
        msg.setTag(tag);

        const res = await promisify<CallbackReturnType<typeof this.collectionClient.deleteTag>, DeleteTagRequest>(
            this.collectionClient.deleteTag.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async getTags(): Promise<string[]> {
        const msg = new ListTagsRequest();

        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);

        const res = await promisify<CallbackReturnType<typeof this.collectionClient.listTags>, ListTagsRequest>(
            this.collectionClient.listTags.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getTagsList();
    }

    public async setTag(key: string, value: any, encoding: SupportedEncodingTypes = 'json', compression: SupportedCompressionTypes = 'gzip'): Promise<void> {
        const msg = new SetTagRequest();

        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);
        msg.setTag(key);
        msg.setValue(await encodeValue(value, encoding, compression));

        const res = await promisify<CallbackReturnType<typeof this.collectionClient.setTag>, SetTagRequest>(
            this.collectionClient.setTag.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }
}
