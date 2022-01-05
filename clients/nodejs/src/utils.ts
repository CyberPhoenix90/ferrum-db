import { serialize, setInternalBufferSize } from "bson";
import { BinaryReader, Encoding } from "csharp-binary-stream";

export let bsonBufferSize = 17825792; // 128MB

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
