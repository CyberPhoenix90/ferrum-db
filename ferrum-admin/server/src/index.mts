import { AurumServer } from 'aurum-server';
import express from 'express';
import { createServer } from 'http';
import { getConnectionFor } from './connection_pool.mjs';

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

as.exposeFunction('/api/list-indexes', async (msg: { serverIP: string; serverPort: number; database: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getIndexes();
});

as.exposeFunction('/api/list-sets', async (msg: { serverIP: string; serverPort: number; database: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getSets();
});

as.exposeFunction('/api/list-timeseries', async (msg: { serverIP: string; serverPort: number; database: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getListOfTimeSeries();
});

as.exposeFunction('/api/list-index-keys', async (msg: { serverIP: string; serverPort: number; database: string; index: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getIndex(msg.index).getKeys();
});

as.exposeFunction('/api/list-set-keys', async (msg: { serverIP: string; serverPort: number; database: string; set: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getSet(msg.set).getKeys();
});

as.exposeFunction('/api/list-timeseries-keys', async (msg: { serverIP: string; serverPort: number; database: string; timeseries: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    return connection.getDatabase(msg.database).getTimeSeries(msg.timeseries).getSeries();
});

as.exposeFunction('/api/get-index-value', async (msg: { serverIP: string; serverPort: number; database: string; index: string; key: string }) => {
    const connection = await getConnectionFor(msg.serverIP, msg.serverPort);
    const value = await connection.getDatabase(msg.database).getIndex(msg.index, 'json', 'none').get(msg.key);
    return value;
});

server.listen(8080, 'localhost', () => {});
