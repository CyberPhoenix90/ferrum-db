import { IncomingMessage } from 'http';

export interface Request extends IncomingMessage {
    rawBody: string;
    body: any;
}
