import { currentTheme, lightTheme } from 'aurum-components';
import { Aurum, AurumRouter, DefaultRoute, Renderable, Route } from 'aurumjs';
import { AuthenticationPage } from './pages/authentication_page.js';
import { HomePage } from './pages/home_page.js';
import { urlDatabase, urlFocusedCollection, urlServerIP, urlServerPort } from './utils/url_state.js';

currentTheme.update(lightTheme);

export function Router(): Renderable {
    return (
        <AurumRouter>
            <Route
                onNavigateTo={() => {
                    urlServerIP.updateUpstream(undefined);
                    urlServerPort.updateUpstream(undefined);
                    urlDatabase.updateUpstream(undefined);
                    urlFocusedCollection.updateUpstream(undefined);
                }}
                href="/authenticate">
                <AuthenticationPage></AuthenticationPage>
            </Route>
            <Route href="/home">
                <HomePage></HomePage>
            </Route>
            <DefaultRoute
                onNavigateTo={() => {
                    if (urlServerIP.value && urlServerPort.value) {
                        window.location.hash = '/home';
                    } else {
                        window.location.hash = '/authenticate';
                    }
                }}></DefaultRoute>
        </AurumRouter>
    );
}
