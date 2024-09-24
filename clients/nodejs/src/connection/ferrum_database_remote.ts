import { ChannelCredentials } from '@grpc/grpc-js';
import { CollectionKeyType, CompressionAlgorithm, EvictionPolicy, Persistence, ValueEncodingType } from '../proto/collection_pb';
import { DatabaseClient } from '../proto/database_grpc_pb';
import { CreateCollectionRequest, DeleteCollectionRequest, HasCollectionRequest, ListCollectionsRequest, ListCollectionsResponse } from '../proto/database_pb';
import { CallbackReturnType, promisify } from '../util';
import { SuccessResponse } from '../proto/shared_pb';

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
            'grpc.max_send_message_length': 128 * 1024 * 1024,
            'grpc.max_receive_message_length': 128 * 1024 * 1024,
        });
    }

    public async listCollections(): Promise<ListCollectionsResponse> {
        const msg = new ListCollectionsRequest();
        msg.setDatabase(this.name);

        const res = await promisify<CallbackReturnType<typeof this.client.listCollections>, ListCollectionsRequest>(
            this.client.listCollections.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res;
    }

    public async dropCollection(collectionName: string): Promise<SuccessResponse> {
        const msg = new DeleteCollectionRequest();
        msg.setName(collectionName);

        const res = await promisify<CallbackReturnType<typeof this.client.deleteCollection>, DeleteCollectionRequest>(
            this.client.deleteCollection.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res;
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

    public async createCollection(config: {
        name: string;
        keyType: CollectionKeyType;
        valueType: ValueEncodingType;
        compression: CompressionAlgorithm;
        persistence: Persistence;
        evictionStrategy?: EvictionPolicy;
        maxRecordCount?: number;
        maxCollectionSize?: number;
        pageSize?: number;
        overProvisionFactor?: number;
    }): Promise<SuccessResponse> {
        const msg = new CreateCollectionRequest();
        msg.setDatabase(this.name);
        msg.setName(config.name);
        msg.setKeytype(config.keyType);
        msg.setValuetype(config.valueType);
        msg.setCompressionalgorithm(config.compression);
        msg.setPersistencetype(config.persistence);
        if (config.evictionStrategy) {
            msg.setEvictionpolicy(config.evictionStrategy);
        }
        if (config.maxRecordCount) {
            msg.setRecordlimit(config.maxRecordCount);
        }
        if (config.maxCollectionSize) {
            msg.setCollectionsizelimit(config.maxCollectionSize);
        }
        if (config.pageSize) {
            msg.setPagesize(config.pageSize);
        }
        if (config.overProvisionFactor) {
            msg.setOverprovision(config.overProvisionFactor);
        }

        const res = await promisify<CallbackReturnType<typeof this.client.createCollection>, CreateCollectionRequest>(
            this.client.createCollection.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res;
    }
}
