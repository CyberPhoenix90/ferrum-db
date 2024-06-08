import { PersistentJSON } from './persistent_json.mjs';

export interface Server {
    name: string;
    host: string;
    port: number;
}

export const servers = new PersistentJSON<Server[]>('servers.json', []);
