import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionClient } from './proto/collection_grpc_pb';
import { CollectionType, DeleteTagRequest, GetTagRequest, HasTagRequest, ListTagsRequest, SetTagRequest } from './proto/collection_pb';
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

export class CollectionRemote {
    protected observerConfig: ObserverConfig;
    public readonly type: CollectionType;
    public readonly database: string;

    protected collectionKey: string;
    private collectionClient: CollectionClient;

    public get name(): string {
        return this.collectionKey;
    }

    constructor(
        channel: Channel,
        onReconnect: EventEmitter<Channel>,
        type: CollectionType,
        database: string,
        collectionkey: string,
        observerConfig: ObserverConfig,
    ) {
        onReconnect.subscribe((ch) => {
            this.collectionClient = new CollectionClient(ch.getTarget(), ChannelCredentials.createSsl(), {
                channelFactoryOverride: () => ch,
                'grpc.max_send_message_length': -1,
                'grpc.max_receive_message_length': -1,
            });
        });

        this.collectionClient = new CollectionClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        this.type = type;
        this.database = database;
        this.collectionKey = collectionkey;
        this.observerConfig = observerConfig;
    }

    public async hasTag(tag: string = ''): Promise<boolean> {
        const msg = new HasTagRequest();
        msg.setDatabase(this.database);
        msg.setCollection(this.collectionKey);
        msg.setCollectiontype(this.type);
        msg.setTag(tag);

        const res = await performRPC<CallbackReturnType<typeof this.collectionClient.hasTag>, HasTagRequest>(
            this.observerConfig,
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

        const res = await performRPC<CallbackReturnType<typeof this.collectionClient.getTag>, GetTagRequest>(
            this.observerConfig,
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

        const res = await performRPC<CallbackReturnType<typeof this.collectionClient.deleteTag>, DeleteTagRequest>(
            this.observerConfig,
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

        const res = await performRPC<CallbackReturnType<typeof this.collectionClient.listTags>, ListTagsRequest>(
            this.observerConfig,
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

        const res = await performRPC<CallbackReturnType<typeof this.collectionClient.setTag>, SetTagRequest>(
            this.observerConfig,
            this.collectionClient.setTag.bind(this.collectionClient),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }
}
