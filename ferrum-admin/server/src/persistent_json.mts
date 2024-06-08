import { readFileSync, writeFileSync } from 'fs';

export class PersistentJSON<T> {
    private readonly path: string;
    private data: T;

    constructor(path: string, defaultValue: T) {
        this.path = path;
        this.data = this.read() ?? defaultValue;
    }

    private read(): T {
        // read or create the file
        return JSON.parse(
            readFileSync(this.path, {
                encoding: 'utf-8',
                flag: 'a+',
            }) || 'null',
        );
    }

    private write(): void {
        writeFileSync(this.path, JSON.stringify(this.data, null, 4));
    }

    public assign(newData: Partial<T>): void {
        Object.assign(this.data, newData);
        this.write();
    }

    public get(): Readonly<T> {
        return this.data;
    }

    public set(newData: T): void {
        this.data = newData;
        this.write();
    }

    public update(updater: (data: T) => T): void {
        this.data = updater(this.data);
        this.write();
    }
}
