import { NumberCollectionRemote } from './number_collection_remote.mjs';
import { StringCollectionRemote } from './string_collection_remote.mjs';

export class DatabaseRemote {
    public readonly databaseName: string;

    constructor(databaseName: string) {
        this.databaseName = databaseName;
    }

    public getStringCollection<T>(collectionName: string): StringCollectionRemote<T> {
        return new StringCollectionRemote(this.databaseName, collectionName);
    }

    public getNumberCollection<T>(collectionName: string): NumberCollectionRemote<T> {
        return new NumberCollectionRemote(this.databaseName, collectionName);
    }
}
