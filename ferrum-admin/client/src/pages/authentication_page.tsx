import { NumberField, TextField, Toast } from 'aurum-components';
import { DataSource, Aurum } from 'aurumjs';
import { authenticate } from '../utils/api.js';
import { toasts } from '../utils/page_state.js';
import { urlServerIP, urlServerPort } from '../utils/url_state.js';

export function AuthenticationPage() {
    const serverIP = new DataSource('localhost');
    const serverPort = new DataSource(3000);

    return (
        <div>
            Authenticate:
            <div style="display: flex; flex-direction: column; width: 200px;">
                <label>
                    Ferrum Server IP <TextField value={serverIP}></TextField>
                </label>
                <label>
                    Ferrum Server Port <NumberField value={serverPort} min="1" max="65535"></NumberField>
                </label>
            </div>
            <button
                onClick={async () => {
                    try {
                        const result = await authenticate({
                            serverIP: serverIP.value,
                            serverPort: serverPort.value,
                        });

                        if (result) {
                            urlServerIP.updateUpstream(serverIP.value);
                            urlServerPort.updateUpstream(serverPort.value);
                            window.location.hash = '/home';
                        } else {
                            toasts.push(<Toast type="error">Failed to authenticate</Toast>);
                        }
                    } catch (e) {
                        toasts.push(
                            <Toast type="error">
                                <pre>
                                    Error when authenticating <br />
                                    {e}
                                </pre>
                            </Toast>,
                        );
                    }
                }}>
                Authenticate
            </button>
        </div>
    );
}
