import { ChannelCredentials } from '@grpc/grpc-js';
import { FerrumDBRemote } from './db_remote';
import { DatabaseServerClient } from './proto/database_server_grpc_pb';
import { CreateDatabaseRequest, DropDatabaseRequest, HasDatabaseRequest } from './proto/database_server_pb';
import { EmptyRequest } from './proto/shared_pb';
import { CallbackReturnType, promisify } from './util';

export { FerrumDBRemote } from './db_remote';
export { IndexRemote } from './index_remote';
export { SetRemote } from './set_remote';
export { TimeSeriesRemote } from './time_series_remote';
export { SupportedCompressionTypes, SupportedEncodingTypes } from './util';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
export async function ferrumConnect(ip: string, port: number): Promise<FerrumServerClient> {
    return new FerrumServerClient(ip, port);
}

export { CollectionType } from './proto/collection_pb';

export class FerrumServerClient {
    private ip: string;
    private port: number;
    private client: DatabaseServerClient;

    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
        this.client = new DatabaseServerClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
    }

    public async createDatabaseIfNotExists(dbName: string): Promise<FerrumDBRemote> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.createDatabaseIfNotExist>, CreateDatabaseRequest>(
            this.client.createDatabaseIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return new FerrumDBRemote(this.ip, this.port, dbName);
    }

    public async createDatabase(dbName: string): Promise<FerrumDBRemote> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.createDatabase>, CreateDatabaseRequest>(
            this.client.createDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return new FerrumDBRemote(this.ip, this.port, dbName);
    }

    public async getDatabase(dbName: string): Promise<FerrumDBRemote> {
        const has = await this.hasDatabase(dbName);
        if (!has) {
            throw new Error(`Database ${dbName} does not exist`);
        }

        return new FerrumDBRemote(this.ip, this.port, dbName);
    }

    public async hasDatabase(dbName: string): Promise<boolean> {
        const msg = new HasDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.hasDatabase>, CreateDatabaseRequest>(this.client.hasDatabase.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasdatabase();
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const msg = new DropDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.dropDatabase>, CreateDatabaseRequest>(
            this.client.dropDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async clearDatabase(dbName: string): Promise<void> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.clearDatabase>, CreateDatabaseRequest>(
            this.client.clearDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async getDatabaseNames(): Promise<string[]> {
        const msg = new EmptyRequest();
        const res = await promisify<CallbackReturnType<typeof this.client.listDatabases>, EmptyRequest>(this.client.listDatabases.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getDatabasesList();
    }

    public async getGrpcAPIVersion(): Promise<string> {
        const msg = new EmptyRequest();
        const res = await promisify<CallbackReturnType<typeof this.client.grpcAPIVersion>, EmptyRequest>(this.client.grpcAPIVersion.bind(this.client), msg);

        return res.getVersion();
    }
}
