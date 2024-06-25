import { TreeEntry, TreeViewComponent, spawnContextMenu } from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable, getValueOf } from 'aurumjs';
import { ConnectionClient } from '../../endpoints/connection_client.js';
import { DbClient } from '../../endpoints/db_client.js';
import { DbServerClient } from '../../endpoints/db_server_client.js';
import { ServerModel } from '../../models/server.js';
import { AddDatabaseModal, DatabaseModel } from '../modals/add_database_modal.js';
import { AddServerModal } from '../modals/add_server_modal.js';
import { AlertModal } from '../modals/alert_modal.js';
import { ConfirmModal } from '../modals/confirm_modal.js';
import { CreateCollectionModal } from '../modals/create_collection_modal.js';
import { FerrumAdminDocument } from './document_explorer.js';
import { QueryEditor } from './query_editor.js';

interface TreeEntryTag {
    type: NodeType;
    server?: ServerModel;
    database?: string;
}

enum NodeType {
    SERVERS,
    SERVER,
    DATABASE,
    COLLECTION,
}

interface DatabaseExplorerProps {
    dialogs: ArrayDataSource<Renderable>;
    contextMenu: DataSource<Renderable>;
    openDocuments: ArrayDataSource<FerrumAdminDocument>;
}

export async function DatabaseExplorer(props: DatabaseExplorerProps): Promise<Renderable> {
    const { dialogs, contextMenu } = props;
    const { servers } = await ConnectionClient.listServers();
    const serverEntries = new ArrayDataSource<TreeEntry<TreeEntryTag>>(servers.map((s) => serverToTreeModel(dialogs, s)));

    const treeModel = new ArrayDataSource<TreeEntry<TreeEntryTag>>([
        {
            name: 'Servers',
            icon: 'fas fa-server',
            children: serverEntries,
            tag: {
                type: NodeType.SERVERS,
            },
        },
    ]);

    return (
        <TreeViewComponent
            allowFocus
            longFileNameBehavior="wrap"
            onEntryRightClicked={(e, entry, ancestors) => {
                e.preventDefault();
                openContextMenu(e, entry, ancestors[0], contextMenu, dialogs, props.openDocuments, serverEntries);
            }}
            entries={treeModel}></TreeViewComponent>
    );
}

function openContextMenu(
    e: MouseEvent,
    entry: TreeEntry<TreeEntryTag>,
    parent: TreeEntry<TreeEntryTag>,
    contextMenu: DataSource<Renderable>,
    dialogs: ArrayDataSource<Renderable>,
    openDcuments: ArrayDataSource<FerrumAdminDocument>,
    serverEntries: ArrayDataSource<TreeEntry<TreeEntryTag>>,
) {
    switch (entry.tag.type) {
        case NodeType.SERVERS:
            openAddServerContextMenu(contextMenu, dialogs, serverEntries, e);
            break;
        case NodeType.SERVER:
            openServerContextMenu(contextMenu, entry, dialogs, serverEntries, e);
            break;
        case NodeType.DATABASE:
            openDatabaseContextMenu(contextMenu, entry, parent, dialogs, openDcuments, e);
            break;
        case NodeType.COLLECTION:
            openCollectionContextMenu(contextMenu, entry, parent, dialogs, openDcuments, e);
    }
}

function openCollectionContextMenu(
    contextMenu: DataSource<Renderable>,
    entry: TreeEntry<TreeEntryTag>,
    parent: TreeEntry<TreeEntryTag>,
    dialogs: ArrayDataSource<Renderable>,
    openDocuments: ArrayDataSource<FerrumAdminDocument>,
    e: MouseEvent,
) {
    contextMenu.update(
        spawnContextMenu(
            [
                <div
                    onClick={async () => {
                        dialogs.push(
                            <ConfirmModal
                                title="Drop collection"
                                message={`Are you sure you want to drop collection ${entry.name}?`}
                                onClose={(ok) => {
                                    if (ok) {
                                        //     DbClient.dropCollection({
                                        //         collection: entry.name,
                                        //         database: parent.tag.database,
                                        //         serverIP: parent.tag.server.serverIP,
                                        //         serverPort: parent.tag.server.serverPort,
                                        //     }).then(({ success }) => {
                                        //         if (success) {
                                        //             (parent.children as ArrayDataSource<any>).removeWhere((c) => c === entry);
                                        //         } else {
                                        //             dialogs.push(
                                        //                 <AlertModal
                                        //                     dialogs={dialogs}
                                        //                     title="Error"
                                        //                     message="Failed to drop collection"
                                        //                     icon="fas fa-exclamation-triangle"></AlertModal>,
                                        //             );
                                        //         }
                                        //     });
                                    }
                                }}
                                dialogs={dialogs}></ConfirmModal>,
                        );
                    }}
                    style={{
                        minWidth: '120px',
                    }}>
                    <i class="fas fa-trash"></i> Drop Collection
                </div>,
            ],
            e,
            {
                onClose: () => {
                    contextMenu.update(undefined);
                },
            },
        ),
    );
}

function openDatabaseContextMenu(
    contextMenu: DataSource<Renderable>,
    entry: TreeEntry<TreeEntryTag>,
    serverEntry: TreeEntry<TreeEntryTag>,
    dialogs: ArrayDataSource<Renderable>,
    openDocuments: ArrayDataSource<FerrumAdminDocument>,
    e: MouseEvent,
) {
    contextMenu.update(
        spawnContextMenu(
            [
                <div
                    onClick={() => {
                        dialogs.push(
                            <CreateCollectionModal
                                onClose={(collection) => {
                                    if (collection) {
                                        (entry.children as ArrayDataSource<TreeEntry<TreeEntryTag>>).push({
                                            name: collection.name,
                                            icon: 'fas fa-table',
                                            tag: {
                                                type: NodeType.COLLECTION,
                                                server: entry.tag.server,
                                                database: entry.tag.database,
                                            },
                                        });
                                    }
                                }}
                                dialogs={dialogs}
                                serverIP={entry.tag.server.serverIP}
                                serverPort={entry.tag.server.serverPort}
                                dbName={entry.tag.database}></CreateCollectionModal>,
                        );
                    }}>
                    <i class="fas fa-plus"></i> Create Collection
                </div>,
                <div
                    onClick={() => {
                        openDocuments.push({
                            title: `New Query (${getValueOf(entry.name)})`,
                            content: <QueryEditor dialogSource={contextMenu} initialCode={`const db = await api.getDatabase('${entry.name}');`} />,
                        });
                    }}>
                    <i class="fas fa-play"></i> Run Query
                </div>,
                <div
                    onClick={async () => {
                        dialogs.push(
                            <ConfirmModal
                                destructive
                                title="Drop database"
                                message={`Are you sure you want to drop database ${entry.name}?`}
                                onClose={(ok) => {
                                    if (ok) {
                                        DbServerClient.deleteDatabase({
                                            serverIP: entry.tag.server.serverIP,
                                            serverPort: entry.tag.server.serverPort,
                                            dbName: entry.tag.database,
                                        }).then(({ success }) => {
                                            if (success) {
                                                (serverEntry.children as ArrayDataSource<any>).removeWhere((c) => c === entry);
                                            } else {
                                                dialogs.push(
                                                    <AlertModal
                                                        dialogs={dialogs}
                                                        title="Error"
                                                        message="Failed to drop database"
                                                        icon="fas fa-exclamation-triangle"></AlertModal>,
                                                );
                                            }
                                        });
                                    }
                                }}
                                dialogs={dialogs}></ConfirmModal>,
                        );
                    }}
                    style={{
                        minWidth: '120px',
                    }}>
                    <i class="fas fa-trash"></i> Drop Database
                </div>,
            ],
            e,
            {
                onClose: () => {
                    contextMenu.update(undefined);
                },
            },
        ),
    );
}

function openServerContextMenu(
    contextMenu: DataSource<Renderable>,
    entry: TreeEntry<TreeEntryTag>,
    dialogs: ArrayDataSource<Renderable>,
    serverEntries: ArrayDataSource<TreeEntry<TreeEntryTag>>,
    e: MouseEvent,
) {
    contextMenu.update(
        spawnContextMenu(
            [
                <div
                    onClick={async () => {
                        dialogs.push(
                            <AddDatabaseModal
                                serverIP={entry.tag.server.serverIP}
                                serverPort={entry.tag.server.serverPort}
                                onClose={async (data) => {
                                    if (data) {
                                        (entry.children as ArrayDataSource<TreeEntry<TreeEntryTag>>).push(createDatabaseEntry(data, entry.tag));
                                    }
                                }}
                                dialogs={dialogs}></AddDatabaseModal>,
                        );
                    }}
                    style={{
                        minWidth: '120px',
                    }}>
                    <i class="fas fa-plus"></i> Create Database
                </div>,
                <div
                    onClick={async () => {
                        const { success } = await ConnectionClient.removeServer({
                            serverIP: entry.tag.server.serverIP,
                            serverPort: entry.tag.server.serverPort,
                        });
                        if (success) {
                            serverEntries.removeWhere((se) => se === serverEntries.find((se) => se.name === entry.name));
                        }
                    }}
                    style={{
                        minWidth: '120px',
                    }}>
                    <i class="fas fa-trash"></i> Remove Server
                </div>,
            ],
            e,
            {
                onClose: () => {
                    contextMenu.update(undefined);
                },
            },
        ),
    );
}

function createDatabaseEntry(data: DatabaseModel, tag: TreeEntryTag): TreeEntry<TreeEntryTag> {
    return {
        name: data.name,
        icon: 'fas fa-database',
        lazyLoad: async () => {
            const collectionsResponse = await DbClient.listCollections({
                database: data.name,
                serverIP: tag.server.serverIP,
                serverPort: tag.server.serverPort,
            });

            return collectionsResponse.collections.map((c) => {
                return {
                    name: c,
                    icon: 'fas fa-table',
                    tag: {
                        type: NodeType.COLLECTION,
                        server: tag.server,
                        database: data.name,
                    },
                };
            });
        },
        tag: {
            type: NodeType.DATABASE,
            server: tag.server,
            database: data.name,
        },
    };
}

function openAddServerContextMenu(
    contextMenu: DataSource<Renderable>,
    dialogs: ArrayDataSource<Renderable>,
    serverEntries: ArrayDataSource<TreeEntry<TreeEntryTag>>,
    e: MouseEvent,
) {
    contextMenu.update(
        spawnContextMenu(
            [
                <div
                    onClick={() => {
                        dialogs.push(
                            <AddServerModal
                                onClose={(server) => {
                                    if (server) {
                                        serverEntries.push(serverToTreeModel(dialogs, server));
                                    }
                                }}
                                dialogs={dialogs}></AddServerModal>,
                        );
                    }}
                    style={{
                        minWidth: '120px',
                    }}>
                    <i class="fas fa-plus"></i> Add server
                </div>,
            ],
            e,
            {
                onClose: () => {
                    contextMenu.update(undefined);
                },
            },
        ),
    );
}

function serverToTreeModel(dialogs: ArrayDataSource<Renderable>, server: ServerModel): TreeEntry<TreeEntryTag> {
    return {
        name: server.name,
        lazyLoad: async () => {
            const { databases, success } = await DbServerClient.listDatabases({
                serverIP: server.serverIP,
                serverPort: server.serverPort,
            });

            if (!success) {
                dialogs.push(<AlertModal dialogs={dialogs} title="Error" message="Failed to list databases" icon="fas fa-exclamation-triangle"></AlertModal>);
                return undefined;
            } else {
                return databases.map((db) => {
                    return createDatabaseEntry(
                        {
                            name: db,
                        },
                        {
                            type: NodeType.DATABASE,
                            server: server,
                            database: db,
                        },
                    );
                });
            }
        },
        icon: 'fas fa-server',
        tag: {
            type: NodeType.SERVER,
            server: server,
        },
    };
}
