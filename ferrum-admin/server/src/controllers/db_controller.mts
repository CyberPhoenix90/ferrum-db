import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { Controller } from './controller.mjs';
import { Request } from '../framework/request.mjs';
import { ServerResponse } from 'http';
import { getConnectionFor } from '../connect_manager.mjs';
import { post } from '../decorators/method.mjs';
import { CollectionCompression, CollectionEvictionStrategy, CollectionKeyType, CollectionPersistence, CollectionValueType } from 'shared';

@route('/db')
export class DbController extends Controller {
    @publicEndpoint()
    @post<
        {
            serverIP: string;
            serverPort: number;
            database: string;
        },
        {
            collections: string[];
            success: boolean;
            error?: string;
        }
    >()
    public async listCollections(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // List databases
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ collections: await connection.connection.getDatabase(req.body.database).listCollecions(), success: true }));
        } catch (e) {
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    }

    @publicEndpoint()
    @post<
        {
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
            keyType: CollectionKeyType;
            valueType: CollectionValueType;
            compression: CollectionCompression;
            persistence: CollectionPersistence;
            evictionStrategy: CollectionEvictionStrategy;
            maxRecordCount: number;
            maxCollectionSize: number;
            pageSize: number;
            overProvisionFactor: number;
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async createCollection(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Create database
            await connection.connection.createDatabase(req.body.dbName);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    }

    @publicEndpoint()
    @post<
        {
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async hasCollection(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: await connection.connection.getDatabase(req.body.dbName).hasCollection(req.body.collectionName) }));
        } catch (e) {
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    }

    @publicEndpoint()
    @post<
        {
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async deleteCollection(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Delete collection
            await connection.connection.getDatabase(req.body.dbName).dropCollection(req.body.collectionName);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    }
}
