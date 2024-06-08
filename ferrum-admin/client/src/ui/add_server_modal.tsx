import { FloatingWindow, WindowTitle, WindowContent, TextField, NumberField, WindowFooter, WindowContentRow, Button } from 'aurum-components';
import { ArrayDataSource, Aurum, DataSource, Renderable, dsMap } from 'aurumjs';
import { ConnectionClient } from '../endpoints/connection_client.js';
import { ServerModel } from '../models/server.js';

export interface AddServerModalProps {
    dialogs: ArrayDataSource<Renderable>;
    onClose?: (newServer?: ServerModel) => void;
}

export function AddServerModal(this: Renderable, props: AddServerModalProps) {
    const name = new DataSource('');
    const ip = new DataSource('localhost');
    const port = new DataSource(3000);
    const error = new DataSource('');
    const loading = new DataSource(false);

    const close = function (this: Renderable) {
        props.dialogs.remove(this);
        props.onClose?.();
    }.bind(this);

    return (
        <FloatingWindow onClose={close} onEscape={close} closable draggable x={100} y={100} w={400} h={200}>
            <WindowTitle>
                <i class="fas fa-server"></i> Add server
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>
                    <label>Server name</label>
                    <TextField value={name}></TextField>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Server IP</label>
                    <TextField value={ip}></TextField>
                </WindowContentRow>
                <WindowContentRow>
                    <label>Server Port</label>
                    <NumberField min={1} max={65535} value={port}></NumberField>
                </WindowContentRow>

                <div>
                    {loading.transform(
                        dsMap((v) =>
                            v ? (
                                <>
                                    <i
                                        class="fas fa-spinner fa-spin"
                                        style={{
                                            fontSize: '12px',
                                        }}></i>
                                    &nbsp; Attempting to connect...
                                </>
                            ) : (
                                ''
                            ),
                        ),
                    )}
                </div>
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
                            if (!name.value || !ip.value || !port.value) {
                                error.update('All fields are required');
                                return;
                            }

                            error.update('');
                            loading.update(true);
                            const { success } = await ConnectionClient.addServer({
                                name: name.value,
                                serverIP: ip.value,
                                serverPort: port.value,
                            });

                            if (!success) {
                                loading.update(false);
                                error.update('Failed to connect to server. Check the IP and port');
                            } else {
                                close();
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
