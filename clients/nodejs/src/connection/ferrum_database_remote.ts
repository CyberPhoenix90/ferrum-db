import { ChannelCredentials } from '@grpc/grpc-js';
import { DatabaseClient } from '../proto/database_grpc_pb';
import { EmptyRequest } from '../proto/shared_pb';
import { CallbackReturnType, promisify } from '../util';
import { CreateCollectionRequest, DeleteCollectionRequest, HasCollectionRequest } from '../proto/database_pb';

export class FerrumDBRemote {
    //@ts-ignore
    private ip: string;
    //@ts-ignore
    private port: number;
    //@ts-ignore
    private client: DatabaseClient;
    public readonly name: string;

    constructor(ip: string, port: number, dbName: string) {
        this.ip = ip;
        this.port = port;
        this.name = dbName;
        this.client = new DatabaseClient(`${ip}:${port}`, ChannelCredentials.createSsl(), {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
    }

    public async listCollections(): Promise<string[]> {
        const msg = new EmptyRequest();
        const res = await promisify<CallbackReturnType<typeof this.client.listCollections>, EmptyRequest>(this.client.listCollections.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getNamesList();
    }

    public async dropCollection(collectionName: string): Promise<void> {
        const msg = new DeleteCollectionRequest();
        msg.setName(collectionName);

        const res = await promisify<CallbackReturnType<typeof this.client.deleteCollection>, DeleteCollectionRequest>(
            this.client.deleteCollection.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async hasCollection(collectionName: string): Promise<boolean> {
        const msg = new HasCollectionRequest();
        msg.setName(collectionName);

        const res = await promisify<CallbackReturnType<typeof this.client.hasCollection>, HasCollectionRequest>(
            this.client.hasCollection.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHascollection();
    }

    public async createCollection(collectionName: string): Promise<void> {
        const msg = new CreateCollectionRequest();
        msg.setName(collectionName);

        const res = await promisify<CallbackReturnType<typeof this.client.createCollection>, CreateCollectionRequest>(
            this.client.createCollection.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }
}
