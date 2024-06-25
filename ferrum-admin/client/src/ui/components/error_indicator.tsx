import { Aurum, ReadOnlyDataSource } from 'aurumjs';

export interface ErrorIndicatorProps {
    error: ReadOnlyDataSource<string>;
}

export function ErrorIndicator(props: ErrorIndicatorProps) {
    return (
        <div
            style={{
                color: 'red',
                fontSize: '12px',
            }}>
            {props.error}
        </div>
    );
}
