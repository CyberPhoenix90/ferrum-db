import { ResponseCode } from './response_code.mjs';

export class StringCollectionRemote<T> {
    public readonly database: string;
    public readonly collectionName: string;

    constructor(database: string, collectionName: string) {
        this.database = database;
        this.collectionName = collectionName;
    }

    public async get(key: string): Promise<{
        code: ResponseCode;
        data: T;
    }> {
        throw new Error('Not implemented');
    }

    public async set(key: string, value: T): Promise<ResponseCode> {
        throw new Error('Not implemented');
    }
}
