import { JSONRenderer, MenuStrip, MenuStripButton } from 'aurum-components';
import { Aurum, DataSource, dsMap } from 'aurumjs';
import { editor, languages } from 'monaco-editor';
import { DbServerClient } from '../../endpoints/db_server_client.js';
import { QueryResponseEncoding, SuccessResponseCode } from 'shared';

//@ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
//@ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
//@ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
//@ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
//@ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

export function QueryEditor(props: { initialCode?: string; dialogSource: any; serverIP: string; serverPort: number }) {
    const output = new DataSource<{
        code: SuccessResponseCode;
        error?: string;
        data?: string;
        encoding: QueryResponseEncoding;
    }>(undefined);

    return (
        <div
            style={{
                width: '100%',
                height: 'calc( 100% - 75px )',
            }}>
            <MenuStrip dialogSource={props.dialogSource}>
                <MenuStripButton
                    onClick={async () => {
                        const query = editor.getModels()[0].getValue();
                        const result = await DbServerClient.runQuery({
                            query,
                            serverIP: props.serverIP,
                            serverPort: props.serverPort,
                            params: [],
                        });

                        output.update(result);
                    }}
                    buttonType="action">
                    <i class="fas fa-save"></i> &nbsp; Run
                </MenuStripButton>
                <MenuStripButton
                    onClick={async () => {
                        const query = editor.getModels()[0].getValue();
                        const result = await DbServerClient.runQuery({
                            query,
                            serverIP: props.serverIP,
                            serverPort: props.serverPort,
                            debugMode: true,
                            params: [],
                        });

                        output.update(result);
                    }}
                    buttonType="action">
                    <i class="fas fa-bug"></i> &nbsp; Run in debug mode
                </MenuStripButton>
            </MenuStrip>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                }}>
                <div
                    style={{
                        width: '100%',
                        height: '70%',
                    }}
                    onAttach={async (div) => {
                        self.MonacoEnvironment = {
                            getWorker(_workerId: string, label: string): Worker {
                                switch (label) {
                                    case 'json': {
                                        return new Worker(new URL('../../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url), {
                                            type: 'module',
                                        });
                                    }
                                    case 'javascript': {
                                        return new Worker(
                                            new URL('../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
                                            {
                                                type: 'module',
                                            },
                                        );
                                    }
                                    case 'typescript': {
                                        return new Worker(
                                            new URL('../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url),
                                            {
                                                type: 'module',
                                            },
                                        );
                                    }

                                    default: {
                                        throw new Error(`Unknown language worker label: ${label}`);
                                    }
                                }
                            },
                        };
                        await addLibrary('node_modules/ferrum-query-api/dist/index.d.mts');
                        await addLibrary('node_modules/ferrum-query-api/dist/api.d.mts');
                        await addLibrary('node_modules/ferrum-query-api/dist/database_remote.d.mts');
                        await addLibrary('node_modules/ferrum-query-api/dist/response_code.d.mts');

                        languages.typescript.javascriptDefaults.setCompilerOptions({
                            target: languages.typescript.ScriptTarget.ESNext,
                            module: languages.typescript.ModuleKind.ESNext,
                            moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
                            esModuleInterop: true,
                        });

                        editor.create(div, {
                            automaticLayout: true,
                            value: `import { api, ResponseCode } from 'ferrum-query-api';\n\nexport default async function query(parameters: {}): Promise<{ code: ResponseCode; data: any }> {
    ${props.initialCode || 'return { code: ResponseCode.OK, data: undefined };'}\n}`,
                            language: 'javascript',
                        });
                    }}></div>
                <div style="width: 100%; height: 30%">
                    {output.transform(
                        dsMap((o) => {
                            switch (o.encoding) {
                                case QueryResponseEncoding.TEXT_PLAIN:
                                    return <div>{o.data}</div>;
                                case QueryResponseEncoding.TEXT_JSON:
                                    return <JSONRenderer>{JSON.parse(o.data)}</JSONRenderer>;
                                case QueryResponseEncoding.NULL:
                                    return <div>No data</div>;
                                default:
                                    return <div>Unsupported encoding: {o.encoding}</div>;
                            }
                        }),
                    )}
                </div>
            </div>
        </div>
    );
}
async function addLibrary(library: string) {
    const api = await fetch(library).then((r) => r.text());
    languages.typescript.javascriptDefaults.addExtraLib(api, library.split('/').pop()!);
}
