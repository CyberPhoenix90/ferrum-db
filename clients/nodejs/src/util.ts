import { ServiceError } from '@grpc/grpc-js';
import { gunzip, gzip } from 'zlib';
import { promisify as promisifyCb } from 'util';
import { deserialize, serialize, setInternalBufferSize } from 'bson';
import { EventEmitter } from 'aurumjs';

export type CallbackReturnType<T extends (...args: any[]) => any> = Parameters<Parameters<T>[3]>[1];

export type CallBack<T> = (err: ServiceError, res: T) => void;
export let bsonBufferSize = 33554432; // 32MB

// The BSON library decided that it would be smart to not support automatic buffer expansion and you can't know ahead of time how much space you need
// So the best we can do is catch range errors and resize the buffer on error
export function encodeBSON(value: any): Buffer {
    try {
        return serialize(value);
    } catch (e) {
        if (e instanceof RangeError) {
            bsonBufferSize *= 2;
            setInternalBufferSize(bsonBufferSize);
            return encodeBSON(value);
        } else {
            throw e;
        }
    }
}

export function expandBsonBuffer(newSize: number): void {
    bsonBufferSize = newSize;
}

export interface DatabaseResponseMetrics {
    latency: number;
    success: boolean;
}

export interface ObserverConfig {
    startNotifier: EventEmitter<void>;
    timeoutNotifier: EventEmitter<void>;
    responseNotifier: EventEmitter<DatabaseResponseMetrics>;
    timeout: number;
}

export function performRPC<T, M>(observerConfig: ObserverConfig, fn: (msg: M, cb: CallBack<T>) => void, msg: M): Promise<T> {
    return new Promise((resolve, reject) => {
        observerConfig.startNotifier.fire();
        const startTime = performance.now();
        let timeoutHandle: NodeJS.Timeout;
        if (observerConfig.timeout > 0) {
            timeoutHandle = setTimeout(() => {
                observerConfig.timeoutNotifier.fire();
            }, observerConfig.timeout);
        }

        fn(msg, (err, res) => {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }

            if (err) {
                observerConfig.responseNotifier.fire({ latency: performance.now() - startTime, success: false });
                reject(err);
            } else {
                observerConfig.responseNotifier.fire({ latency: performance.now() - startTime, success: true });
                resolve(res);
            }
        });
    });
}

export function promisify<T, M>(fn: (msg: M, cb: CallBack<T>) => void, msg: M): Promise<T> {
    return new Promise((resolve, reject) => {
        fn(msg, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export type SupportedEncodingTypes = 'ndjson' | 'json' | 'bson' | 'string' | 'binary' | 'float' | 'integer';
export type SupportedCompressionTypes = 'gzip' | 'none';

export const gunzipPromise = promisifyCb(gunzip);
export const gzipPromise = promisifyCb(gzip);

export async function decodeValue<T>(value: Uint8Array, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes): Promise<T> {
    let decompressed: Buffer;
    let decodedValue: any;

    switch (compression) {
        case 'gzip':
            decompressed = await gunzipPromise(value);
            break;
        default:
            decompressed = Buffer.from(value);
            break;
    }

    if (encoding === 'bson') {
        if (decompressed.length > bsonBufferSize) {
            setInternalBufferSize(decompressed.length);
            expandBsonBuffer(decompressed.length);
        }
        decodedValue = deserialize(decompressed);
    } else if (encoding === 'float') {
        decodedValue = decompressed.readDoubleBE();
    } else if (encoding === 'integer') {
        decodedValue = decompressed.readInt32BE();
    } else if (encoding === 'json') {
        try {
            decodedValue = JSON.parse(decompressed.toString('utf8'));
        } catch (e) {
            throw new Error(`Failed to decode JSON ${e?.message} Value: ${decompressed.length < 2048 ? decompressed.toString('utf8') : ''}`);
        }
    } else if (encoding === 'ndjson') {
        decodedValue = decompressed
            .toString('utf8')
            .split('\n')
            .map((e) => JSON.parse(e));
    } else if (encoding === 'string') {
        decodedValue = decompressed.toString('utf8');
    } else {
        decodedValue = decompressed;
    }

    return decodedValue;
}

export async function encodeValue(value: any, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes): Promise<Buffer> {
    let encodedData: Buffer;
    if (encoding === 'bson') {
        encodedData = encodeBSON(value);
    } else if (encoding === 'float') {
        encodedData = Buffer.alloc(8);
        encodedData.writeDoubleBE(value, 0);
    } else if (encoding === 'integer') {
        encodedData = Buffer.alloc(4);
        encodedData.writeInt32BE(value, 0);
    } else if (encoding === 'json') {
        encodedData = Buffer.from(JSON.stringify(value));
    } else if (encoding === 'ndjson') {
        if (Array.isArray(value)) {
            encodedData = Buffer.from(value.map((e) => JSON.stringify(e)).join('\n'));
        } else {
            throw new Error(`Non array data cannot be ndjson encoded`);
        }
    } else if (encoding === 'string') {
        if (typeof value !== 'string') {
            throw new Error(`Invalid input. Expected string got ${typeof value}`);
        }
        encodedData = Buffer.from(value);
    } else {
        if (value instanceof Buffer) {
            encodedData = value;
        } else {
            throw new Error(`Invalid input. Expected buffer`);
        }
    }

    switch (compression) {
        case 'gzip':
            encodedData = await gzipPromise(encodedData);
            break;
        default:
            break;
    }
    return encodedData;
}
