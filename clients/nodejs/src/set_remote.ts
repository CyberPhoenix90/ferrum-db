import { Encoding } from 'csharp-binary-stream';
import { FerrumServerClient } from './client';
import { CollectionRemote, CollectionType } from './collection_remote';
import { ApiMessageType } from './protcol';
import { getBinaryReader, handleErrorResponse } from './utils';

export class SetRemote extends CollectionRemote {
    constructor(client: FerrumServerClient, database: string, setKey: string) {
        super(CollectionType.SET, client, database, setKey);
    }

    public async has(key: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_HAS, this.database.length + this.collectionKey.length + key.length + 12);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
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

    public async getRecordCount(): Promise<number> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_GET_RECORD_COUNT, this.database.length + this.collectionKey.length + 8);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readByte();
        if (success !== 1) {
            return handleErrorResponse(br);
        } else {
            const len = br.readInt();
            return len;
        }
    }

    // Alias for add
    public put(key: string): Promise<void> {
        return this.add(key);
    }

    public async add(key: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_ADD, this.database.length + this.collectionKey.length + key.length + 12);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
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

    public async clear(): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_CLEAR, this.database.length + this.collectionKey.length + 8);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
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

    public async delete(key: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_DELETE, this.database.length + this.collectionKey.length + key.length + 12);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
        bw.writeString(key, Encoding.Utf8);
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

    public async getKeys(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.SET_GET_KEYS, this.database.length + this.collectionKey.length + 8);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.collectionKey, Encoding.Utf8);
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
}
