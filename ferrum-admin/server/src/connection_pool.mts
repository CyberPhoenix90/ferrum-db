import { ferrumConnect } from 'ferrum-db-client';
import { Connection, connections } from './state.mjs';

const connectionPool = new Map<string, any>();

export async function getConnectionFor(ip: string, port: number) {
    const key = `${ip}:${port}`;
    let connection = connectionPool.get(key);
    if (!connection) {
        connection = await ferrumConnect(ip, port);

        setInterval(async () => {
            try {
                const ids = await connection.getServerConnections();
                const state: Connection[] = [];
                for (const id of ids) {
                    const { connectedSince, messagesPerMinute, messgesSent } = await connection.getServerConnectionInfo(id);
                    state.push({
                        id,
                        connectedSince: connectedSince.getMilliseconds(),
                        messagesPerMinute,
                        messagesSent: messgesSent,
                    });
                }

                connections.merge(state);
            } catch {}
        }, 1000);

        connectionPool.set(key, connection);
    }
    return connection;
}
