import { Button, FloatingWindow, WindowContent, WindowContentRow, WindowFooter, WindowTitle } from 'aurum-components';
import { ArrayDataSource, Aurum, Renderable } from 'aurumjs';

interface ConfirmModalProps {
    dialogs: ArrayDataSource<Renderable>;
    icon?: string;
    title: string;
    message: string;
    destructive?: boolean;
    onClose?: (ok: boolean) => void;
}

export function ConfirmModal(this: Renderable, props: ConfirmModalProps): Renderable {
    const close = function (this: Renderable, ok: boolean) {
        props.dialogs.remove(this);
        props.onClose?.(ok);
    }.bind(this);

    return (
        <FloatingWindow
            onClose={() => close(false)}
            // do not accept on enter if the confirm modal is for destructive actions
            onEnter={() => !props.destructive && close(true)}
            onEscape={() => close(false)}
            closable
            draggable
            w={400}
            h={200}>
            <WindowTitle>
                {props.icon ? <i class={props.icon}></i> : ''}
                {props.title}
            </WindowTitle>
            <WindowContent>
                <WindowContentRow>{props.message}</WindowContentRow>
            </WindowContent>
            <WindowFooter>
                <div class="right">
                    <Button
                        buttonType="neutral"
                        onClick={() => close(false)}
                        style={{
                            minWidth: '120px',
                        }}>
                        Cancel
                    </Button>
                    <Button
                        buttonType={props.destructive ? 'destructive' : 'action'}
                        onClick={() => close(true)}
                        style={{
                            minWidth: '120px',
                        }}>
                        OK
                    </Button>
                </div>
            </WindowFooter>
        </FloatingWindow>
    );
}
