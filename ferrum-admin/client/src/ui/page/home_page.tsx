import { PanelComponent, PanelContent, PanelDockLeft, WindowManager } from 'aurum-components';
import { ArrayDataSource, Aurum, AurumComponentAPI, DataSource, Renderable } from 'aurumjs';
import { DatabaseExplorer } from '../components/database_explorer.js';
import { DocumentExplorer, FerrumAdminDocument } from '../components/document_explorer.js';

export async function HomePage(props: {}, children: [], api: AurumComponentAPI): Promise<Renderable> {
    const dialogs = new ArrayDataSource<Renderable>();
    const contextMenu = new DataSource<Renderable>();
    const openDocuments = new ArrayDataSource<FerrumAdminDocument>();

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
                    <DatabaseExplorer openDocuments={openDocuments} dialogs={dialogs} contextMenu={contextMenu}></DatabaseExplorer>
                </PanelDockLeft>
                <PanelContent>
                    <DocumentExplorer openDocuments={openDocuments}></DocumentExplorer>
                </PanelContent>
            </PanelComponent>
            {contextMenu}
            <WindowManager>{dialogs}</WindowManager>
        </div>
    );
}
