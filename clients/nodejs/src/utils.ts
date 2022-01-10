import { deserialize, serialize, setInternalBufferSize } from 'bson';
import { BinaryReader, Encoding } from 'csharp-binary-stream';
import { SupportedCompressionTypes, SupportedEncodingTypes } from '.';
import { promisify } from 'util';
import { gunzip, gzip } from 'zlib';

export let bsonBufferSize = 17825792; // 128MB
const gunzipPromise = promisify(gunzip);
const gzipPromise = promisify(gzip);

export function getBinaryReader(buffer: Buffer): BinaryReader {
    //Hack to skip the constructor of BinaryReader because it does unecessairy and expensive copying
    const br = new BinaryReader(Buffer.from([]));

    //@ts-ignore
    br._stream = buffer.buffer;
    //@ts-ignore
    br._view = buffer;
    //@ts-ignore
    br._bufferStart = buffer.byteOffset;
    //@ts-ignore
    br._bufferLength = buffer.byteLength;

    return br;
}

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

export function handleErrorResponse(br: BinaryReader): never {
    throw new Error(`[Ferrum DB Server]${br.readString(Encoding.Utf8)}`);
}

export async function readEncodedDataArray(br: BinaryReader, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes): Promise<any[]> {
    const count = br.readInt();
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(await readEncodedData(br, encoding, compression));
    }

    return result;
}

export async function readEncodedData(br: BinaryReader, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes): Promise<any> {
    const len = br.readInt();
    const result = Buffer.from(br.readBytes(len));
    let decompressed: Buffer;
    let decodedValue: any;

    switch (compression) {
        case 'gzip':
            decompressed = await gunzipPromise(result);
            break;
        default:
            decompressed = result;
            break;
    }

    if (encoding === 'bson') {
        if (decompressed.length > bsonBufferSize) {
            setInternalBufferSize(decompressed.length);
            expandBsonBuffer(decompressed.length);
        }
        decodedValue = deserialize(decompressed);
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

export async function encodeData(value: any, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes): Promise<Buffer> {
    let encodedData: Buffer;
    if (encoding === 'bson') {
        encodedData = encodeBSON(value);
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
