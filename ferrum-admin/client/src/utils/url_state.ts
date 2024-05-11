import { CancellationToken, urlStorageStream } from 'aurumjs';

export const urlServerIP = urlStorageStream.listenAsString('ip', undefined, CancellationToken.forever);
export const urlServerPort = urlStorageStream.listenAsNumber('port', undefined, CancellationToken.forever);
export const urlDatabase = urlStorageStream.listenAsString('db', undefined, CancellationToken.forever);
export const urlFocusedCollection = urlStorageStream.listenAsObject<{ type: number; name: string }>('collection', undefined, CancellationToken.forever);
