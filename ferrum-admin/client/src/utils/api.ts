import { CancellationToken, getRemoteFunction } from 'aurumjs';

export const authenticate = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
    },
    boolean
>(
    {
        id: '/api/authenticate',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listDatabases = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
    },
    string[]
>(
    {
        id: '/api/list-databases',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listIndexes = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
    },
    string[]
>(
    {
        id: '/api/list-indexes',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listSets = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
    },
    string[]
>(
    {
        id: '/api/list-sets',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listTimeSeries = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
    },
    string[]
>(
    {
        id: '/api/list-timeseries',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listIndexKeys = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
        index: string;
    },
    string[]
>(
    {
        id: '/api/list-index-keys',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listSetKeys = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
        set: string;
    },
    string[]
>(
    {
        id: '/api/list-set-keys',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const listTimeSeriesKeys = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
        timeseries: string;
    },
    string[]
>(
    {
        id: '/api/list-timeseries-keys',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);

export const getIndexValue = getRemoteFunction<
    {
        serverIP: string;
        serverPort: number;
        database: string;
        index: string;
        key: string;
    },
    any
>(
    {
        id: '/api/get-index-value',
        host: `${location.host}/ws`,
    },
    CancellationToken.forever,
);
