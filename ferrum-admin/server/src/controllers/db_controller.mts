import { CollectionCompression, CollectionEvictionStrategy, CollectionKeyType, CollectionPersistence, CollectionValueType } from 'shared';
import { getConnectionFor } from '../connect_manager.mjs';
import { publicEndpoint } from '../decorators/public.mjs';
import { route } from '../decorators/route.mjs';
import { FerrumRequest, FerrumResponse } from '../framework/request.mjs';
import { Controller } from './controller.mjs';
import { post } from '../decorators/method.mjs';
import {
    SuccessResponseCode,
    CompressionAlgorithm,
    CollectionKeyType as PBCollectionKeyType,
    ValueEncodingType,
    Persistence,
    EvictionPolicy,
} from 'ferrum-db-client';

@route('/db')
export class DbController extends Controller {
    @publicEndpoint()
    @post()
    public async listCollections(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            database: string;
        }>,
        res: FerrumResponse<{
            collections?: string[];
            code: SuccessResponseCode;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            const response = await connection.connection.getDatabase(req.body.database).listCollections();
            // List databases
            res.end({ collections: response.getNamesList(), code: response.getCode() });
        } catch (e) {
            res.end({ code: SuccessResponseCode.SERVER_ERROR, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async createCollection(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
            keyType: CollectionKeyType;
            valueType: CollectionValueType;
            compression: CollectionCompression;
            persistence: CollectionPersistence;
            evictionStrategy: CollectionEvictionStrategy;
            maxRecordCount: number;
            maxCollectionSize: number;
            pageSize: number;
            overProvisionFactor: number;
        }>,
        res: FerrumResponse<{
            code: SuccessResponseCode;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Create database
            const response = await connection.connection.getDatabase(req.body.dbName).createCollection({
                name: req.body.collectionName,
                keyType: convertKeyType(req.body.keyType),
                valueType: convertValueType(req.body.valueType),
                compression: convertCompressionType(req.body.compression),
                persistence: convertPersistenceType(req.body.persistence),
                evictionStrategy: convertEvictionType(req.body.evictionStrategy),
                maxRecordCount: req.body.maxRecordCount,
                maxCollectionSize: req.body.maxCollectionSize,
                pageSize: req.body.pageSize,
                overProvisionFactor: req.body.overProvisionFactor,
            });

            res.end({ code: response.getCode() });
        } catch (e) {
            res.end({ code: SuccessResponseCode.SERVER_ERROR, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async hasCollection(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            res.end({ success: await connection.connection.getDatabase(req.body.dbName).hasCollection(req.body.collectionName) });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }

    @publicEndpoint()
    @post()
    public async runQuery(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            query: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
            data?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            const response = await connection.connection.runQuery(req.body.query);
            res.end({ success: true, data: response });
        } catch (e) {
            res.end({ success: false, error: e.message });

    @publicEndpoint()
    @post()
    public async deleteCollection(
        req: FerrumRequest<{
            serverIP: string;
            serverPort: number;
            dbName: string;
            collectionName: string;
        }>,
        res: FerrumResponse<{
            success: boolean;
            error?: string;
        }>,
    ) {
        try {
            const connection = await getConnectionFor(req.body.serverIP, req.body.serverPort);
            // Delete collection
            await connection.connection.getDatabase(req.body.dbName).dropCollection(req.body.collectionName);
            res.end({ success: true });
        } catch (e) {
            res.end({ success: false, error: e.message });
        }
    }
}
function convertKeyType(keyType: CollectionKeyType): PBCollectionKeyType {
    switch (keyType) {
        case CollectionKeyType.STRING:
            return PBCollectionKeyType.STRINGCOLLECTION;
        case CollectionKeyType.NUMBER:
            return PBCollectionKeyType.NUMBERCOLLECTION;
        default:
            throw new Error('Unknown key type');
    }
}

function convertValueType(valueType: CollectionValueType): ValueEncodingType {
    switch (valueType) {
        case CollectionValueType.STRING:
            return ValueEncodingType.STRING;
        case CollectionValueType.BINARY:
            return ValueEncodingType.BINARY;
        case CollectionValueType.JSON:
            return ValueEncodingType.JSON;
        case CollectionValueType.FLOAT64:
            return ValueEncodingType.FLOAT;
        case CollectionValueType.INT64:
            return ValueEncodingType.INTEGER;
        case CollectionValueType.BOOLEAN:
            return ValueEncodingType.BOOLEAN;
        case CollectionValueType.NDJSON:
            return ValueEncodingType.NDJSON;
        case CollectionValueType.REAL:
            return ValueEncodingType.REAL;
        case CollectionValueType.VOID:
            return ValueEncodingType.VOID;
        default:
            throw new Error('Unknown value type');
    }
}

function convertCompressionType(compression: CollectionCompression): CompressionAlgorithm {
    switch (compression) {
        case CollectionCompression.NONE:
            return CompressionAlgorithm.NONE;
        case CollectionCompression.ZSTD:
            return CompressionAlgorithm.ZSTD;
        case CollectionCompression.LZ4:
            return CompressionAlgorithm.LZ4;
        default:
            throw new Error('Unknown compression type');
    }
}

function convertPersistenceType(persistence: CollectionPersistence): Persistence {
    switch (persistence) {
        case CollectionPersistence.PERSISTENT:
            return Persistence.PERSISTED;
        case CollectionPersistence.VOLATILE:
            return Persistence.INMEMORY;
        default:
            throw new Error('Unknown persistence type');
    }
}

function convertEvictionType(eviction: CollectionEvictionStrategy): EvictionPolicy {
    switch (eviction) {
        case CollectionEvictionStrategy.LRU:
            return EvictionPolicy.LRU;
        case CollectionEvictionStrategy.LFU:
            return EvictionPolicy.LFU;
        case CollectionEvictionStrategy.FIFO:
            return EvictionPolicy.FIFO;
        default:
            throw new Error('Unknown eviction type');
    }
}
