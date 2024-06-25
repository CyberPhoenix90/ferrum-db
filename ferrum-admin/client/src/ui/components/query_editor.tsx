import { MenuStrip, MenuStripButton } from 'aurum-components';
import { Aurum } from 'aurumjs';
import { editor, languages } from 'monaco-editor';

export function QueryEditor(props: { initialCode?: string; dialogSource: any }) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}>
            <MenuStrip dialogSource={props.dialogSource}>
                <MenuStripButton buttonType="action">
                    <i class="fas fa-save"></i> &nbsp; Run
                </MenuStripButton>
            </MenuStrip>
            <div
                style={{
                    width: '100%',
                    height: '100%',
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
                                    return new Worker(new URL('../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), {
                                        type: 'module',
                                    });
                                }
                                case 'typescript': {
                                    return new Worker(new URL('../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url), {
                                        type: 'module',
                                    });
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
    ${props.initialCode || 'return { code: ResponseCode.OK, data: undefined };\n'}\n}`,
                        language: 'javascript',
                    });
                }}></div>
        </div>
    );
}
async function addLibrary(library: string) {
    const api = await fetch(library).then((r) => r.text());
    languages.typescript.javascriptDefaults.addExtraLib(api, library.split('/').pop()!);
}
