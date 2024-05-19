import { ChannelCredentials } from '@grpc/grpc-js';
import { DatabaseServerClient } from '../proto/database_server_grpc_pb.js';
import { CreateDatabaseRequest, DropDatabaseRequest, HasDatabaseRequest } from '../proto/database_server_pb.js';
import { CallbackReturnType, promisify } from '../util.mjs';
import { EmptyRequest } from '../proto/shared_pb.js';
import { FerrumDBRemote } from './ferrum_database_remote.mjs';

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

    public async listDatabases(): Promise<string[]> {
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
