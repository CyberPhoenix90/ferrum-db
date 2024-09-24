export function stream() {
    return function (value: any, context: DecoratorContext) {
        if (context.kind === 'method') {
            makeStream(value);
            return value;
        } else {
            throw new Error('The @stream decorator can only be used on methods.');
        }
    };
}

export function makeStream<T extends Function>(fn: T): T {
    // @ts-ignore
    fn[streamEndpointSymbol] = true;
    return fn;
}

export function isStream(fn: Function): boolean {
    // @ts-ignore
    return !!fn[streamEndpointSymbol];
}

const streamEndpointSymbol = Symbol('streamEndpoint');
