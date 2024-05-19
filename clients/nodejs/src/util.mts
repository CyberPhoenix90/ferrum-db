import { ServiceError } from '@grpc/grpc-js';
import { deserialize, serialize, setInternalBufferSize } from 'bson';

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

export async function decodeValue<T>(value: Uint8Array, encoding: SupportedEncodingTypes): Promise<T> {
    let decodedValue: any;
    const buffer = Buffer.from(value);

    if (encoding === 'bson') {
        if (buffer.length > bsonBufferSize) {
            setInternalBufferSize(buffer.length);
            expandBsonBuffer(buffer.length);
        }
        decodedValue = deserialize(buffer);
    } else if (encoding === 'float') {
        decodedValue = buffer.readDoubleBE();
    } else if (encoding === 'integer') {
        decodedValue = buffer.readInt32BE();
    } else if (encoding === 'json') {
        try {
            decodedValue = JSON.parse(buffer.toString('utf8'));
        } catch (e) {
            throw new Error(`Failed to decode JSON ${e?.message} Value: ${buffer.length < 2048 ? buffer.toString('utf8') : ''}`);
        }
    } else if (encoding === 'ndjson') {
        decodedValue = buffer
            .toString('utf8')
            .split('\n')
            .map((e) => JSON.parse(e));
    } else if (encoding === 'string') {
        decodedValue = buffer.toString('utf8');
    } else {
        decodedValue = buffer;
    }

    return decodedValue;
}

export async function encodeValue(value: any, encoding: SupportedEncodingTypes): Promise<Buffer> {
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

    return encodedData;
}
