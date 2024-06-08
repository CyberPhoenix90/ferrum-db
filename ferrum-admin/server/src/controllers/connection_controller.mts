import { ServerResponse } from 'http';
import { getConnectionFor } from '../connect_manager.mjs';
import { get, post } from '../decorators/method.mjs';
import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { Request } from '../framework/request.mjs';
import { servers } from '../storage.mjs';
import { Controller } from './controller.mjs';

@route('/connect')
export class ConnectionController extends Controller {
    @publicEndpoint()
    @post<
        {
            name: string;
            serverIP: string;
            serverPort: number;
        },
        {
            success: boolean;
            error?: string;
        }
    >()
    public async addServer(req: Request, res: ServerResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            await getConnectionFor(req.body.serverIP, req.body.serverPort);
            servers.update((data) => {
                data.push({
                    host: req.body.serverIP,
                    name: req.body.name,
                    port: req.body.serverPort,
                });

                return data;
            });
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
        },
        {
            success: boolean;
        }
    >()
    public async removeServer(req: Request, res: ServerResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        servers.update((data) => data.filter((e) => e.host !== req.body.serverIP || e.port !== req.body.serverPort));
        res.end(JSON.stringify({ success: true }));
    }

    @publicEndpoint()
    @get<{ servers: { serverIP: string; serverPort: number; name: string }[] }>()
    public async listServers(req: Request, res: ServerResponse) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                servers: Array.from(servers.get()).map((e) => ({
                    name: e.name,
                    serverIP: e.host,
                    serverPort: e.port,
                })),
            }),
        );
    }
}
