import { getConnectionFor } from '../connect_manager.mjs';
import { get, post } from '../decorators/method.mjs';
import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { FerrumRequest, FerrumResponse } from '../framework/request.mjs';
import { servers } from '../storage.mjs';
import { Controller } from './controller.mjs';

@route('/connect')
export class ConnectionController extends Controller {
    @publicEndpoint()
    @post()
    public async addServer(
        req: FerrumRequest<{
            name: string;
            serverIP: string;
            serverPort: number;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
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
            res.end({ success: true });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async removeServer(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
        }>,
        res: FerrumResponse<{
            success: boolean;
        }>,
    ) {
        servers.update((data) => data.filter((e) => e.host !== req.body.serverIP || e.port !== req.body.serverPort));
        res.end({ success: true });
    }

    @publicEndpoint()
    @get()
    public async listServers(req: FerrumRequest, res: FerrumResponse<{ servers: { serverIP: string; serverPort: number; name: string }[] }>) {
        res.end({
            servers: Array.from(servers.get()).map((e) => ({
                name: e.name,
                serverIP: e.host,
                serverPort: e.port,
            })),
        });
    }
}
