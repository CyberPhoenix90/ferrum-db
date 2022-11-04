import { ArrayDataSource } from 'aurumjs';

export interface Connection {
    id: string;
    connectedSince: number;
    messagesSent: number;
    messagesPerMinute: number;
}

export const connections: ArrayDataSource<Connection> = new ArrayDataSource();
