import { IncomingMessage, ServerResponse } from 'http';
import { isPublic } from '../decorators/public.mjs';
import { getRoute } from '../decorators/route.mjs';
import { getMethodModel } from '../decorators/method.mjs';
import { Controller } from '../controllers/controller.mjs';
import { FerrumRequest, FerrumResponse } from './request.mjs';

export type APICallback = (req: FerrumRequest, res: FerrumResponse<any>) => void | Promise<void>;
export enum HTTPMethod {
    POST = 'post',
    GET = 'get',
    PUT = 'put',
    DELETE = 'delete',
}

export class Router {
    public readonly path: string;
    private routes: Map<HTTPMethod, Map<string, APICallback>> = new Map();
    private controller: Controller;

    constructor(path: string = '') {
        if (!path.startsWith('/')) {
            this.path = `/${path}`;
        }

        if (path.endsWith('/')) {
            this.path = this.path.slice(0, -1);
        }

        this.path = path;
        this.routes.set(HTTPMethod.POST, new Map());
        this.routes.set(HTTPMethod.GET, new Map());
        this.routes.set(HTTPMethod.PUT, new Map());
        this.routes.set(HTTPMethod.DELETE, new Map());
    }

    public static fromController(
        controller: Controller,
        options: {
            prependPath?: string;
            overridePath?: string;
        } = {},
    ): Router {
        let controllerRoute = options.overridePath ?? getRoute(controller.constructor as new () => Controller);
        if (!controllerRoute) {
            throw new Error(`The controller ${controller.constructor.name} must be decorated with @route.`);
        }

        if (!controllerRoute.startsWith('/')) {
            controllerRoute = `/${controllerRoute}`;
        }

        if (options.prependPath) {
            if (!options.prependPath.startsWith('/')) {
                options.prependPath = `/${options.prependPath}`;
            }
            if (options.prependPath.endsWith('/')) {
                options.prependPath = options.prependPath.slice(0, -1);
            }

            controllerRoute = `${options.prependPath}${controllerRoute}`;
        }

        const router = new Router(controllerRoute);
        //Iterate all methods of the controller
        for (const methodName of Object.getOwnPropertyNames(controller.constructor.prototype)) {
            //@ts-ignore
            const method = controller[methodName];

            if (typeof method !== 'function' || methodName === 'constructor') {
                continue;
            }

            //Get the method model
            const methodModel = getMethodModel(method);
            if (methodModel) {
                //Mount the method
                const methodRoute = methodModel.route || `/${methodName}`;
                const methodPath = `${methodRoute}`;
                //@ts-ignore
                router[methodModel.method](methodPath, method);
            }
        }

        router.controller = controller;
        return router;
    }

    public async route(path: string, req: FerrumRequest, res: ServerResponse<IncomingMessage>): Promise<boolean> {
        const method = req.method.toLowerCase() as HTTPMethod;
        const route = this.routes.get(method).get(path);
        if (!route) {
            return false;
        }
        let headersWritten = false;
        await route.call(this.controller, req, {
            writeHead: (code: number, headers: Record<string, string>) => {
                if (headersWritten) {
                    return;
                }
                headersWritten = true;
                res.writeHead(code, headers);
            },
            end: async (data: any) => {
                if (data instanceof Promise) {
                    data = await data;
                }

                if (!headersWritten) {
                    res.writeHead(200, this.determineContentType(data));
                }
                if (
                    typeof data === 'string' ||
                    data instanceof Buffer ||
                    data instanceof ArrayBuffer ||
                    typeof data === 'number' ||
                    typeof data === 'boolean'
                ) {
                    res.end(data);
                } else if (data != undefined) {
                    res.end(JSON.stringify(data));
                } else {
                    res.end();
                }
            },
            send: async (data: any) => {
                if (data instanceof Promise) {
                    data = await data;
                }

                if (!headersWritten) {
                    res.writeHead(200, this.determineContentType(data));
                }
                if (
                    typeof data === 'string' ||
                    data instanceof Buffer ||
                    data instanceof ArrayBuffer ||
                    typeof data === 'number' ||
                    typeof data === 'boolean'
                ) {
                    res.write(data);
                } else if (data != undefined) {
                    res.write(JSON.stringify(data));
                }
            },
        });
        return true;
    }

    private determineContentType(data: any): Record<string, string> {
        if (data instanceof Buffer || data instanceof ArrayBuffer) {
            return { 'Content-Type': 'application/octet-stream' };
        } else if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
            return { 'Content-Type': 'text/plain' };
        } else if (data) {
            return { 'Content-Type': 'application/json' };
        } else {
            return {};
        }
    }

    public post(path: string, apiCallback: APICallback): void {
        this.routes.get(HTTPMethod.POST).set(this.combinePath(path), this.protect(apiCallback));
    }

    public get(path: string, apiCallback: APICallback): void {
        this.routes.get(HTTPMethod.GET).set(this.combinePath(path), this.protect(apiCallback));
    }

    public put(path: string, apiCallback: APICallback): void {
        this.routes.get(HTTPMethod.PUT).set(this.combinePath(path), this.protect(apiCallback));
    }

    public delete(path: string, apiCallback: APICallback): void {
        this.routes.get(HTTPMethod.DELETE).set(this.combinePath(path), this.protect(apiCallback));
    }

    /**
     * Ensures that there are no double slashes and no missing slashes between 2 parts of a path
     */
    private combinePath(methodPath: string): string {
        if (!methodPath.startsWith('/')) {
            methodPath = `/${methodPath}`;
        }

        if (methodPath.endsWith('/')) {
            methodPath = methodPath.slice(0, -1);
        }

        return `${this.path}${methodPath}`;
    }

    private protect(apiCallback: APICallback): APICallback {
        if (!isPublic(apiCallback)) {
            return (req: FerrumRequest, res: FerrumResponse<any>) => {
                const cookie = req.headers.cookie;
                if (!cookie || !cookie.includes('token')) {
                    res.writeHead(401);
                    res.end('Unauthorized');
                    return;
                }
                return apiCallback.call(this.controller, req, res);
            };
        } else {
            return apiCallback;
        }
    }
}
