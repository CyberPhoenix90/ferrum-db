import { IncomingMessage } from 'http';

export interface FerrumRequest<T = void> extends IncomingMessage {
    rawBody: string;
    body: T;
}

export interface FerrumResponse<T> {
    send: (body: T | Promise<T>) => void;
    writeHead: (code: number, headers?: Record<string, string>) => void;
    end: (body?: T | Promise<T>) => void;
}
