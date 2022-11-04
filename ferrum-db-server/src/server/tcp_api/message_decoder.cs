using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ferrum_db_server.src.server.protocol;
using static ferrum_db_server.src.server.protocol.Tags;

namespace ferrum_db_server.src.server {
    public class MessageDecoder {

        public static Message? decode(Byte[] buffer) {
            try {

                using (var reader = new BinaryReader(new MemoryStream(buffer))) {
                    var type = reader.ReadInt32();
#if DEBUG
                    Console.WriteLine($"Decoding {type}");
#endif
                    switch ((ApiMessageType)type) {
                        case ApiMessageType.HEARTBEAT:
                            return new HeartBeat(reader.ReadUInt32());
                        case ApiMessageType.CREATE_DATABASE:
                            return new CreateDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.CREATE_DATABASE_IF_NOT_EXIST:
                            return new CreateDatabaseIfNotExist(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.HAS_DATABASE:
                            return new HasDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.CLEAR_DATABASE:
                            return new ClearDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.DROP_DATABASE:
                            return new DropDatabase(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.LIST_DATABASES:
                            return new ListDatabases(reader.ReadUInt32());
                        case ApiMessageType.CREATE_INDEX:
                            return new CreateIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.CREATE_INDEX_IF_NOT_EXIST:
                            return new CreateIndexIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.DELETE_INDEX:
                            return new DeleteIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_INDEX:
                            return new HasIndex(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_INDEXES:
                            return new GetIndexes(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.COMPACT:
                            return new Compact(reader.ReadUInt32());
                        case ApiMessageType.INDEX_CLEAR:
                            return new IndexClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET_KEYS:
                            return new IndexGetKeys(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_DELETE:
                            return new IndexDelete(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET:
                            return new IndexGet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_HAS:
                            return new IndexHas(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_SET:
                            return new IndexSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.INDEX_GET_RECORD_COUNT:
                            return new IndexRecordCount(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_GET_RECORD_SIZE:
                            return new IndexGetRecordSize(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_READ_CHUNK:
                            return new IndexReadChunk(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadUInt32());
                        case ApiMessageType.INDEX_READ_UNTIL:
                            return new IndexReadUntil(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadByte());
                        case ApiMessageType.INDEX_OPEN_WRITE_STREAM:
                            return new IndexOpenWriteStream(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.INDEX_CLOSE_WRITE_STREAM:
                            return new IndexCloseWriteStream(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.INDEX_WRITE_STREAM_WRITE_CHUNK:
                            return new IndexWriteStreamWriteChunk(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.CREATE_SET:
                            return new CreateSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.CREATE_SET_IF_NOT_EXIST:
                            return new CreateSetIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.DELETE_SET:
                            return new DeleteSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_SET:
                            return new HasSet(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_SETS:
                            return new GetSets(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.SET_CLEAR:
                            return new SetClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_GET_KEYS:
                            return new SetGetKeys(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_DELETE:
                            return new SetDelete(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_HAS:
                            return new SetHas(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_ADD:
                            return new SetAdd(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.SET_GET_RECORD_COUNT:
                            return new SetRecordCount(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_CLEAR:
                            return new TimeSeriesClear(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_DELETE_ENTRY:
                            return new TimeSeriesDeleteEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_DELETE_SERIE:
                            return new TimeSeriesDeleteSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_EARLIEST_ENTRY:
                            return new TimeSeriesGetFirstEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_LATEST_ENTRY:
                            return new TimeSeriesGetLastEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_ENTRIES_BETWEEN_TIMESTAMPS:
                            return new TimeSeriesGetEntriesBetween(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_ENTRY:
                            return new TimeSeriesGetEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_AFTER_TIMESTAMP:
                            return new TimeSeriesGetFirstEntryAfter(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_FIRST_ENTRY_BEFORE_TIMESTAMP:
                            return new TimeSeriesGetFirstEntryBefore(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_LAST_N_ENTRIES:
                            return new TimeSeriesGetLastNEntries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt32());
                        case ApiMessageType.TIME_SERIES_GET_NEAREST_ENTRY_TO_TIMESTAMP:
                            return new TimeSeriesGetNearestEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_HAS_ENTRY:
                            return new TimeSeriesHasEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_HAS_SERIE:
                            return new TimeSeriesHasSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.CREATE_TIME_SERIES:
                            return new CreateTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.CREATE_TIME_SERIES_IF_NOT_EXIST:
                            return new CreateTimeSeriesIfNotExist(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadUInt32());
                        case ApiMessageType.DELETE_TIME_SERIES:
                            return new DeleteTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.HAS_TIME_SERIES:
                            return new HasTimeSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.GET_TIME_SERIES:
                            return new GetTimeSeries(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_PUT_ENTRY:
                            return new TimeSeriesSetEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.TIME_SERIES_GET_SERIES:
                            return new TimeSeriesGetSeries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_FULL_SERIE:
                            return new TimeSeriesGetFullSerie(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_FULL_SERIE_ENTRIES:
                            return new TimeSeriesGetFullSerieEntries(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString());
                        case ApiMessageType.TIME_SERIES_GET_ENTRIES_BEFORE_TIMESTAMP:
                            return new TimeSeriesGetEntriesBefore(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.TIME_SERIES_GET_ENTRIES_AFTER_TIMESTAMP:
                            return new TimeSeriesGetEntriesAfter(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadString(), reader.ReadInt64());
                        case ApiMessageType.COLLECTION_DELETE_TAG:
                            return new CollectionDeleteTag(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadByte(), reader.ReadString());
                        case ApiMessageType.COLLECTION_GET_TAGS:
                            return new CollectionGetTags(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadByte());
                        case ApiMessageType.COLLECTION_GET_TAG_ENTRY:
                            return new CollectionGetTagEntry(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadByte(), reader.ReadString());
                        case ApiMessageType.COLLECTION_HAS_TAG:
                            return new CollectionHasTag(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadByte(), reader.ReadString());
                        case ApiMessageType.COLLECTION_SET_TAG:
                            return new CollectionSetTag(reader.ReadUInt32(), reader.ReadString(), reader.ReadString(), reader.ReadByte(), reader.ReadString(), reader.ReadBytes(reader.ReadInt32()));
                        case ApiMessageType.GET_CONNECTIONS:
                            return new GetConnections(reader.ReadUInt32());
                        case ApiMessageType.GET_CONNECTION_INFO:
                            return new GetConnectionInfo(reader.ReadUInt32(), reader.ReadString());
                        case ApiMessageType.KICK_CONNECTION:
                            return new KickConnection(reader.ReadUInt32(), reader.ReadString());
                        default:
                            throw new Exception("Unknown message type: " + type);

                    }
                }
            }
            catch (Exception e) {
                Console.WriteLine($"Error while decoding message {e.Message}");
            }

            return null;
        }

    }
}