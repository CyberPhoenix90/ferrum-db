import { Encoding } from 'csharp-binary-stream';
import { FerrumServerClient } from './client';
import { IndexRemote } from './index_remote';
import { ApiMessageType } from './protcol';
import { SetRemote } from './set_remote';
import { TimeSeriesRemote } from './time_series_remote';
import { getBinaryReader, handleErrorResponse, SupportedCompressionTypes, SupportedEncodingTypes } from './utils';

export class FerrumDBRemote {
    private client: FerrumServerClient;
    public readonly name: string;

    constructor(client: FerrumServerClient, dbName: string) {
        this.client = client;
        this.name = dbName;
    }

    public async createIndexIfNotExist<T>(
        index: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<IndexRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_INDEX_IF_NOT_EXIST, this.name.length + index.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        return new IndexRemote<T>(this.client, this.name, index, encoding, compression);
    }

    public async deleteIndex(index: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DELETE_INDEX, index.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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

    public async createIndex<T>(
        index: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<IndexRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_INDEX, index.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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

    public async hasIndex(index: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_INDEX, index.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.GET_INDEXES, this.name.length + 4);
        bw.writeString(this.name, Encoding.Utf8);
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

    public async createSetIfNotExist(set: string): Promise<SetRemote> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_SET_IF_NOT_EXIST, this.name.length + set.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        return new SetRemote(this.client, this.name, set);
    }

    public async deleteSet(set: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DELETE_SET, set.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_SET, set.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_SET, set.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.GET_SETS, this.name.length + 4);
        bw.writeString(this.name, Encoding.Utf8);
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

    public async createTimeSeriesIfNotExist<T>(
        name: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<TimeSeriesRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST, this.name.length + name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
        bw.writeString(name, Encoding.Utf8);
        bw.writeUnsignedInt(pageFileSize);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return this.getTimeSeries(name, encoding, compression);
        }
    }

    public getTimeSeries<T>(name: string, encoding: SupportedEncodingTypes = 'bson', compression: SupportedCompressionTypes = 'gzip'): TimeSeriesRemote<T> {
        return new TimeSeriesRemote<T>(this.client, this.name, name, encoding, compression);
    }

    public async deleteTimeSeries(name: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.DELETE_TIME_SERIES, name.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
        bw.writeString(name, Encoding.Utf8);

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

    public async createTimeSeries<T>(
        name: string,
        encoding: SupportedEncodingTypes = 'bson',
        compression: SupportedCompressionTypes = 'gzip',
        pageFileSize: number = 0,
    ): Promise<TimeSeriesRemote<T>> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.CREATE_TIME_SERIES, name.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
        bw.writeString(name, Encoding.Utf8);
        bw.writeUnsignedInt(pageFileSize);

        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            return this.getTimeSeries(name, encoding, compression);
        }
    }

    public async hasTimeSeries(name: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.HAS_TIME_SERIES, name.length + this.name.length + 8);
        bw.writeString(this.name, Encoding.Utf8);
        bw.writeString(name, Encoding.Utf8);
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

    public async getListOfTimeSeries(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.GET_TIME_SERIES, this.name.length + 4);
        bw.writeString(this.name, Encoding.Utf8);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.COMPACT, this.name.length + 4);
        bw.writeString(this.name, Encoding.Utf8);
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
