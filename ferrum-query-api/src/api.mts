declare interface global {
    api: DatabaseServer;
}

declare interface DatabaseServer {
    GetDatabase(databaseName: string): Database;
    GetDatabaseOrNull(databaseName: string): Database | null;
    HasDatabase(databaseName: string): boolean;
    ListDatabases(): string[];
    DeleteDatabase(databaseName: string): void;
    CreateDatabase(databaseName: string): Database;
}

export interface Database {
    DeleteCollection(collectionName: string): void;
    HasCollection(collectionName: string): boolean;
    GetCollection<T>(collectionName: string): Collection<T>;
    GetCollectionOrNull<T>(collectionName: string): Collection<T> | null;
    CreateCollection<T>(collectionName: string, config: CollectionConfiguration): Collection<T>;
    ListCollections(): string[];
}

export interface Collection<T> {
    GetKeyType(): CollectionKeyType;
    Clear(): void;
}

export interface StringCollection<T> extends Collection<T> {
    Get(key: string): T;
    GetOrNull(key: string): T | null;
    Set(key: string, value: T): void;
    BulkSet(items: { key: string; value: T }[]): void;
    Delete(key: string): void;
    ListKeys(): string[];
    Has(key: string): boolean;
}

export interface NumberCollection<T> extends Collection<T> {
    Get(key: number): T;
    GetOrNull(key: number): T | null;
    Set(key: number, value: T): void;
    BulkSet(items: { key: number; value: T }[]): void;
    Delete(key: number): void;
    ListKeys(): number[];
    Has(key: number): boolean;
    SelectLessThan(key: number): T[];
    SelectGreaterThan(key: number): T[];
    SelectLessThanOrEqual(key: number): T[];
    SelectGreaterThanOrEqual(key: number): T[];
    SelectRange(start: number, end: number): T[];
    SelectNearest(key: number): T;
    SelectNearestLower(key: number): T;
    SelectNearestHigher(key: number): T;
}

export interface CollectionConfiguration {
    Name: string;
    KeyType: CollectionKeyType;
    ValueEncoding: ValueEncodingType;
    Compression: CompressionAlgorithm;
    MaxSize?: number;
    MaxItems?: number;
    PageSize?: number;
    Overprovision?: number;
    EvictionPolicy?: EvictionPolicy;
    Persistence: Persistence;
}

export enum CollectionKeyType {
    StringCollection = 0,
    NumberCollection = 1,
}

export enum CompressionAlgorithm {
    None = 0,
    Lz4 = 1,
    Zstd = 2,
}

export enum ValueEncodingType {
    Binary = 0,
    String = 1,
    Integer = 2,
    Float = 3,
    Boolean = 4,
    Json = 5,
    Real = 6,
    NdJson = 7,
    Void = 8,
}

export enum EvictionPolicy {
    Lru = 0,
    Lfu = 1,
    Fifo = 2,
}

export enum Persistence {
    Persisted = 0,
    InMemory = 1,
}
