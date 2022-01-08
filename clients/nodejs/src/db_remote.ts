import { Encoding } from 'csharp-binary-stream';
import { FerrumServerClient } from './client';
import { IndexRemote, SupportedCompressionTypes, SupportedEncodingTypes } from './index_remote';
import { ApiMessageType } from './protcol';
import { SetRemote } from './set_remote';
import { getBinaryReader, handleErrorResponse } from './utils';

export class FerrumDBRemote {
    private client: FerrumServerClient;
    private dbName: string;

    constructor(client: FerrumServerClient, dbName: string) {
        this.client = client;
        this.dbName = dbName;
    }

    public async createIndexIfNotExist<T>(
        index: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<IndexRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_INDEX_IF_NOT_EXIST, this.dbName.length + index.length);
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
            return this.getIndex(index, encoding, compression);
        }
    }

    public getIndex<T>(index: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): IndexRemote<T> {
        return new IndexRemote<T>(this.client, this.dbName, index, encoding, compression);
    }

    public async deleteIndex(index: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DELETE_INDEX, index.length);
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

    public async createIndex<T>(index: string, pageFileSize: number = 0): Promise<IndexRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_INDEX, index.length);
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
            return this.getIndex(index);
        }
    }

    public async hasIndex(index: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_INDEX, index.length);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.GET_INDEXES, 0);
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

    public async createSetfNotExist(set: string): Promise<SetRemote> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_SET_IF_NOT_EXIST, this.dbName.length + set.length);
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(set, Encoding.Utf8);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return this.getSet(set);
        }
    }

    public getSet(set: string): SetRemote {
        return new SetRemote(this.client, this.dbName, set);
    }

    public async deleteSet(set: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DELETE_SET, set.length);
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(set, Encoding.Utf8);

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

    public async createSet(set: string): Promise<SetRemote> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_SET, set.length);
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(set, Encoding.Utf8);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return this.getSet(set);
        }
    }

    public async hasSet(set: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_SET, set.length);
        bw.writeString(this.dbName, Encoding.Utf8);
        bw.writeString(set, Encoding.Utf8);
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

    public async getSets(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.GET_SETS, 0);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.COMPACT, 0);
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
