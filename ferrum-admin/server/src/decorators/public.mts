export function publicEndpoint() {
    return function (value: any, context: DecoratorContext) {
        if (context.kind === 'method') {
            makePublic(value);
            return value;
        } else {
            throw new Error('The @publicEndpoint decorator can only be used on methods.');
        }
    };
}

export function makePublic<T extends Function>(fn: T): T {
    // @ts-ignore
    fn[publicEndpointSymbol] = true;
    return fn;
}

export function isPublic(fn: Function): boolean {
    // @ts-ignore
    return !!fn[publicEndpointSymbol];
}

const publicEndpointSymbol = Symbol('publicEndpoint');
