namespace ferrum_api;

using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_logger;
using Grpc.Core;
using GrpcAPI;

using DBDatabase = ferrum_db_engine.Database;
using DBCollection = ferrum_collection_engine.Collection;
using ferrum_collection_engine;

public class DatabaseService : GrpcAPI.Database.DatabaseBase
{
    public static DatabaseEngine databaseEngine;
    public static APIConfig config;

    public override Task<SuccessResponse> CreateCollection(CreateCollectionRequest request, ServerCallContext context)
    {
        var response = new SuccessResponse();
        try
        {
            var db = TryGetDatabase(request.Database);
            if (db == null)
            {
                response.Code = SuccessResponseCode.NotFound;
                return Task.FromResult(response);
            }

            if (db.HasCollection(request.Name))
            {
                response.Code = SuccessResponseCode.AlreadyExists;
                return Task.FromResult(response);
            }

            db.CreateCollection(new ferrum_collection_engine.CollectionConfiguration
            {
                Compression = (ferrum_collection_engine.CompressionAlgorithm)request.CompressionAlgorithm,
                KeyType = (ferrum_collection_engine.CollectionKeyType)request.KeyType,
                MaxItems = request.RecordLimit,
                MaxSize = request.CollectionSizeLimit,
                Name = request.Name,
                Persistence = (ferrum_collection_engine.Persistence)request.PersistenceType,
                ValueEncoding = (ferrum_collection_engine.ValueEncodingType)request.ValueType,
                evictionPolicy = (ferrum_collection_engine.EvictionPolicy?)request.EvictionPolicy,
                Overprovision = request.Overprovision,
                PageSize = request.PageSize
            });
            response.Code = SuccessResponseCode.Ok;
        }
        catch (Exception e)
        {
            Logger.Info($"Error creating collection: {e.Message}");
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    public override Task<SuccessResponse> DeleteCollection(DeleteCollectionRequest request, ServerCallContext context)
    {
        var response = new SuccessResponse();
        try
        {
            var collection = TryGetCollection(request.Database, request.Name);
            if (collection == null)
            {
                response.Code = SuccessResponseCode.NotFound;
                return Task.FromResult(response);
            }

            databaseEngine.GetDatabase(request.Database).DeleteCollection(request.Name);
            response.Code = SuccessResponseCode.Ok;
        }
        catch (Exception e)
        {
            Logger.Info($"Error deleting database: {e.Message}");
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    public override Task<ListCollectionsResponse> ListCollections(ListCollectionsRequest request, ServerCallContext context)
    {
        var response = new ListCollectionsResponse();
        try
        {
            var db = TryGetDatabase(request.Database);
            if (db == null)
            {
                response.Code = SuccessResponseCode.NotFound;
                return Task.FromResult(response);
            }

            response.Names.AddRange(db.ListCollections());
            response.Code = SuccessResponseCode.Ok;
        }
        catch (Exception e)
        {
            Logger.Info($"Error listing collections: {e.Message}");
            response.Code = SuccessResponseCode.ServerError;
            response.Error = e.Message;
        }

        return Task.FromResult(response);
    }

    private DBDatabase? TryGetDatabase(string database)
    {
        if (!databaseEngine.HasDatabase(database))
        {
            return null;
        }

        return databaseEngine.GetDatabase(database);
    }

    private DBCollection? TryGetCollection(string database, string collection)
    {

        var db = TryGetDatabase(database);

        if (db == null)
        {
            return null;
        }

        if (!db.HasCollection(collection))
        {
            return null;
        }

        return db.GetCollection(collection);
    }
}