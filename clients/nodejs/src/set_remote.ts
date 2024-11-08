import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionRemote } from './collection_remote';
import { CollectionType } from './proto/collection_pb';
import { SetClient } from './proto/set_grpc_pb';
import { ClearRequest, DeleteRequest, HasRequest, ListKeysRequest, PutRequest, SizeRequest } from './proto/set_pb';
import { CallbackReturnType, ObserverConfig, performRPC } from './util';
import { Channel } from '@grpc/grpc-js/build/src/channel';

export class SetRemote extends CollectionRemote {
    private client: SetClient;

    constructor(channel: Channel, database: string, setName: string, observerConfig: ObserverConfig) {
        super(channel, CollectionType.SET, database, setName, observerConfig);
        this.client = new SetClient(channel.getTarget(), ChannelCredentials.createSsl(), {
            channelFactoryOverride: () => channel,
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
    }

    public async has(key: string): Promise<boolean> {
        const msg = new HasRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);
        msg.setKey(key);

        const res = await performRPC<CallbackReturnType<typeof this.client.has>, HasRequest>(this.observerConfig, this.client.has.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHas();
    }

    public async getRecordCount(): Promise<number> {
        const msg = new SizeRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.size>, SizeRequest>(this.observerConfig, this.client.size.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getSize();
    }

    // Alias for add
    public put(key: string): Promise<void> {
        return this.add(key);
    }

    public async add(key: string): Promise<void> {
        const msg = new PutRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);
        msg.setKey(key);

        const res = await performRPC<CallbackReturnType<typeof this.client.put>, PutRequest>(this.observerConfig, this.client.put.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async clear(): Promise<void> {
        const msg = new ClearRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.clear>, ClearRequest>(this.observerConfig, this.client.clear.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async delete(key: string): Promise<void> {
        const msg = new DeleteRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);
        msg.setKey(key);

        const res = await performRPC<CallbackReturnType<typeof this.client.delete>, DeleteRequest>(
            this.observerConfig,
            this.client.delete.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return;
    }

    public async getKeys(): Promise<string[]> {
        const msg = new ListKeysRequest();

        msg.setDatabase(this.database);
        msg.setSetname(this.name);

        const res = await performRPC<CallbackReturnType<typeof this.client.listKeys>, ListKeysRequest>(
            this.observerConfig,
            this.client.listKeys.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getKeysList();
    }
}
