import { Encoding } from 'csharp-binary-stream';
import { FerrumServerClient } from './client';
import { ApiMessageType } from './protcol';
import { encodeData, getBinaryReader, handleErrorResponse, readEncodedData, SupportedCompressionTypes, SupportedEncodingTypes } from './utils';

export enum CollectionType {
    INDEX = 0,
    SET = 1,
    TIME_SERIES = 2,
}

export class CollectionRemote {
    public readonly type: CollectionType;
    public readonly database: string;
    public get name(): string {
        return this.collectionKey;
    }
    protected client: FerrumServerClient;
    protected collectionKey: string;

    constructor(type: CollectionType, client: FerrumServerClient, database: string, collectionkey: string) {
        this.type = type;
        this.client = client;
        this.database = database;
        this.collectionKey = collectionkey;
    }

    public async hasTag(tag: string = ''): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.COLLECTION_HAS_TAG,
            this.database.length + this.collectionKey.length + 1 + tag.length + 12,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeByte(this.type);
        bw.writeString(tag, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return br.readBoolean();
        }
    }

    public async getTagEntry<T>(tag: string = '', encoding: SupportedEncodingTypes = 'json', compression: SupportedCompressionTypes = 'gzip'): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.COLLECTION_GET_TAG_ENTRY,
            this.database.length + this.collectionKey.length + 1 + tag.length + 12,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeByte(this.type);
        bw.writeString(tag, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, encoding, compression);
            } catch (e) {
                throw new Error(`Failed to get tag ${tag} from ${this.collectionKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async deleteTag(tag: string = ''): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.COLLECTION_DELETE_TAG,
            this.database.length + this.collectionKey.length + 1 + tag.length + 12,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeByte(this.type);
        bw.writeString(tag, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return;
        }
    }

    public async getTags(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.COLLECTION_GET_TAGS, this.database.length + this.collectionKey.length + 1 + 8);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeByte(this.type);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
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

    public async setTag(key: string, value: any, encoding: SupportedEncodingTypes = 'json', compression: SupportedCompressionTypes = 'gzip'): Promise<void> {
        const encodedData = await encodeData(value, encoding, compression);

        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.COLLECTION_SET_TAG,
            this.database.length + this.collectionKey.length + key.length + encodedData.length + 16,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeByte(this.type);
        bw.writeString(key, Encoding.Utf8);
        bw.writeInt(encodedData.length);
        bw.writeBytes(encodedData as any);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            return undefined;
        }
    }
}
