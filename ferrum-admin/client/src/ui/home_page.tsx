import { PanelComponent, PanelContent, PanelDockLeft, TreeEntry, TreeViewComponent, WindowManager, spawnContextMenu } from 'aurum-components';
import { ArrayDataSource, Aurum, AurumComponentAPI, DataSource, Renderable } from 'aurumjs';
import { ConnectionClient } from '../endpoints/connection_client.js';
import { AddServerModal } from './add_server_modal.js';
import { ServerModel } from '../models/server.js';
import { DbServerClient } from '../endpoints/db_server_client.js';
import { AddDatabaseModal } from './add_database_modal.js';

interface TreeEntryTag {
    type: NodeType;
    model?: ServerModel;
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
    const serverEntries = new ArrayDataSource<TreeEntry<TreeEntryTag>>(servers.map(serverToTreeModel));
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
                        onEntryRightClicked={(e, entry) => {
                            e.preventDefault();
                            openContextMenu(e, entry, contextMenu, dialogs, serverEntries);
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
    }
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
                                serverIP={entry.tag.model.serverIP}
                                serverPort={entry.tag.model.serverPort}
                                onClose={async (data) => {
                                    if (data) {
                                        (entry.children as ArrayDataSource<any>).push({
                                            name: data.name,
                                            icon: data.type === 'persistent' ? 'fas fa-database' : 'fas fa-memory',
                                            tag: {
                                                type: NodeType.DATABASE,
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
                            serverIP: entry.tag.model.serverIP,
                            serverPort: entry.tag.model.serverPort,
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
                                        serverEntries.push(serverToTreeModel(server));
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

function serverToTreeModel(server: ServerModel): TreeEntry<TreeEntryTag> {
    return {
        name: server.name,
        lazyLoad: async () => {
            const { databases } = await DbServerClient.listDatabasesWithType({
                serverIP: server.serverIP,
                serverPort: server.serverPort,
            });
            return databases.map((db) => {
                return {
                    name: db,
                    icon: 'fas fa-database',
                    tag: {
                        type: NodeType.DATABASE,
                    },
                };
            });
        },
        icon: 'fas fa-server',
        tag: {
            type: NodeType.SERVER,
            model: server,
        },
    };
}
