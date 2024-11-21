import { ChannelCredentials } from '@grpc/grpc-js';
import { Channel } from '@grpc/grpc-js/build/src/channel';
import { FerrumDBRemote } from './db_remote';
import { DatabaseServerClient } from './proto/database_server_grpc_pb';
import { CreateDatabaseRequest, DropDatabaseRequest, HasDatabaseRequest } from './proto/database_server_pb';
import { EmptyRequest } from './proto/shared_pb';
import { CallbackReturnType, DatabaseResponseMetrics, EventEmitter, ObserverConfig, performRPC, TimeoutData } from './util';
import { ConnectivityState } from '@grpc/grpc-js/build/src/connectivity-state';

export { FerrumDBRemote } from './db_remote';
export { IndexRemote } from './index_remote';
export { SetRemote } from './set_remote';
export { TimeSeriesRemote } from './time_series_remote';
export { SupportedCompressionTypes, SupportedEncodingTypes } from './util';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
export async function ferrumConnect(ip: string, port: number): Promise<FerrumServerClient> {
    return FerrumServerClient.getFerrumServerClient(ip, port);
}

export { LogVerbosity } from '@grpc/grpc-js/build/src/constants';
export { setLogger, setLogVerbosity } from '@grpc/grpc-js';
export { CollectionType } from './proto/collection_pb';

export class FerrumServerClient {
    private ip: string;
    private port: number;
    private client: DatabaseServerClient;
    private static instanceMap: { [key: string]: FerrumServerClient } = {};
    private observerConfig: ObserverConfig;

    public readonly onRequestSent: EventEmitter<void> = new EventEmitter();
    public readonly onResponseReceived: EventEmitter<DatabaseResponseMetrics> = new EventEmitter();
    public readonly onTimeout: EventEmitter<TimeoutData> = new EventEmitter();
    private onReconnect: EventEmitter<Channel> = new EventEmitter();

    private constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
        this.client = new DatabaseServerClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });

        this.observerConfig = {
            responseNotifier: this.onResponseReceived,
            startNotifier: this.onRequestSent,
            timeoutNotifier: this.onTimeout,
            timeout: 0,
        };
    }

    public getChannelStatus(): ConnectivityState {
        return this.client.getChannel().getConnectivityState(false);
    }

    public setRequestTimeout(timeout: number): void {
        this.observerConfig.timeout = timeout;
    }

    public static getFerrumServerClient(ip: string, port: number): FerrumServerClient {
        const key = `${ip}:${port}`;
        if (!FerrumServerClient.instanceMap[key]) {
            FerrumServerClient.instanceMap[key] = new FerrumServerClient(ip, port);
        }

        return FerrumServerClient.instanceMap[key];
    }

    public static disconnectAll(): void {
        for (const key of Object.keys(FerrumServerClient.instanceMap)) {
            FerrumServerClient.instanceMap[key].disconnect();
        }

        FerrumServerClient.instanceMap = {};
    }

    public async disconnectClient(ip: string, port: number): Promise<void> {
        const key = `${ip}:${port}`;
        if (FerrumServerClient.instanceMap[key]) {
            FerrumServerClient.instanceMap[key].disconnect();
            delete FerrumServerClient.instanceMap[key];
        }
    }

    public disconnect(): void {
        this.client.close();
    }

    public static reconnectAll(): void {
        for (const key of Object.keys(FerrumServerClient.instanceMap)) {
            FerrumServerClient.instanceMap[key].reconnect();
        }
    }

    public reconnect(): void {
        const previousClient = this.client;
        this.client = new DatabaseServerClient(`${this.ip}:${this.port}`, ChannelCredentials.createSsl(), {
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1,
        });

        this.onReconnect.emit(this.client.getChannel());
        previousClient.close();
    }

    public async createDatabaseIfNotExists(dbName: string): Promise<FerrumDBRemote> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);
        const res = await performRPC<CallbackReturnType<typeof this.client.createDatabaseIfNotExist>, CreateDatabaseRequest>(
            this.observerConfig,
            this.client.createDatabaseIfNotExist.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return new FerrumDBRemote(this.client.getChannel(), this.onReconnect, dbName, this.observerConfig);
    }

    public async createDatabase(dbName: string): Promise<FerrumDBRemote> {
        const msg = new CreateDatabaseRequest();
        msg.setName(dbName);

        const res = await performRPC<CallbackReturnType<typeof this.client.createDatabase>, CreateDatabaseRequest>(
            this.observerConfig,
            this.client.createDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return new FerrumDBRemote(this.client.getChannel(), this.onReconnect, dbName, this.observerConfig);
    }

    public async getDatabase(dbName: string): Promise<FerrumDBRemote> {
        const has = await this.hasDatabase(dbName);
        if (!has) {
            throw new Error(`Database ${dbName} does not exist`);
        }

        return new FerrumDBRemote(this.client.getChannel(), this.onReconnect, dbName, this.observerConfig);
    }

    public async hasDatabase(dbName: string): Promise<boolean> {
        const msg = new HasDatabaseRequest();
        msg.setName(dbName);

        const res = await performRPC<CallbackReturnType<typeof this.client.hasDatabase>, CreateDatabaseRequest>(
            this.observerConfig,
            this.client.hasDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getHasdatabase();
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const msg = new DropDatabaseRequest();
        msg.setName(dbName);

        const res = await performRPC<CallbackReturnType<typeof this.client.dropDatabase>, CreateDatabaseRequest>(
            this.observerConfig,
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

        const res = await performRPC<CallbackReturnType<typeof this.client.clearDatabase>, CreateDatabaseRequest>(
            this.observerConfig,
            this.client.clearDatabase.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }
    }

    public async getDatabaseNames(): Promise<string[]> {
        const msg = new EmptyRequest();
        const res = await performRPC<CallbackReturnType<typeof this.client.listDatabases>, EmptyRequest>(
            this.observerConfig,
            this.client.listDatabases.bind(this.client),
            msg,
        );

        if (res.getError()) {
            throw new Error(res.getError());
        }

        return res.getDatabasesList();
    }

    public async getGrpcAPIVersion(): Promise<string> {
        const msg = new EmptyRequest();
        const res = await performRPC<CallbackReturnType<typeof this.client.grpcAPIVersion>, EmptyRequest>(
            this.observerConfig,
            this.client.grpcAPIVersion.bind(this.client),
            msg,
        );

        return res.getVersion();
    }
}
