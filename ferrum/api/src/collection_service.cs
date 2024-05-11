namespace ferrum_api;

using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db_engine;
using ferrum_logger;
using Grpc.Core;
using GrpcAPI;

public class CollectionService : Collection.CollectionBase
{
    public static DatabaseEngine databaseEngine;
    public static APIConfig config;


}