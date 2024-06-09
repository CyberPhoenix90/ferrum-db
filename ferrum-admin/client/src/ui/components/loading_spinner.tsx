import { DataSource, Renderable, Aurum, dsMap } from 'aurumjs';

export function LoadingSpinner(props: { loading: DataSource<boolean>; message: string }): Renderable {
    const { loading, message } = props;
    return (
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
                            &nbsp; {message}
                        </>
                    ) : (
                        ''
                    ),
                ),
            )}
        </div>
    );
}
