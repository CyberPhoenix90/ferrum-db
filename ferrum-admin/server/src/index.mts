import { readFile } from 'fs/promises';
import { createServer } from 'http';
import { join } from 'path';
import { ConnectionController } from './controllers/connection_controller.mjs';
import { Request } from './framework/request.mjs';
import { Router } from './framework/router.mjs';
import { DbServerController } from './controllers/db_server_controller.mjs';

const clientPath = join(import.meta.dirname, '../../client/dist');

const controllers = [Router.fromController(new ConnectionController()), Router.fromController(new DbServerController())];

const http = createServer(async (req: Request, res) => {
    if (req.url.includes('..')) {
        res.writeHead(400);
        res.end();
        return;
    }

    let body = '';
    for await (const chunk of req) {
        body += chunk;
    }

    req.rawBody = body;
    if (req.headers['content-type'] === 'application/json') {
        try {
            req.body = JSON.parse(body);
        } catch (e) {
            res.writeHead(400);
            res.end();
            return;
        }
    }

    if (req.url.startsWith('/api')) {
        try {
            for (const controller of controllers) {
                if (await controller.route(req.url.slice(4), req, res)) {
                    return;
                }
            }
        } catch (e) {
            console.error(e);
            try {
                res.writeHead(500);
            } catch {}
            res.end();
            return;
        }
    }

    if (req.url === '/favicon.ico') {
        res.end();
        return;
    }

    if (!req.url.includes('.') && !req.url.startsWith('/api')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(await readFile(join(clientPath, 'index.html'), 'utf-8'));
    } else if (req.url.endsWith('.map')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(await readFile(join(clientPath, req.url.slice(1)), 'utf-8'));
    } else if (req.url.endsWith('.js')) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(await readFile(join(clientPath, req.url.slice(1)), 'utf-8'));
    } else if (req.url.endsWith('.css')) {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(await readFile(join(clientPath, req.url.slice(1)), 'utf-8'));
    } else {
        res.writeHead(404);
        res.end();
    }
});

http.listen(3000, () => {
    console.log('listening on 3000');
});
