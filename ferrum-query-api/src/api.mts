import { DatabaseRemote } from './database_remote.mjs';

class API {
    public getDatabase(databaseName: string): DatabaseRemote {
        return new DatabaseRemote(databaseName);
    }
}

export const api = new API();
