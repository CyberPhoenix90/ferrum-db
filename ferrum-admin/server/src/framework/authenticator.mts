import { IncomingHttpHeaders } from 'http';

export class Authenticator {
    public static isLoggedIn(req: IncomingHttpHeaders): Promise<boolean> {
        return Promise.resolve(req.cookie?.includes('token'));
    }

    public static login(req: IncomingHttpHeaders): Promise<boolean> {
        return Promise.resolve(req.cookie?.includes('token'));
    }
}
