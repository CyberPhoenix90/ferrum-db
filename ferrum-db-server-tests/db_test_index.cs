using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db;
using ferrum_db_server.db;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ferrum_db_server_tests {
    [TestClass]
    public class DatabaseTestsIndex {
        [TestInitialize]
        public void init() {
            if (Directory.Exists("tmp")) {
                Directory.Delete("tmp", true);
            }
            Directory.CreateDirectory("tmp");

        }
        [TestMethod]
        public void TestCreateIndex() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            dbServer.dispose();
            Assert.IsNotNull(index);
            Assert.IsTrue(File.Exists("tmp/test/4/records.index"));
        }

        [TestMethod]
        public void TestIndexSetGet() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 }, -1);
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });
            dbServer.dispose();

            Assert.IsTrue(File.Exists("tmp/test/4/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/4/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/4").Length == 2);
        }

        [TestMethod]
        public void TestIndexStress() {
            Random rnd = new Random();
            var bigRecord = new byte[1024 * 1024 * 5];
            for (int i = 0; i < bigRecord.Length; i++) {
                bigRecord[i] = (byte)rnd.Next(256);
            }
            var writtenRecords = new List<string>();

            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);

            for (int i = 0; i < 500; i++) {
                var record = RandomString(32);
                index.set(record, bigRecord, -1);
                writtenRecords.Add(record);
            }

            dbServer.dispose();
            dbServer = new FerrumDb("tmp/test.mr");
        }

        private string RandomString(int length) {
            Random random = new Random();

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
