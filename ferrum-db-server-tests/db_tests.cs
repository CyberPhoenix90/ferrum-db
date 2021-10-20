using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;
using ferrum_db;

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
        public void TestCreateIndex() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            dbServer.dispose();
            Assert.IsTrue(File.Exists("tmp/test/0/records.index"));
        }

        [TestMethod]
        public void TestIndexSetGet() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });
            dbServer.dispose();

            Assert.IsTrue(File.Exists("tmp/test/0/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/0/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/0").Length == 2);
        }

        [TestMethod]
        public void TestDropDB() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });
            dbServer.deleteDatabase("test");
            var db2 = dbServer.createDatabase("test");
            var index2 = db2.addIndex("testIndex", 8);
            index2.set("test2", new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(index2.get("test2"), new byte[] { 0, 1, 2 });

            Assert.IsTrue(File.Exists("tmp/test/0/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/0/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/0").Length == 2);
        }

        [TestMethod]
        public void TestDropAndRestartDB() {
            var dbServer = new FerrumDb("tmp/test.mr");
            var db = dbServer.createDatabase("test");
            dbServer.createDatabase("test2");
            dbServer.createDatabase("test3");
            dbServer.createDatabase("test4");
            var index = db.addIndex("testIndex", 8);
            index.set("test", new byte[] { 0, 1, 2 });
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
            index.set("test", new byte[] { 0, 1, 2 });
            CollectionAssert.AreEqual(index.get("test"), new byte[] { 0, 1, 2 });

            Assert.IsTrue(File.Exists("tmp/test/0/records.index"));
            Assert.IsTrue(File.Exists("tmp/test/0/0.page"));
            Assert.IsTrue(Directory.GetFiles("tmp/test/0").Length == 2);
        }
    }
}
