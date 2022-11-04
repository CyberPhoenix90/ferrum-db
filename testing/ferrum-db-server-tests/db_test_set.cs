using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db;
using ferrum_db_server.db;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ferrum_db_server_tests {
    [TestClass]
    public class DatabaseTestsSet {
        [TestInitialize]
        public void init() {
            if (Directory.Exists("tmp")) {
                Directory.Delete("tmp", true);
            }
            Directory.CreateDirectory("tmp");

        }

        [TestMethod]
        public void Sets() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var set = db.addSet("testIndex");
            set.add("test", -1);
            set.add("test2", -1);
            set.add("test3", -1);
            Assert.IsTrue(set.has("test"));
            Assert.IsTrue(set.has("test2"));
            Assert.IsFalse(set.has("test4"));
            CollectionAssert.AreEqual(set.getKeys(), new string[] { "test", "test2", "test3" });

            Assert.IsTrue(File.Exists("tmp/test/4/records.set"));
        }
    }
}
