import { TabBar, TabBarItem } from 'aurum-components';
import { ArrayDataSource, Renderable, Aurum, DataSource, dsMap } from 'aurumjs';

export interface FerrumAdminDocument {
    content: Renderable;
    title: string;
}

export interface DocumentExplorerProps {
    openDocuments: ArrayDataSource<FerrumAdminDocument>;
}

export function DocumentExplorer(props: DocumentExplorerProps): Renderable {
    const selected = new DataSource<FerrumAdminDocument>();

    return (
        <div>
            <TabBar<FerrumAdminDocument>
                keyboardNavigation
                selected={selected}
                canClose
                onClose={(document, index) => {
                    props.openDocuments.remove(document);
                }}>
                {props.openDocuments.map((doc) => (
                    <TabBarItem id={doc}>{doc.title}</TabBarItem>
                ))}
            </TabBar>
            <div>
                {selected.transform(
                    dsMap((s) => {
                        return s?.content ?? undefined;
                    }),
                )}
            </div>
        </div>
    );
}
