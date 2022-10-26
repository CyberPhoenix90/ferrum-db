import { Toaster } from 'aurum-components';
import { Aurum } from 'aurumjs';
import { Router } from './router';
import { toasts } from './utils/page_state';

Aurum.attach(
    <div>
        <Router></Router>
        <Toaster defaultToastActiveTime={5000}>{toasts}</Toaster>
    </div>,
    document.body,
);
