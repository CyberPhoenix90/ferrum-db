using NUnit.Framework;
using System;
using System.Collections.Generic;
using ferrum_collection_engine;

namespace collection_engine_tests;

[TestFixture]
public class AVLTreeTests
{
    private AVLTree<int, string> tree;

    [SetUp]
    public void SetUp()
    {
        tree = new AVLTree<int, string>();
    }

    [Test]
    public void Insert_Get_ReturnsCorrectValue()
    {
        tree.Insert(1, "one");
        tree.Insert(2, "two");
        tree.Insert(3, "three");

        Assert.AreEqual("one", tree.Get(1));
        Assert.AreEqual("two", tree.Get(2));
        Assert.AreEqual("three", tree.Get(3));
    }

    [Test]
    public void Insert_DuplicateKey_ThrowsException()
    {
        tree.Insert(1, "one");
        Assert.Throws<ArgumentException>(() => tree.Insert(1, "duplicate"));
    }

    [Test]
    public void Get_NonExistentKey_ThrowsException()
    {
        tree.Insert(1, "one");
        Assert.Throws<ArgumentException>(() => tree.Get(2));
    }

    [Test]
    public void GetFloorKey_ReturnsCorrectKey()
    {
        tree.Insert(1, "one");
        tree.Insert(3, "three");
        tree.Insert(5, "five");

        Assert.AreEqual(3, tree.GetFloorKey(4));
        Assert.AreEqual(5, tree.GetFloorKey(5));
        Assert.AreEqual(1, tree.GetFloorKey(2));
    }

    [Test]
    public void GetCeilingKey_ReturnsCorrectKey()
    {
        tree.Insert(1, "one");
        tree.Insert(3, "three");
        tree.Insert(5, "five");

        Assert.AreEqual(3, tree.GetCeilingKey(2));
        Assert.AreEqual(3, tree.GetCeilingKey(3));
        Assert.AreEqual(5, tree.GetCeilingKey(4));
    }

    [Test]
    public void GetKeysInRange_ReturnsCorrectKeys()
    {
        tree.Insert(1, "one");
        tree.Insert(2, "two");
        tree.Insert(3, "three");
        tree.Insert(4, "four");
        tree.Insert(5, "five");

        var keysInRange = tree.GetKeysInRange(2, 4);
        CollectionAssert.AreEqual(new List<int> { 2, 3, 4 }, keysInRange);
    }

    [Test]
    public void GetMinKey_ReturnsCorrectKey()
    {
        tree.Insert(2, "two");
        tree.Insert(1, "one");
        tree.Insert(3, "three");

        Assert.AreEqual(1, tree.GetMinKey());
    }

    [Test]
    public void GetMaxKey_ReturnsCorrectKey()
    {
        tree.Insert(2, "two");
        tree.Insert(1, "one");
        tree.Insert(3, "three");

        Assert.AreEqual(3, tree.GetMaxKey());
    }

    [Test]
    public void GetMinKey_EmptyTree_ThrowsException()
    {
        Assert.Throws<InvalidOperationException>(() => tree.GetMinKey());
    }

    [Test]
    public void GetMaxKey_EmptyTree_ThrowsException()
    {
        Assert.Throws<InvalidOperationException>(() => tree.GetMaxKey());
    }
}
