import { Button, FloatingWindow, NumberField, TextField, WindowContent, WindowContentRow, WindowFooter, WindowTitle, createForm } from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable } from 'aurumjs';
import { ConnectionClient } from '../../endpoints/connection_client.js';
import { ServerModel } from '../../models/server.js';
import { LoadingSpinner } from '../components/loading_spinner.js';

export interface AddServerModalProps {
    dialogs: ArrayDataSource<Renderable>;
    onClose?: (newServer?: ServerModel) => void;
}

export function AddServerModal(this: Renderable, props: AddServerModalProps) {
    const close = function (this: Renderable) {
        props.dialogs.remove(this);
        props.onClose?.();
    }.bind(this);

    const error = new DataSource('');
    const loading = new DataSource(false);

    const form = createForm<ServerModel>({
        name: {
            source: new DataSource(''),
            minLength: 1,
        },
        serverIP: {
            source: new DataSource('localhost'),
            minLength: 7,
            maxLength: 15,
        },
        serverPort: {
            source: new DataSource(2999),
            integer: true,
            min: 1,
            max: 65535,
        },
    });

    return (
        <FloatingWindow onClose={close} onEscape={close} closable draggable w={400} h={200}>
            <WindowTitle>
                <i class="fas fa-server"></i> Add server
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>
                    <label>Server name</label>
                    <TextField form={form} name="name"></TextField>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Server IP</label>
                    <TextField form={form} name="serverIP"></TextField>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Server Port</label>
                    <NumberField form={form} name="serverPort"></NumberField>
                </WindowContentRow>
                <LoadingSpinner loading={loading} message="Attempting to connect..."></LoadingSpinner>
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
                        onClick={close.bind(this)}
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
                        onClick={async () => {
                            if (!form.isFullyValid()) {
                                error.update('All fields are required');
                                return;
                            }

                            const model = form.getFormObject();

                            error.update('');
                            loading.update(true);
                            try {
                                const { success } = await ConnectionClient.addServer(model);

                                if (!success) {
                                    loading.update(false);
                                    error.update('Failed to connect to server. Check the IP and port');
                                } else {
                                    close();
                                }
                            } catch (e) {
                                loading.update(false);
                                error.update('Failed to connect to server. Check the IP and port');
                            }
                        }}
                        icon={
                            <i
                                class="fas fa-plus"
                                style={{
                                    marginRight: '5px',
                                }}></i>
                        }>
                        Add server
                    </Button>
                </div>
            </WindowFooter>
        </FloatingWindow>
    );
}
