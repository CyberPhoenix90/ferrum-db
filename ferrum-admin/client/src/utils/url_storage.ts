import { ObjectDataSource, DataSource, DuplexDataSource, CancellationToken, ddsMap } from 'aurumjs';

class UrlStorage {
    private readonly parameterState: ObjectDataSource<{ [key: string]: string }>;

    constructor() {
        this.watchHistory();

        this.parameterState = new ObjectDataSource({});
        this.parameterState.listen((change) => {
            const url = new URL(location.href);
            if (change.newValue === undefined) {
                url.searchParams.delete(change.key.toString());
            } else {
                if (change.newValue === 'true') {
                    url.searchParams.set(change.key.toString(), undefined);
                } else {
                    url.searchParams.set(change.key.toString(), change.newValue);
                }
            }
            history.replaceState(undefined, document.title, url.href);
        });
        window.addEventListener('hashchange', () => this.mergeParameters());

        this.mergeParameters();
    }

    private watchHistory(): void {
        const original = history.replaceState;
        history.replaceState = (...args: any[]) => {
            original.apply(history, args);
            this.mergeParameters();
        };
    }

    public bindToPropertyAsString(name: string, defaultValue?: string, token?: CancellationToken): DuplexDataSource<string> {
        const stream = this.parameterState.pickDuplex(name, token);

        if (token) {
            token.addCancelable(() => {
                this.parameterState.delete(name);
            });
        }
        return stream;
    }

    public bindToPropertyAsInteger(name: string, defaultValue?: number, token?: CancellationToken): DuplexDataSource<number> {
        const stream = this.bindToPropertyAsString(name, undefined, token);

        return stream.transformDuplex(
            ddsMap(
                (value) => {
                    const parsed = parseInt(value, 10);
                    return isNaN(parsed) || parsed == null ? defaultValue : parsed;
                },
                (value) => (value !== undefined && value !== defaultValue && !isNaN(value) ? value.toString() : undefined),
            ),
            token,
        );
    }

    public bindToPropertyAsObject<T>(name: string, token?: CancellationToken): DuplexDataSource<T> {
        const stream = this.bindToPropertyAsString(name, undefined, token);

        return stream.transformDuplex(
            ddsMap(
                (value) => (value ? JSON.parse(value) : undefined),
                (value) => (value !== undefined ? JSON.stringify(value) : undefined),
            ),
            token,
        );
    }

    private mergeParameters(): void {
        const result = Object.fromEntries(new URL(location.href).searchParams);
        this.parameterState.assign(result);
        for (const key of this.parameterState.keys()) {
            if (!(key in result)) {
                this.parameterState.delete(key);
            }
        }
    }
}

export const urlStorage = new UrlStorage();
