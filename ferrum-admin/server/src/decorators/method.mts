export function get<O>(route?: string) {
    return function (value: any, context: DecoratorContext) {
        if (context.kind === 'method') {
            value[methodModelSymbol] = {
                method: 'get',
                route: route,
            };
            return value;
        } else {
            throw new Error('The @get decorator can only be used on methods.');
        }
    };
}

export function post<I, O>(route?: string) {
    return function (value: any, context: DecoratorContext) {
        if (context.kind === 'method') {
            value[methodModelSymbol] = {
                method: 'post',
                route: route,
            };
            return value;
        } else {
            throw new Error('The @get decorator can only be used on methods.');
        }
    };
}

export interface MethodModel {
    method: string;
    route?: string;
}

export function getMethodModel(fn: Function & { [methodModelSymbol]: MethodModel }): MethodModel {
    return fn[methodModelSymbol];
}

const methodModelSymbol = Symbol('methodModel');
