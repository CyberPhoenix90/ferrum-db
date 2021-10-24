import { FerrumServerClient } from "./client";
import { promisify } from "util";
import { gunzip, gzip } from "zlib";
import { ApiMessageType } from "./protcol";
import { Encoding } from "csharp-binary-stream";
import {
    bsonBufferSize,
    encodeBSON,
    expandBsonBuffer,
    getBinaryReader,
    handleErrorResponse,
} from "./utils";
import { deserialize, setInternalBufferSize } from "bson";

const gunzipPromise = promisify(gunzip);
const gzipPromise = promisify(gzip);

export type SupportedEncodingTypes =
    | "ndjson"
    | "json"
    | "bson"
    | "string"
    | "binary";

export type SupportedCompressionTypes = "gzip" | "none";

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
            try {
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
                        expandBsonBuffer(decompressed.length);
                    }
                    decodedValue = deserialize(decompressed);
                } else if (this.encoding === "json") {
                    try {
                        decodedValue = JSON.parse(
                            decompressed.toString("utf8")
                        );
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
            } catch (e) {
                throw new Error(
                    `Failed to get ${key} from ${this.indexKey} \n\nCaused by: ${e}`
                );
            }
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
