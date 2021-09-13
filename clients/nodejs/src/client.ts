import { Socket } from "net";
import { BinaryReader, BinaryWriter, Encoding } from "csharp-binary-stream";
import { gzip, gunzip } from "zlib";
import { promisify } from "util";
import { serialize, deserialize, setInternalBufferSize } from "bson";

const gunzipPromise = promisify(gunzip);
const gzipPromise = promisify(gzip);

export type SupportedEncodingTypes =
    | "ndjson"
    | "json"
    | "bson"
    | "string"
    | "binary";
export type SupportedCompressionTypes = "gzip" | "none";

let bsonBufferSize = 17825792;
const MAX_BUFFER_SIZE = 128 * 1024 * 1024;

enum ApiMessageType {
    CREATE_DATABASE = 0,
    CREATE_DATABASE_IF_NOT_EXIST = 1,
    HAS_DATABASE = 2,
    DROP_DATABASE = 3,
    LIST_DATABASES = 4,
    CLEAR_DATABASE = 5,
    CREATE_INDEX = 6,
    CREATE_INDEX_IF_NOT_EXIST = 7,
    DELETE_INDEX = 8,
    HAS_INDEX = 9,
    GET_INDEXES = 10,
    COMPACT = 11,
    INDEX_HAS = 12,
    INDEX_GET = 13,
    INDEX_SET = 14,
    INDEX_DELETE = 15,
    INDEX_GET_KEYS = 16,
    INDEX_CLEAR = 17,
    INDEX_GET_RECORD_COUNT = 18,
    INDEX_GET_RECORD_SIZE = 19,
    INDEX_READ_CHUNK = 20,
    INDEX_READ_UNTIL = 21,
    INDEX_OPEN_WRITE_STREAM = 22,
    INDEX_CLOSE_WRITE_STREAM = 23,
    INDEX_WRITE_STREAM_WRITE_CHUNK = 24,
    HEARTBEAT = 25,
}

export function ferrumConnect(
    ip: string,
    port: number
): Promise<FerrumServerConnection> {
    return new Promise((resolve, reject) => {
        const socket = new Socket();
        socket.setNoDelay(true);
        socket.connect(port, ip);
        let client: FerrumServerClient;

        socket.once("connect", () => {
            client = new FerrumServerClient(socket);
            resolve(new FerrumServerConnection(client));
        });
        socket.once("error", (e) => {
            console.error(e);
            reject(e);
        });

        socket.once("timeout", () => {
            console.error("Connection timeout");
            reject(new Error("Connection timeout"));
        });
    });
}

class FerrumServerClient {
    protected id: number = 0;
    public socket: Socket;
    protected pending: Map<number, (buffer: Buffer) => void>;
    private writeBuffer: Buffer;
    private lengthBuffer: Buffer;
    private heartBeatPending: boolean = false;
    public disposed: boolean;
    private lastResponse: number = Date.now();
    private heartBeatInterval: NodeJS.Timeout;

    constructor(socket: Socket) {
        this.initialize(socket);
        this.heartBeatInterval = setInterval(() => {
            this.heartbeat();
        }, 2000);
    }

    private initialize(socket: Socket) {
        this.socket = socket;
        this.writeBuffer = Buffer.alloc(8192);
        this.lengthBuffer = Buffer.alloc(4);
        this.socket = socket;
        this.pending = new Map();
        this.disposed = false;
        let msgBuffer = Buffer.alloc(1048576);
        let reading = false;
        let msgSize = 0;
        let msgRemaining = 0;
        let writeOffset = 0;
        let readOffset = 0;

        socket.on("close", () => {
            if (!this.disposed) {
                this.reconnect();
            }
        });

        this.socket.on("data", (data: Buffer) => {
            this.lastResponse = Date.now();
            while (readOffset < data.length) {
                if (reading === false) {
                    msgSize = msgRemaining = data.readInt32LE(readOffset);
                    readOffset += 4;
                    reading = true;
                    writeOffset = 0;
                } else {
                    const toRead = Math.min(
                        data.length - readOffset,
                        msgRemaining
                    );
                    if (toRead + writeOffset > msgBuffer.length) {
                        msgBuffer = this.expandBuffer(
                            msgBuffer,
                            MAX_BUFFER_SIZE
                        );
                    }
                    data.copy(
                        msgBuffer,
                        writeOffset,
                        readOffset,
                        readOffset + toRead
                    );
                    msgRemaining -= toRead;
                    writeOffset += toRead;
                    readOffset += toRead;
                }

                if (msgRemaining < 0) {
                    throw new Error("Illegal state");
                }

                if (readOffset > data.length) {
                    throw new Error("Illegal state");
                }

                if (reading && msgRemaining === 0) {
                    reading = false;
                    writeOffset = 0;
                    const id = msgBuffer.readUInt32LE();
                    if (this.pending.has(id)) {
                        this.pending.get(id)(msgBuffer.slice(4, msgSize));
                        this.pending.delete(id);
                    }
                }
            }
            readOffset = 0;
        });
    }

    public reconnect(): void {
        this.disposed = false;
        this.heartBeatPending = false;
        if (!this.heartBeatInterval) {
            this.heartBeatInterval = setInterval(() => {
                this.heartbeat();
            }, 2000);
        }
        this.socket.connect(this.socket.remotePort, this.socket.remoteAddress);
        for (const pendingId of this.pending.keys()) {
            const pending = this.pending.get(pendingId);
            const error = new BinaryWriter();
            error.writeBoolean(false);
            error.writeString("Connection lost", Encoding.Utf8);
            pending(Buffer.from(error.toUint8Array()));
        }
    }

    public disconnect(): void {
        clearInterval(this.heartBeatInterval);
        this.heartBeatInterval = undefined;
        this.disposed = true;
        this.socket.destroy();
    }

    public async heartbeat(): Promise<void> {
        if (Date.now() - this.lastResponse > 6000) {
            this.socket.destroy();
            return;
        }

        if (this.heartBeatPending) {
            return;
        }
        this.heartBeatPending = true;

        const { bw, myId } = this.getSendWriter(ApiMessageType.HEARTBEAT, 0);
        this.sendMsg(bw);

        const response = await this.getResponse(myId);
        this.heartBeatPending = false;
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        }
    }

    private expandBuffer(buffer: Buffer, maxSize: number): Buffer {
        if (buffer.length * 2 < maxSize) {
            const newBuffer = Buffer.alloc(buffer.length * 2);
            buffer.copy(newBuffer);
            return newBuffer;
        } else {
            throw new Error("Buffer overflow");
        }
    }

    public getSendWriter(
        messageType: ApiMessageType,
        payloadSize: number
    ): { bw: BinaryWriter; myId: number } {
        while (payloadSize > this.writeBuffer.length) {
            this.writeBuffer = this.expandBuffer(
                this.writeBuffer,
                MAX_BUFFER_SIZE
            );
        }

        const buffer = this.writeBuffer;

        //Hack to skip the constructor of BinaryWriter because it does unecessairy and expensive copying
        const bw = new BinaryWriter();
        //@ts-ignore
        bw._buffer = buffer;
        //@ts-ignore
        bw._length = buffer.length;
        //@ts-ignore
        bw._position = 0;

        const myId = this.id++;
        bw.writeInt(messageType);
        bw.writeUnsignedInt(myId);
        return { bw, myId };
    }

    public sendMsg(bw: BinaryWriter): void {
        this.lengthBuffer.writeInt32LE(bw.position);
        this.socket.write(this.lengthBuffer);
        //@ts-ignore
        this.socket.write(bw._buffer.slice(0, bw.position));
    }

    public getResponse(myId: number): Promise<Buffer> {
        return new Promise((resolve) => {
            this.pending.set(myId, (buffer) => {
                resolve(buffer);
            });
        });
    }
}

export class FerrumServerConnection {
    private client: FerrumServerClient;

    constructor(client: FerrumServerClient) {
        this.client = client;
    }

    public disconnect(): void {
        this.client.disconnect();
    }

    public async createDatabaseIfNotExists(
        dbName: string
    ): Promise<FerrumDBRemote> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST,
            dbName.length
        );
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return new FerrumDBRemote(this.client, dbName);
        }
    }

    public async createDatabase(dbName: string): Promise<FerrumDBRemote> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.CREATE_DATABASE,
            dbName.length
        );
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return new FerrumDBRemote(this.client, dbName);
        }
    }

    public async hasDatabase(dbName: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.HAS_DATABASE,
            dbName.length
        );
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return br.readBoolean();
        }
    }

    public async dropDatabase(dbName: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.DROP_DATABASE,
            dbName.length
        );
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async clearDatabase(dbName: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.CLEAR_DATABASE,
            dbName.length
        );
        bw.writeString(dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        }
        return undefined;
    }

    public async getDatabaseNames(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.LIST_DATABASES,
            0
        );
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            const result = new Array(len);
            for (let i = 0; i < len; i++) {
                result[i] = br.readString(Encoding.Utf8);
            }
            return result;
        }
    }

    public getDatabase(dbName: string): FerrumDBRemote {
        return new FerrumDBRemote(this.client, dbName);
    }
}

export class FerrumDBRemote {
    private client: FerrumServerClient;
    private dbName: string;

    constructor(client: FerrumServerClient, dbName: string) {
        this.client = client;
        this.dbName = dbName;
    }

    public async createIndexIfNotExist(
        index: string,
        pageFileSize: number = 0
    ): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.CREATE_INDEX_IF_NOT_EXIST,
            this.dbName.length + index.length
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(index, Encoding.Utf8);
        bw.writeUnsignedInt(pageFileSize);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public getIndex<T>(
        index: string,
        encoding: SupportedEncodingTypes = "bson",
        compression: SupportedCompressionTypes = "gzip"
    ): IndexRemote<T> {
        return new IndexRemote<T>(
            this.client,
            this.dbName,
            index,
            encoding,
            compression
        );
    }

    public async deleteIndex(index: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.DELETE_INDEX,
            index.length
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(index, Encoding.Utf8);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async createIndex(
        index: string,
        pageFileSize: number = 0
    ): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.CREATE_INDEX,
            index.length
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(index, Encoding.Utf8);
        bw.writeUnsignedInt(pageFileSize);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async hasIndex(index: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.HAS_INDEX,
            index.length
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(index, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return br.readBoolean();
        }
    }

    public async getIndexes(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.GET_INDEXES,
            0
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            const result = new Array(len);
            for (let i = 0; i < len; i++) {
                result[i] = br.readString(Encoding.Utf8);
            }
            return result;
        }
    }

    public async compact(): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.COMPACT,
            0
        );
        bw.writeString(this.dbName, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }
}

export class IndexRemote<T> {
    private client: FerrumServerClient;
    private indexKey: string;
    private encoding: SupportedEncodingTypes;
    private compression: SupportedCompressionTypes;
    private database: string;

    constructor(
        client: FerrumServerClient,
        database: string,
        indexKey: string,
        encoding: SupportedEncodingTypes,
        compression: SupportedCompressionTypes
    ) {
        this.client = client;
        this.database = database;
        this.encoding = encoding;
        this.compression = compression;
        this.indexKey = indexKey;
    }

    public async has(key: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_HAS,
            this.database.length + this.indexKey.length + key.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return br.readBoolean();
        }
    }

    public async getRecordSize(key: string): Promise<number> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_GET_RECORD_SIZE,
            this.database.length + this.indexKey.length + key.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readLong();
            return len;
        }
    }

    public async getRecordCount(): Promise<number> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_GET_RECORD_COUNT,
            this.database.length + this.indexKey.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            return len;
        }
    }

    public async get(key: string): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_GET,
            this.database.length + this.indexKey.length + key.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            console.log(`Fetched ${len} bytes from DB`);
            const result = Buffer.from(br.readBytes(len));
            let decompressed: Buffer;
            let decodedValue: any;

            switch (this.compression) {
                case "gzip":
                    decompressed = await gunzipPromise(result);
                    break;
                default:
                    decompressed = result;
                    break;
            }

            if (this.encoding === "bson") {
                if (decompressed.length > bsonBufferSize) {
                    setInternalBufferSize(decompressed.length);
                    bsonBufferSize = decompressed.length;
                }
                decodedValue = deserialize(decompressed);
            } else if (this.encoding === "json") {
                try {
                    decodedValue = JSON.parse(decompressed.toString("utf8"));
                } catch (e) {
                    throw new Error(
                        `Failed to decode JSON for key ${key}. ${decompressed.toString(
                            "utf8"
                        )}`
                    );
                }
            } else if (this.encoding === "ndjson") {
                decodedValue = decompressed
                    .toString("utf8")
                    .split("\n")
                    .map((e) => JSON.parse(e));
            } else if (this.encoding === "string") {
                decodedValue = decompressed.toString("utf8");
            } else {
                decodedValue = decompressed;
            }

            return decodedValue;
        }
    }

    public async readChunk(
        key: string,
        offset: number,
        size: number
    ): Promise<Buffer> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_GET,
            this.database.length + this.indexKey.length + key.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
        bw.writeLong(offset);
        bw.writeUnsignedInt(size);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            const result = Buffer.from(br.readBytes(len));
            return result;
        }
    }

    // Alias for set
    public put(key: string, value: T): Promise<void> {
        return this.set(key, value);
    }

    public async set(key: string, value: T): Promise<void> {
        let encodedData: Buffer;
        if (this.encoding === "bson") {
            encodedData = encodeBSON(value);
        } else if (this.encoding === "json") {
            encodedData = Buffer.from(JSON.stringify(value));
        } else if (this.encoding === "ndjson") {
            if (Array.isArray(value)) {
                encodedData = Buffer.from(
                    value.map((e) => JSON.stringify(e)).join("\n")
                );
            } else {
                throw new Error(`Non array data cannot be ndjson encoded`);
            }
        } else if (this.encoding === "string") {
            if (typeof value !== "string") {
                throw new Error(
                    `Invalid input. Expected string got ${typeof value}`
                );
            }
            encodedData = Buffer.from(value);
        } else {
            if (value instanceof Buffer) {
                encodedData = value;
            } else {
                throw new Error(`Invalid input. Expected buffer`);
            }
        }

        switch (this.compression) {
            case "gzip":
                encodedData = await gzipPromise(encodedData);
                break;
            default:
                break;
        }

        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_SET,
            this.database.length +
                this.indexKey.length +
                key.length +
                encodedData.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
        bw.writeInt(encodedData.length);
        for (const byte of encodedData) {
            bw.writeByte(byte);
        }
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async clear(): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_CLEAR,
            this.database.length + this.indexKey.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }

    public async getKeys(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.INDEX_GET_KEYS,
            this.database.length + this.indexKey.length
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.indexKey, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            const result = new Array(len);
            for (let i = 0; i < len; i++) {
                result[i] = br.readString(Encoding.Utf8);
            }
            return result;
        }
    }
}

function handleErrorResponse(br: BinaryReader): never {
    throw new Error(`[Ferrum DB Server]${br.readString(Encoding.Utf8)}`);
}

function getBinaryReader(buffer: Buffer): BinaryReader {
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
function encodeBSON(value: any): Buffer {
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
