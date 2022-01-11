import { Encoding } from 'csharp-binary-stream';
import { FerrumServerClient } from './client';
import { ApiMessageType } from './protcol';
import {
    encodeData,
    getBinaryReader,
    handleErrorResponse,
    readEncodedData,
    readEncodedDataArray,
    SupportedCompressionTypes,
    SupportedEncodingTypes,
} from './utils';

export class TimeSeriesRemote<T> {
    private client: FerrumServerClient;
    private timeSeriesKey: string;
    private encoding: SupportedEncodingTypes;
    private compression: SupportedCompressionTypes;
    private database: string;

    constructor(client: FerrumServerClient, database: string, timeSeriesKey: string, encoding: SupportedEncodingTypes, compression: SupportedCompressionTypes) {
        this.client = client;
        this.database = database;
        this.encoding = encoding;
        this.compression = compression;
        this.timeSeriesKey = timeSeriesKey;
    }

    public async hasSerie(serie: string): Promise<boolean> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.TIME_SERIES_HAS_SERIE, this.database.length + this.timeSeriesKey.length + serie.length);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
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

    public async getEntry(serie: string, timestamp: number): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_ENTRY,
            this.database.length + this.timeSeriesKey.length + 8 + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(timestamp);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getNearestEntryToTimestamp(serie: string, timestamp: number): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP,
            this.database.length + this.timeSeriesKey.length + 8 + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(timestamp);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }
    public async getFirstEntryBeforeTimestamp(serie: string, timestamp: number): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP,
            this.database.length + this.timeSeriesKey.length + 8 + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(timestamp);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getFirstEntryAfterTimestamp(serie: string, timestamp: number): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP,
            this.database.length + this.timeSeriesKey.length + 8 + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(timestamp);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getLastEntry(serie: string): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_LATEST_ENTRY,
            this.database.length + this.timeSeriesKey.length + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getFirstEntry(serie: string): Promise<T> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_EARLIEST_ENTRY,
            this.database.length + this.timeSeriesKey.length + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedData(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getLastNEntries(serie: string, count: number): Promise<T[]> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_LAST_N_ENTRIES,
            this.database.length + this.timeSeriesKey.length + serie.length + 4,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeInt(count);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedDataArray(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async getEntriesBetween(serie: string, start: number, end: number): Promise<T[]> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS,
            this.database.length + this.timeSeriesKey.length + 16 + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(start);
        bw.writeLong(end);
        this.client.sendMsg(bw);

        const response = await this.client.getResponse(myId);

        const br = getBinaryReader(response);
        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        } else {
            try {
                return readEncodedDataArray(br, this.encoding, this.compression);
            } catch (e) {
                throw new Error(`Failed to get ${serie} from ${this.timeSeriesKey} \n\nCaused by: ${e}`);
            }
        }
    }

    public async deleteSerie(serie: string): Promise<void> {
        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_DELETE_SERIE,
            this.database.length + this.timeSeriesKey.length + serie.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
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

    // Alias for set
    public put(serie: string, timestamp: number, value: T): Promise<void> {
        return this.set(serie, timestamp, value);
    }

    public async set(serie: string, timestamp: number, value: T): Promise<void> {
        let encodedData: Buffer = await encodeData(value, this.encoding, this.compression);

        const { bw, myId } = this.client.getSendWriter(
            ApiMessageType.TIME_SERIES_PUT_ENTRY,
            this.database.length + this.timeSeriesKey.length + serie.length + 8 + encodedData.length,
        );
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
        bw.writeString(serie, Encoding.Utf8);
        bw.writeLong(timestamp);
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
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.TIME_SERIES_CLEAR, this.database.length + this.timeSeriesKey.length);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
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

    public async getSeries(): Promise<string[]> {
        const { bw, myId } = this.client.getSendWriter(ApiMessageType.TIME_SERIES_GET_SERIES, this.database.length + this.timeSeriesKey.length);
        bw.writeString(this.database, Encoding.Utf8);
        bw.writeString(this.timeSeriesKey, Encoding.Utf8);
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
