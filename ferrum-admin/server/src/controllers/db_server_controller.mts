import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { Controller } from './controller.mjs';
import { Request } from '../framework/request.mjs';
import { ServerResponse } from 'http';
import { getConnectionFor } from '../connect_manager.mjs';
import { post } from '../decorators/method.mjs';

@route('/dbserver')
export class DbServerController extends Controller {
    @publicEndpoint()
    @post<
        {
            serverIP: string;
            serverPort: number;
        },
        {
            databases: string[];
            success: boolean;
            error?: string;
        }
    >()
    public async listDatabases(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // List databases
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ databases: await connection.connection.listDatabases(), success: true }));
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
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async createDatabase(req: Request, res: ServerResponse) {
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
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async hasDatabase(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Check if database exists
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: await connection.connection.hasDatabase(req.body.dbName) }));
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
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async deleteDatabase(req: Request, res: ServerResponse) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Delete database
            await connection.connection.dropDatabase(req.body.dbName);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
    }
}
