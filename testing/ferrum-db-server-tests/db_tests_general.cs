using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ferrum_db;
using ferrum_db_server.db;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ferrum_db_server_tests {
    [TestClass]
    public class DatabaseTests {
        [TestInitialize]
        public void init() {
            if (Directory.Exists("tmp")) {
                Directory.Delete("tmp", true);
            }
            Directory.CreateDirectory("tmp");

        }

        [TestMethod]
        public void TestCreateFerrumDb() {
            var dbServer = new FerrumDb("tmp/test.mr");
            dbServer.dispose();
            Assert.IsTrue(File.Exists("tmp/test.mr"));
        }

        [TestMethod]
        public void TestCreateDatabase() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            dbServer.dispose();
            Assert.IsTrue(File.Exists("tmp/test/indexes.bin"));
        }

        [TestMethod]
        public void TestDropDB() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 }, -1);
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });
            dbServer.deleteDatabase("test");
            var db2 = dbServer.createDatabase("test");
            var index2 = db2.addIndex("testIndex", 8);
            index2.set("test2", new byte[] { 0, 1, 2 }, -1);
            CollectionAssert.AreEqual(index2.get("test2"), new byte[] { 0, 1, 2 });

            Assert.IsTrue(File.Exists("tmp/test/4/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/4/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/4").Length == 2);
        }

        [TestMethod]
        public void TestDropAndRestartDB() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            dbServer.createDatabase("test2");
            dbServer.createDatabase("test3");
            dbServer.createDatabase("test4");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 }, -1);
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });
            dbServer.deleteDatabase("test");
            dbServer.deleteDatabase("test2");
            dbServer.deleteDatabase("test3");
            dbServer.deleteDatabase("test4");
            dbServer.dispose();
            dbServer = new FerrumDb("tmp/test.mr");
            Assert.IsTrue(dbServer.getDatabases().Length == 0);
        }

        [TestMethod]
        public void TestPageFileManagement() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 }, -1);
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });

            Assert.IsTrue(File.Exists("tmp/test/4/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/4/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/4").Length == 2);
        }

        [TestMethod]
        public void Mixed() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            db.addSet("testIndex");
            db.addIndex("testIndex", 0);
            db.addIndex("testIndex2", 0);
            db.addSet("testSet2");

            dbServer.dispose();
            dbServer = new FerrumDb("tmp/test.mr");
            db = dbServer.getDatabase("test");

            db.hasSet("testIndex");
            db.hasIndex("testIndex");
            db.hasIndex("testIndex2");
            db.hasSet("testSet2");


            Assert.IsTrue(File.Exists("tmp/test/4/records.set"));
        }

        [TestMethod]
        public void TransactionPass() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            db.addSet("testSet");
            db.addIndex("testIndex", 0);

            dbServer.performTransaction(new DatabaseOperation[] {
                new DatabaseOperation("test" ,DatabaseOperationType.WRITE, TargetType.INDEX, "testIndex", "a", new byte[] { 0, 1, 2 }),
                new DatabaseOperation("test" ,DatabaseOperationType.WRITE, TargetType.INDEX, "testIndex", "b", new byte[] { 2, 3, 4 }),
                new DatabaseOperation("test" ,DatabaseOperationType.WRITE, TargetType.SET, "testSet", "c"),
            });

            dbServer.dispose();
            dbServer = new FerrumDb("tmp/test.mr");
            db = dbServer.getDatabase("test");

            var set = db.getSet("testSet");
            var index = db.getIndex("testIndex");

            Assert.IsTrue(index.has("a"));
            Assert.IsTrue(index.has("b"));

            CollectionAssert.AreEqual(index.get("a"), new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(index.get("b"), new byte[] { 2, 3, 4 });

            Assert.IsTrue(set.has("c"));
        }
    }
}
