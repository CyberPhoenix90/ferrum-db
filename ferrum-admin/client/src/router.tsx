import { currentTheme, lightTheme } from 'aurum-components';
import { Aurum, AurumRouter, DefaultRoute, Renderable, Route } from 'aurumjs';
import { HomePage } from './ui/home_page.js';

currentTheme.update(lightTheme);

export function Router(): Renderable {
    return (
        <AurumRouter>
            <Route href="/home">
                <HomePage></HomePage>
            </Route>
            <DefaultRoute
                onNavigateTo={() => {
                    history.replaceState(undefined, '', '/home');
                }}></DefaultRoute>
        </AurumRouter>
    );
}
