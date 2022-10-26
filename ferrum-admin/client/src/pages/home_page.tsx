import { Aurum, AurumComponentAPI, DataSource, dsMap, Renderable } from 'aurumjs';
import { getIndexValue, listDatabases, listIndexes, listIndexKeys, listSetKeys, listSets, listTimeSeries, listTimeSeriesKeys } from '../utils/api';
import { urlDatabase, urlFocusedCollection, urlServerIP, urlServerPort } from '../utils/url_state';
import { JSONRenderer } from 'aurum-components';

export async function HomePage(props: {}, children: [], api: AurumComponentAPI): Promise<Renderable> {
    const viewerSource = new DataSource<any>();

    urlDatabase.listen(() => viewerSource.update({}), api.cancellationToken);
    urlFocusedCollection.listen(() => viewerSource.update({}), api.cancellationToken);

    return (
        <div>
            <h1>
                Connected to {urlServerIP}:{urlServerPort}
                {urlDatabase.transform(
                    dsMap((db) => (db ? `/${db}` : '')),
                    api.cancellationToken,
                )}
                {urlFocusedCollection.transform(
                    dsMap((focus) => (focus ? `/${collectionTypeToString(focus)}/${focus.name}` : '')),
                    api.cancellationToken,
                )}
            </h1>
            <p>Databases:</p>
            <ul>
                {(
                    await listDatabases({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                    })
                ).map((database) => (
                    <li>
                        <button
                            onClick={() => {
                                urlDatabase.updateUpstream(database);
                            }}>
                            {database}
                        </button>
                    </li>
                ))}
            </ul>
            {urlDatabase.transform(
                dsMap((db) => (db ? <DatabaseView viewerSource={viewerSource}></DatabaseView> : <></>)),
                api.cancellationToken,
            )}
            <JSONRenderer>{viewerSource}</JSONRenderer>
        </div>
    );
}

function collectionTypeToString(focus: { type: number; name: string }): string {
    switch (focus.type) {
        case 0:
            return 'index';
        case 1:
            return 'set';
        case 2:
            return 'time series';
        default:
            return 'unknown';
    }
}

async function DatabaseView(props: { viewerSource: DataSource<any> }, children: [], api: AurumComponentAPI): Promise<Renderable> {
    return (
        <div>
            Database: {urlDatabase.value}
            <br />
            Indexes:{' '}
            <ul>
                {(
                    await listIndexes({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                    })
                ).map((index) => (
                    <li>
                        <button
                            onClick={() => {
                                urlFocusedCollection.updateUpstream({
                                    name: index,
                                    type: 0,
                                });
                            }}>
                            {index}
                        </button>
                    </li>
                ))}
            </ul>
            Sets:{' '}
            <ul>
                {(
                    await listSets({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                    })
                ).map((set) => (
                    <button
                        onClick={() => {
                            urlFocusedCollection.updateUpstream({
                                name: set,
                                type: 1,
                            });
                        }}>
                        {set}
                    </button>
                ))}
            </ul>
            Time Series:{' '}
            <ul>
                {(
                    await listTimeSeries({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                    })
                ).map((timeSerie) => (
                    <button
                        onClick={() => {
                            urlFocusedCollection.updateUpstream({
                                name: timeSerie,
                                type: 2,
                            });
                        }}>
                        {timeSerie}
                    </button>
                ))}
            </ul>
            {urlFocusedCollection.transform(
                dsMap((focus) => (focus ? <CollectionView viewerSource={props.viewerSource}></CollectionView> : <></>)),
                api.cancellationToken,
            )}
        </div>
    );
}

async function CollectionView(props: { viewerSource: DataSource<any> }, children: [], api: AurumComponentAPI): Promise<Renderable> {
    return urlFocusedCollection.transform(
        dsMap((focus) => {
            switch (focus.type) {
                case 0:
                    return <IndexView viewerSource={props.viewerSource}></IndexView>;
                case 1:
                    return <SetView></SetView>;
                case 2:
                    return <TimeSeriesView></TimeSeriesView>;
                default:
                    return <></>;
            }
        }),
        api.cancellationToken,
    );
}

async function IndexView(props: { viewerSource: DataSource<any> }): Promise<Renderable> {
    return (
        <div>
            Index: {urlFocusedCollection.value.name}
            <ul>
                {(
                    await listIndexKeys({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                        index: urlFocusedCollection.value.name,
                    })
                ).map((key) => (
                    <li>
                        {key}{' '}
                        <button
                            onClick={() => {
                                getIndexValue({
                                    serverIP: urlServerIP.value,
                                    serverPort: urlServerPort.value,
                                    database: urlDatabase.value,
                                    index: urlFocusedCollection.value.name,
                                    key,
                                }).then((value) => {
                                    props.viewerSource.update(value);
                                });
                            }}>
                            View
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

async function SetView(): Promise<Renderable> {
    return (
        <div>
            Set: {urlFocusedCollection.value.name}
            <ul>
                {(
                    await listSetKeys({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                        set: urlFocusedCollection.value.name,
                    })
                ).map((key) => (
                    <li>{key}</li>
                ))}
            </ul>
        </div>
    );
}

async function TimeSeriesView(): Promise<Renderable> {
    return (
        <div>
            Time Serie: {urlFocusedCollection.value.name}
            <ul>
                {(
                    await listTimeSeriesKeys({
                        serverIP: urlServerIP.value,
                        serverPort: urlServerPort.value,
                        database: urlDatabase.value,
                        timeseries: urlFocusedCollection.value.name,
                    })
                ).map((key) => (
                    <li>{key}</li>
                ))}
            </ul>
        </div>
    );
}
