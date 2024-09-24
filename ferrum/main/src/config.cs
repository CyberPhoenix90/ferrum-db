using System.ComponentModel;
using Newtonsoft.Json;

namespace ferrum;

public class Config
{
    [DefaultValue("127.0.0.1")]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public string ip;
    [DefaultValue(3000)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int port;
    [DefaultValue(128)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    // Max message length in MB. Affects memory usage
    public int grpcMaxMessageLength;
    public string? dbFolder;
    [DefaultValue(true)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public bool stdout;
    public string? fileOut;
    [DefaultValue("INFO")]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public string logLevel;

    public string? sslCertificate;
    public string? sslPassword;
    // Value from 0 to 100, 0 disables the garbage collector, 100 collects immediately as soon as any data is deleted
    [DefaultValue(50)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public byte garbageCollectorAggressiveness;
    // Collections that should be preloaded on startup and kept in memory
    // Formatted as "DatabaseName:CollectionName"
    [DefaultValue(new string[0])]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public string[] preloadedCollections;
    // The amount of time in seconds a collection can be idle before being unloaded from memory, 0 means never unload. Collections listed in preloadedCollections are never unloaded
    [DefaultValue(0)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int collectionIdleTimeout;
    // The amount of data that can be cached in memory before being written to disk in MB
    [DefaultValue(256)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int writeCacheSize;
    // The amount of data that can be kept in memory in case it is needed again in MB
    [DefaultValue(256)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int readCacheSize;
    // Sets how many queries can be run in parallel
    [DefaultValue(4)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int maxQueryVMs;
    // Max heap size of VMs
    [DefaultValue(768)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int maxQueryVMMemory;
    // Max time in seconds a query can run before being killed
    [DefaultValue(60)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int defaultMaxQueryTime;
    // 0 means no limit
    [DefaultValue(0)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int maxPendingQueries;
    // Allow debugging queries. Query debugging is generally designed to not cause problems because locks aren't held during debugging but this is not a guarantee.
    // Collections may lock up during debugging. Use at your own risk
    [DefaultValue(false)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public bool allowDebuggingQueries;
    // How many file handles can be open at once. Too low might degrade performance
    [DefaultValue(2048)]
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Populate)]
    public int maxFileHandles;
}