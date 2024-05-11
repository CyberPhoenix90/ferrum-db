import { Toaster } from 'aurum-components';
import { Aurum } from 'aurumjs';
import { Router } from './router.js';
import { toasts } from './utils/page_state.js';

Aurum.attach(
    <div>
        <Router></Router>
        <Toaster defaultToastActiveTime={5000}>{toasts}</Toaster>
    </div>,
    document.body,
);
