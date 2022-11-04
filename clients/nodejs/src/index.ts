import { ChannelCredentials } from '@grpc/grpc-js';
import { FerrumDBRemote } from './db_remote';
import { DatabaseServerClient } from './proto/database_server_grpc_pb';
import { CreateDatabaseRequest } from './proto/database_server_pb';
import { EmptyRequest } from './proto/shared_pb';
import { CallbackReturnType, promisify } from './util';

export { FerrumDBRemote } from './db_remote';
export { IndexRemote } from './index_remote';
export { SetRemote } from './set_remote';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
export async function ferrumConnect(ip: string, port: number): Promise<FerrumServerConnection> {
    return new FerrumServerConnection(ip, port);
}

export class FerrumServerConnection {
    private ip: string;
    private port: number;
    private client: DatabaseServerClient;

    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
        this.client = new DatabaseServerClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {});
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

    public async hasDatabase(dbName: string): Promise<boolean> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await promisify<CallbackReturnType<typeof this.client.hasDatabase>, CreateDatabaseRequest>(this.client.hasDatabase.bind(this.client), msg);

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasdatabase();
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const msg = new CreateDatabaseRequest();
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
}
