using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db;
using ferrum_db_server.db;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ferrum_db_server_tests {
    [TestClass]
    public class DatabaseTestsTimeSeries {
        [TestInitialize]
        public void init() {
            if (Directory.Exists("tmp")) {
                Directory.Delete("tmp", true);
            }
            Directory.CreateDirectory("tmp");

        }

        [TestMethod]
        public void TimeSeries() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var timeSeries = db.addTimeSeries("testIndex", 0);

            timeSeries.set("a.b", 0, new byte[] { 0, 1, 2 }, -1);
            timeSeries.set("a.b", 1, new byte[] { 0, 1, 2 }, -1);
            timeSeries.set("a.b", 1, new byte[] { 2, 1, 0 }, -1);
            timeSeries.set("a.c", 0, new byte[] { 0, 0, 0 }, -1);

            CollectionAssert.AreEqual(timeSeries.get("a.b", 0), new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(timeSeries.get("a.b", 1), new byte[] { 2, 1, 0 });
            CollectionAssert.AreEqual(timeSeries.get("a.c", 0), new byte[] { 0, 0, 0 });

            CollectionAssert.AreEqual(timeSeries.getKeys(), new string[] { "a.b", "a.c" });

            Assert.IsTrue(File.Exists("tmp/test/4/records.timeseries"));
        }

        [TestMethod]
        public void QueryTimestamps() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var timeSeries = db.addTimeSeries("testIndex", 0);

            timeSeries.set("a", 0, new byte[] { 0 }, -1);
            timeSeries.set("a", 1, new byte[] { 1 }, -1);
            timeSeries.set("a", 2, new byte[] { 2 }, -1);
            timeSeries.set("a", 4, new byte[] { 3 }, -1);
            timeSeries.set("a", 8, new byte[] { 4 }, -1);
            timeSeries.set("a", 16, new byte[] { 5 }, -1);

            var result = timeSeries.getEarliestEntry("a");
            Assert.AreEqual(result[0], 0);

            result = timeSeries.getLatestEntry("a");
            Assert.AreEqual(result[0], 5);

            Console.WriteLine("AAAA" + timeSeries.getFirstTimestampBeforeTimestamp("a", 15));

            result = timeSeries.getFirstEntryBeforeTimestamp("a", 15);
            Assert.AreEqual(result[0], 4);


            result = timeSeries.getFirstEntryBeforeTimestamp("a", 8);
            Assert.AreEqual(result[0], 4);

            result = timeSeries.getFirstEntryAfterTimestamp("a", 9);
            Assert.AreEqual(result[0], 5);

            result = timeSeries.getFirstEntryAfterTimestamp("a", 8);
            Assert.AreEqual(result[0], 4);

            var result2 = timeSeries.getLastNEntries("a", 2);

            Assert.AreEqual(result2.Count, 2);
            Assert.AreEqual(result2[0][0], 4);
            Assert.AreEqual(result2[1][0], 5);

            result2 = timeSeries.getEntriesBetweenTimestamps("a", 2, 13);

            Assert.AreEqual(result2.Count, 3);
            Assert.AreEqual(result2[0][0], 2);
            Assert.AreEqual(result2[1][0], 3);
            Assert.AreEqual(result2[2][0], 4);
        }
    }
}