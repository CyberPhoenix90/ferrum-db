import { FerrumServerClient } from 'ferrum-db-client';

export interface Connection {
    connection: FerrumServerClient;
    ip: string;
    port: number;
    connectedSince: number;
}

const connectionPool = new Map<string, Connection>();

export function listConnections(): Connection[] {
    return Array.from(connectionPool.values());
}

export function getConnectionFor(ip: string, port: number): Promise<Connection> {
    const key = `${ip}:${port}`;
    let connection = connectionPool.get(key);
    if (!connection) {
        const client = new FerrumServerClient(ip, port);
        return new Promise((resolve, reject) => {
            client.once('ready', () => {
                const result = {
                    connection: client,
                    ip,
                    port,
                    connectedSince: Date.now(),
                };
                connectionPool.set(key, result);
                resolve(result);
            });
            client.once('error', (err) => {
                reject(err);
            });
        });
    }

    return Promise.resolve(connection);
}

export function kickConnection(ip: string, port: number): void {
    const connectionId = `${ip}:${port}`;
    if (connectionPool.has(connectionId)) {
        const connection = connectionPool.get(connectionId);
        connection.connection.close();
        connectionPool.delete(connectionId);
    }
}

export function reconnect(ip: string, port: number): Promise<Connection> {
    kickConnection(ip, port);
    return getConnectionFor(ip, port);
}
