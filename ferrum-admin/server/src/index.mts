import { AurumServer } from 'aurum-server';
import express from 'express';
import { createServer } from 'http';
import { getConnectionFor } from './connection_pool.mjs';
import { connections } from './state.mjs';

const app = express();
const server = createServer(app);
const as = AurumServer.create<void>({
    reuseServer: server,
});

as.exposeFunction('/api/authenticate', async (msg: { serverIP: string; serverPort: number }) => {
    await getConnectionFor(msg.serverIP, msg.serverPort);
    return true;
});

as.exposeFunction('/api/list-databases', async (msg: { serverIP: string; serverPort: number }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    const dbs = await connection.getDatabaseNames();
    return dbs;
});

as.exposeFunction('/api/list-collections', async (msg: { serverIP: string; serverPort: number; database: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getIndexes();
});

as.exposeFunction('/api/list-collection-keys', async (msg: { serverIP: string; serverPort: number; database: string; index: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getIndex(msg.index).getKeys();
});

as.exposeFunction('/api/get-collection-value', async (msg: { serverIP: string; serverPort: number; database: string; index: string; key: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    const value = await connection.getDatabase(msg.database).getIndex(msg.index).get(msg.key);
    return value;
});

as.exposeArrayDataSource('/api/connections', connections);

as.exposeFunction('/api/kick-connection', async (msg: { serverIP: string; serverPort: number; connectionId: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    try {
        await connection.kickConnection(msg.connectionId);
    } catch {}
});

server.listen(8080, 'localhost', () => {});
