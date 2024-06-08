export function route(route: string) {
    return function (value: any, context: DecoratorContext) {
        if (context.kind === 'class') {
            value[controllerRouteSymbol] = route;
            return value;
        } else {
            throw new Error('The @route decorator can only be used on classes.');
        }
    };
}

export function getRoute(classReference: new (...args: any[]) => any): string | undefined {
    //@ts-ignore
    return classReference[controllerRouteSymbol];
}

const controllerRouteSymbol = Symbol('controllerRoute');
