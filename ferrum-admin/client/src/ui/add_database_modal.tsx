import { Button, DropDownMenu, FloatingWindow, TextField, WindowContent, WindowContentRow, WindowFooter, WindowTitle, createForm } from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable, dsMap } from 'aurumjs';
import { DbServerClient } from '../endpoints/db_server_client.js';

export interface DatabaseModel {
    name: string;
}

export interface AddDatabaseModalProps {
    dialogs: ArrayDataSource<Renderable>;
    serverIP: string;
    serverPort: number;
    onClose?: (newServer?: DatabaseModel) => void;
}

export function AddDatabaseModal(this: Renderable, props: AddDatabaseModalProps) {
    const name = new DataSource('');
    const type = new DataSource(0);
    const error = new DataSource('');
    const loading = new DataSource(false);

    const close = function (this: Renderable, model?: DatabaseModel) {
        props.dialogs.remove(this);
        props.onClose?.(model);
    }.bind(this);

    const form = createForm<DatabaseModel>({
        name: {
            source: name,
            minLength: 1,
        },
    });

    return (
        <FloatingWindow onClose={() => close()} onEscape={() => close()} onEnter={submit} closable draggable x={100} y={100} w={400} h={200}>
            <WindowTitle>
                <i class="fas fa-server"></i> Add database
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>
                    <label>Database name</label>
                    <TextField
                        class={{
                            invalid: form.isInvalid['name'],
                        }}
                        onBlur={() => form.validateField('name')}
                        value={name}></TextField>
                </WindowContentRow>
                <div
                    style={{
                        color: 'red',
                        fontSize: '12px',
                    }}>
                    {error}
                </div>
            </WindowContent>
            <WindowFooter>
                <div class="right">
                    <Button
                        buttonType="neutral"
                        onClick={() => close()}
                        icon={
                            <i
                                class="fas fa-times"
                                style={{
                                    marginRight: '5px',
                                }}></i>
                        }>
                        Cancel
                    </Button>
                    <Button
                        buttonType="action"
                        onClick={submit}
                        icon={
                            <i
                                class="fas fa-plus"
                                style={{
                                    marginRight: '5px',
                                }}></i>
                        }>
                        Add database
                    </Button>
                </div>
            </WindowFooter>
        </FloatingWindow>
    );

    async function submit(): Promise<void> {
        if (!form.isFullyValid()) {
            return;
        }

        const model = form.getFormObject();

        error.update('');
        loading.update(true);
        const { success } = await DbServerClient.createDatabase({
            dbName: model.name,
            serverIP: props.serverIP,
            serverPort: props.serverPort,
        });

        if (!success) {
            loading.update(false);
            error.update('Failed to create database.');
        } else {
            close(model);
        }
    }
}
