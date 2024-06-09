import { ChannelCredentials } from '@grpc/grpc-js';
import { EventEmitter } from 'events';
import { DatabaseServerClient } from '../proto/database_server_grpc_pb';
import { ClearDatabaseRequest, CreateDatabaseRequest, DropDatabaseRequest, HasDatabaseRequest } from '../proto/database_server_pb';
import { EmptyRequest } from '../proto/shared_pb';
import { CallbackReturnType, promisify } from '../util';
import { FerrumDBRemote } from './ferrum_database_remote';

//ignore unsafe ssl
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export class FerrumServerClient extends EventEmitter<{ error: [Error]; ready: [] }> {
    private ip: string;
    private port: number;
    private client: DatabaseServerClient;

    constructor(ip: string, port: number, connectTimeout: number = 10000) {
        super();
        this.ip = ip;
        this.port = port;
        this.client = new DatabaseServerClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });
        this.client.waitForReady(Date.now() + connectTimeout, (err) => {
            if (err) {
                this.emit('error', err);
            } else {
                this.emit('ready');
            }
        });
    }

    public async close(): Promise<void> {
        this.client.close();
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

    public getDatabase(dbName: string): FerrumDBRemote {
        return new FerrumDBRemote(this.ip, this.port, dbName);
    }

    public async hasDatabase(dbName: string): Promise<boolean> {
        const msg = new HasDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.hasDatabase>, HasDatabaseRequest>(this.client.hasDatabase.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasdatabase();
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const msg = new DropDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.dropDatabase>, DropDatabaseRequest>(this.client.dropDatabase.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async clearDatabase(dbName: string): Promise<void> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.clearDatabase>, ClearDatabaseRequest>(
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
