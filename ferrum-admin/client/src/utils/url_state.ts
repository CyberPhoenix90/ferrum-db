import { urlStorage } from './url_storage';

export const urlServerIP = urlStorage.bindToPropertyAsString('ip');
export const urlServerPort = urlStorage.bindToPropertyAsInteger('port');
export const urlDatabase = urlStorage.bindToPropertyAsString('db');
export const urlFocusedCollection = urlStorage.bindToPropertyAsObject<{ type: number; name: string }>('collection');
