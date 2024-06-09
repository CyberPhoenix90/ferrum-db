import { PanelComponent, PanelContent, PanelDockLeft, TreeEntry, TreeViewComponent, WindowManager, spawnContextMenu } from 'aurum-components';
import { ArrayDataSource, Aurum, AurumComponentAPI, DataSource, Renderable } from 'aurumjs';
import { ConnectionClient } from '../../endpoints/connection_client.js';
import { AddServerModal } from '../modals/add_server_modal.js';
import { ServerModel } from '../../models/server.js';
import { DbServerClient } from '../../endpoints/db_server_client.js';
import { AddDatabaseModal } from '../modals/add_database_modal.js';
import { AlertModal } from '../modals/alert_modal.js';
import { ConfirmModal } from '../modals/confirm_modal.js';
import { CreateCollectionModal } from '../modals/create_collection_modal.js';

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

export async function HomePage(props: {}, children: [], api: AurumComponentAPI): Promise<Renderable> {
    const dialogs = new ArrayDataSource<Renderable>();
    const contextMenu = new DataSource<Renderable>();
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
        <div>
            <PanelComponent dragHandleThickness={2}>
                <PanelDockLeft
                    style={{
                        backgroundColor: 'white',
                    }}
                    resizable
                    size={250}
                    minSize={250}
                    maxSize={1500}>
                    <TreeViewComponent
                        allowFocus
                        longFileNameBehavior="wrap"
                        onEntryRightClicked={(e, entry, ancestors) => {
                            e.preventDefault();
                            openContextMenu(e, entry, ancestors[0], contextMenu, dialogs, serverEntries);
                        }}
                        entries={treeModel}></TreeViewComponent>
                </PanelDockLeft>
                <PanelContent></PanelContent>
            </PanelComponent>
            {contextMenu}
            <WindowManager>{dialogs}</WindowManager>
        </div>
    );
}

function openContextMenu(
    e: MouseEvent,
    entry: TreeEntry<TreeEntryTag>,
    parent: TreeEntry<TreeEntryTag>,
    contextMenu: DataSource<Renderable>,
    dialogs: ArrayDataSource<Renderable>,
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
            openDatabaseContextMenu(contextMenu, entry, parent, dialogs, e);
            break;
    }
}

function openDatabaseContextMenu(
    contextMenu: DataSource<Renderable>,
    entry: TreeEntry<TreeEntryTag>,
    serverEntry: TreeEntry<TreeEntryTag>,
    dialogs: ArrayDataSource<Renderable>,
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
                                        (entry.children as ArrayDataSource<TreeEntry<TreeEntryTag>>).push({
                                            name: data.name,
                                            icon: 'fas fa-database',
                                            tag: {
                                                type: NodeType.DATABASE,
                                                server: entry.tag.server,
                                                database: data.name,
                                            },
                                        });
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
                    return {
                        name: db,
                        icon: 'fas fa-database',
                        tag: {
                            type: NodeType.DATABASE,
                            server,
                            database: db,
                        } satisfies TreeEntryTag,
                    };
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
