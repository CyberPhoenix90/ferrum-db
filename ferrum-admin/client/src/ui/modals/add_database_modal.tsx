import { Button, FloatingWindow, Submit, TextField, WindowContent, WindowContentRow, WindowFooter, WindowTitle, createForm } from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable } from 'aurumjs';
import { DbServerClient } from '../../endpoints/db_server_client.js';
import { ErrorIndicator } from '../components/error_indicator.js';
import { LoadingSpinner } from '../components/loading_spinner.js';

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
    const close = function (this: Renderable, model?: DatabaseModel) {
        props.dialogs.remove(this);
        props.onClose?.(model);
    }.bind(this);

    const form = createForm<DatabaseModel>(
        {
            fields: {
                name: {
                    source: new DataSource(''),
                    minLength: 1,
                    maxLength: 80,
                },
            },
        },
        async (model, markAsFailed) => {
            const { success } = await DbServerClient.createDatabase({
                dbName: model.name,
                serverIP: props.serverIP,
                serverPort: props.serverPort,
            });
            if (!success) {
                markAsFailed('Failed to create database.');
            } else {
                close(model);
            }
        },
    );

    return (
        <FloatingWindow onClose={() => close()} onEscape={() => close()} onEnter={form.submit} closable draggable w={400} h={200}>
            <WindowTitle>
                <i class="fas fa-server"></i> Add database
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>
                    <label>Database name</label>
                    <TextField form={form} name="name"></TextField>
                </WindowContentRow>
                <LoadingSpinner loading={form.submitting} message="Creating database..."></LoadingSpinner>
                <ErrorIndicator error={form.submitError}></ErrorIndicator>
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
                    <Submit
                        buttonType="action"
                        form={form}
                        icon={
                            <i
                                class="fas fa-plus"
                                style={{
                                    marginRight: '5px',
                                }}></i>
                        }>
                        Add database
                    </Submit>
                </div>
            </WindowFooter>
        </FloatingWindow>
    );
}
