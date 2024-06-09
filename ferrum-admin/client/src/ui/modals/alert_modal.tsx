import { Button, FloatingWindow, WindowContent, WindowContentRow, WindowFooter, WindowTitle } from 'aurum-components';
import { ArrayDataSource, Aurum, Renderable } from 'aurumjs';

interface AlertModalProps {
    dialogs: ArrayDataSource<Renderable>;
    icon?: string;
    title: string;
    message: string;
    onClose?: () => void;
}

export function AlertModal(this: Renderable, props: AlertModalProps): Renderable {
    const close = function (this: Renderable) {
        props.dialogs.remove(this);
        props.onClose?.();
    }.bind(this);

    return (
        <FloatingWindow onClose={close} onEnter={close} onEscape={close} closable draggable w={400} h={200}>
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
                        onClick={() => close()}
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
