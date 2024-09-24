import { getConnectionFor, reconnect } from '../connect_manager.mjs';
import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { FerrumRequest, FerrumResponse } from '../framework/request.mjs';
import { Controller } from './controller.mjs';
import { post } from '../decorators/method.mjs';
import { stream } from '../decorators/stream.mjs';
import { SuccessResponseCode, QueryResponseEncoding, QueryResponsePartType } from 'ferrum-db-client';

@route('/dbserver')
export class DbServerController extends Controller {
    @publicEndpoint()
    @post()
    public async listDatabases(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
        }>,
        res: FerrumResponse<{
            databases?: string[];
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // List databases
            res.end({ databases: await connection.connection.listDatabases(), success: true });
        } catch (e) {
            try {
                const connection = await reconnect(req.body.serverIP, req.body.serverPort);
                // List databases
                res.end({ databases: await connection.connection.listDatabases(), success: true });
            } catch (e) {
                res.end({ success: false, error: e.message });
            }
        }
    }

    @publicEndpoint()
    @post()
    @stream()
    public async runQuery(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            debugMode?: boolean;
            query: string;
            params?: string[];
        }>,
        res: FerrumResponse<{
            type: QueryResponsePartType;
            code: SuccessResponseCode;
            error?: string;
            data?: string;
            encoding: QueryResponseEncoding;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            for await (const data of connection.connection.runQuery(req.body.query, req.body.params, req.body.debugMode ?? false)) {
                res.send({ code: data.code, data: data.data, error: data.error, encoding: data.encoding, type: data.type });
            }
            res.end();
        } catch (e) {
            res.end({ type: QueryResponsePartType.FINAL, code: SuccessResponseCode.NETWORK_ERROR, error: e.message, encoding: QueryResponseEncoding.NO_DATA });
        }
    }

    @publicEndpoint()
    @post()
    public async createDatabase(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Create database
            await connection.connection.createDatabase(req.body.dbName);
            res.end({ success: true });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async hasDatabase(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Check if database exists
            res.end({ success: await connection.connection.hasDatabase(req.body.dbName) });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async deleteDatabase(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Delete database
            await connection.connection.dropDatabase(req.body.dbName);
            res.end({ success: true });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }
}
