import { ferrumConnect, FerrumServerConnection } from 'ferrum-db-client';

const connectionPool = new Map<string, FerrumServerConnection>();

export async function getConnectionFor(ip: string, port: number) {
    const key = `${ip}:${port}`;
    let connection = connectionPool.get(key);
    if (!connection) {
        connection = await ferrumConnect(ip, port);
        connectionPool.set(key, connection);
    }
    return connection;
}
