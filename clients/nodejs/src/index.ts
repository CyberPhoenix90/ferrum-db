import { Encoding } from 'csharp-binary-stream';
import { Socket } from 'net';
import { FerrumServerClient } from './client';
import { FerrumDBRemote } from './db_remote';
import { ApiMessageType } from './protcol';
import { getBinaryReader, handleErrorResponse } from './utils';

export { FerrumDBRemote } from './db_remote';
export { IndexRemote } from './index_remote';
export { CollectionType } from './collection_remote';
export { SetRemote } from './set_remote';

const HEARTBEAT_TIMEOUT = 1000 * 30;

export async function ferrumConnect(ip: string, port: number, options?: { heartbeatTimeout: number }): Promise<FerrumServerConnection> {
    const client = await makeNewSocket(port, ip, options);
    return new FerrumServerConnection(client);
}

export class FerrumServerConnection {
    private client: FerrumServerClient;

    constructor(client: FerrumServerClient) {
        this.client = client;
    }

    public async reconnect(): Promise<void> {
        this.client.disconnect();
        this.client = await makeNewSocket(this.client.port, this.client.ip, {
            heartbeatTimeout: this.client.hearBeatTimeout,
        });
    }

    public disconnect(): void {
        this.client.disconnect();
    }

    public async createDatabaseIfNotExists(dbName: string): Promise<FerrumDBRemote> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST, dbName.length + 4);
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return new FerrumDBRemote(this.client, dbName);
        }
    }

    public async createDatabase(dbName: string): Promise<FerrumDBRemote> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_DATABASE, dbName.length + 4);
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return new FerrumDBRemote(this.client, dbName);
        }
    }

    public async hasDatabase(dbName: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_DATABASE, dbName.length);
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return br.readBoolean();
        }
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DROP_DATABASE, dbName.length);
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async clearDatabase(dbName: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CLEAR_DATABASE, dbName.length);
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        }
        return undefined;
    }

    public async getDatabaseNames(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.LIST_DATABASES, 0);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            const result = new Array(len);
            for (let i = 0; i < len; i++) {
                result[i] = br.readString(Encoding.Utf8);
            }
            return result;
        }
    }

    public getDatabase(dbName: string): FerrumDBRemote {
        return new FerrumDBRemote(this.client, dbName);
    }
}
function makeNewSocket(port: number, ip: string, options: { heartbeatTimeout: number }): Promise<FerrumServerClient> {
    return new Promise<FerrumServerClient>((resolve, reject) => {
        const socket = new Socket();
        socket.setNoDelay(true);
        socket.connect(port, ip);
        socket.once('connect', () => {
            const client = new FerrumServerClient(socket, options?.heartbeatTimeout ?? HEARTBEAT_TIMEOUT);
            resolve(client);
        });
        socket.once('error', (e) => {
            reject(e);
        });

        socket.once('timeout', () => {
            reject(new Error('Connection timeout'));
        });
    });
}
