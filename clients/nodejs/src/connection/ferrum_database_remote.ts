import { ChannelCredentials } from '@grpc/grpc-js';
import { DatabaseClient } from '../proto/database_grpc_pb';

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
}
