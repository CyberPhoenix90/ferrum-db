using System;
using System.Collections.Generic;
namespace ferrum_collection_engine;

public class AVLTreeNode<TKey, TValue> where TKey : IComparable<TKey>
{
    public TKey Key { get; set; }
    public TValue Value { get; set; }
    public AVLTreeNode<TKey, TValue> Left { get; set; }
    public AVLTreeNode<TKey, TValue> Right { get; set; }
    public int Height { get; set; }

    public AVLTreeNode(TKey key, TValue value)
    {
        Key = key;
        Value = value;
        Height = 1;
    }
}

public class AVLTree<TKey, TValue> where TKey : IComparable<TKey>
{
    private AVLTreeNode<TKey, TValue>? root;

    private int Height(AVLTreeNode<TKey, TValue> node)
    {
        return node == null ? 0 : node.Height;
    }

    private int BalanceFactor(AVLTreeNode<TKey, TValue> node)
    {
        return node == null ? 0 : Height(node.Left) - Height(node.Right);
    }

    private void UpdateHeight(AVLTreeNode<TKey, TValue> node)
    {
        node.Height = Math.Max(Height(node.Left), Height(node.Right)) + 1;
    }

    private AVLTreeNode<TKey, TValue> RotateRight(AVLTreeNode<TKey, TValue> y)
    {
        AVLTreeNode<TKey, TValue> x = y.Left;
        AVLTreeNode<TKey, TValue> T2 = x.Right;

        x.Right = y;
        y.Left = T2;

        UpdateHeight(y);
        UpdateHeight(x);

        return x;
    }

    private AVLTreeNode<TKey, TValue> RotateLeft(AVLTreeNode<TKey, TValue> x)
    {
        AVLTreeNode<TKey, TValue> y = x.Right;
        AVLTreeNode<TKey, TValue> T2 = y.Left;

        y.Left = x;
        x.Right = T2;

        UpdateHeight(x);
        UpdateHeight(y);

        return y;
    }

    private AVLTreeNode<TKey, TValue> Balance(AVLTreeNode<TKey, TValue> node)
    {
        if (BalanceFactor(node) > 1)
        {
            if (BalanceFactor(node.Left) < 0)
            {
                node.Left = RotateLeft(node.Left);
            }
            return RotateRight(node);
        }
        if (BalanceFactor(node) < -1)
        {
            if (BalanceFactor(node.Right) > 0)
            {
                node.Right = RotateRight(node.Right);
            }
            return RotateLeft(node);
        }
        return node;
    }

    /// <summary>
    /// Inserts a new key-value pair into the AVL tree.
    /// </summary>
    /// <param name="key">The key of the new element.</param>
    /// <param name="value">The value of the new element.</param>
    /// <exception cref="ArgumentException">Thrown when a duplicate key is inserted.</exception>
    public void Insert(TKey key, TValue value)
    {
        root = Insert(root, key, value);
    }

    private AVLTreeNode<TKey, TValue> Insert(AVLTreeNode<TKey, TValue>? node, TKey key, TValue value)
    {
        if (node == null)
            return new AVLTreeNode<TKey, TValue>(key, value);

        int compare = key.CompareTo(node.Key);
        if (compare < 0)
            node.Left = Insert(node.Left, key, value);
        else if (compare > 0)
            node.Right = Insert(node.Right, key, value);
        else
            throw new ArgumentException("Duplicate keys are not allowed");

        UpdateHeight(node);
        return Balance(node);
    }

    /// <summary>
    /// Retrieves the value associated with the specified key.
    /// </summary>
    /// <param name="key">The key to search for.</param>
    /// <returns>The value associated with the specified key.</returns>
    /// <exception cref="ArgumentException">Thrown when the key is not found.</exception>
    public TValue Get(TKey key)
    {
        var node = GetNode(root, key);
        if (node == null)
            throw new ArgumentException("Key not found");

        return node.Value;
    }

    private AVLTreeNode<TKey, TValue>? GetNode(AVLTreeNode<TKey, TValue>? node, TKey key)
    {
        if (node == null)
            return null;

        int compare = key.CompareTo(node.Key);
        if (compare < 0)
            return GetNode(node.Left, key);
        else if (compare > 0)
            return GetNode(node.Right, key);
        else
            return node;
    }

    /// <summary>
    /// Finds the largest key less than or equal to the specified key.
    /// </summary>
    /// <param name="key">The key to compare against.</param>
    /// <returns>The largest key less than or equal to the specified key, or the default value if no such key exists.</returns>
    public TKey? GetFloorKey(TKey key)
    {
        var node = GetFloorNode(root, key);
        return node == null ? default : node.Key;
    }

    private AVLTreeNode<TKey, TValue>? GetFloorNode(AVLTreeNode<TKey, TValue>? node, TKey key)
    {
        if (node == null)
            return null;

        int compare = key.CompareTo(node.Key);
        if (compare == 0)
            return node;

        if (compare < 0)
            return GetFloorNode(node.Left, key);

        var floorNode = GetFloorNode(node.Right, key);
        return floorNode ?? node;
    }

    /// <summary>
    /// Finds the smallest key greater than or equal to the specified key.
    /// </summary>
    /// <param name="key">The key to compare against.</param>
    /// <returns>The smallest key greater than or equal to the specified key, or the default value if no such key exists.</returns>
    public TKey? GetCeilingKey(TKey key)
    {
        var node = GetCeilingNode(root, key);
        return node == null ? default : node.Key;
    }

    private AVLTreeNode<TKey, TValue>? GetCeilingNode(AVLTreeNode<TKey, TValue>? node, TKey key)
    {
        if (node == null)
            return null;

        int compare = key.CompareTo(node.Key);
        if (compare == 0)
            return node;

        if (compare > 0)
            return GetCeilingNode(node.Right, key);

        var ceilingNode = GetCeilingNode(node.Left, key);
        return ceilingNode ?? node;
    }

    /// <summary>
    /// Gets all keys in the range [low, high].
    /// </summary>
    /// <param name="low">The lower bound of the range.</param>
    /// <param name="high">The upper bound of the range.</param>
    /// <returns>An IEnumerable of keys in the specified range.</returns>
    public List<TKey> GetKeysInRange(TKey low, TKey high)
    {
        var keys = new List<TKey>();
        GetKeysInRange(root, low, high, keys);
        return keys;
    }

    /// <summary>
    /// Gets all values in the range [low, high].
    /// </summary>
    /// <param name="low"></param>
    /// <param name="high"></param>
    /// <returns></returns>
    public List<TValue> GetValuesInRange(TKey low, TKey high)
    {
        var values = new List<TValue>();
        GetValuesInRange(root, low, high, values);
        return values;
    }

    private void GetValuesInRange(AVLTreeNode<TKey, TValue>? node, TKey low, TKey high, List<TValue> values)
    {
        if (node == null)
            return;

        int compareLow = low.CompareTo(node.Key);
        int compareHigh = high.CompareTo(node.Key);

        if (compareLow < 0)
            GetValuesInRange(node.Left, low, high, values);

        if (compareLow <= 0 && compareHigh >= 0)
            values.Add(node.Value);

        if (compareHigh > 0)
            GetValuesInRange(node.Right, low, high, values);
    }


    private void GetKeysInRange(AVLTreeNode<TKey, TValue>? node, TKey low, TKey high, List<TKey> keys)
    {
        if (node == null)
            return;

        int compareLow = low.CompareTo(node.Key);
        int compareHigh = high.CompareTo(node.Key);

        if (compareLow < 0)
            GetKeysInRange(node.Left, low, high, keys);

        if (compareLow <= 0 && compareHigh >= 0)
            keys.Add(node.Key);

        if (compareHigh > 0)
            GetKeysInRange(node.Right, low, high, keys);
    }

    /// <summary>
    /// Gets the smallest key in the tree.
    /// </summary>
    /// <returns>The smallest key in the tree.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the tree is empty.</exception>
    public TKey GetMinKey()
    {
        if (root == null)
            throw new InvalidOperationException("Tree is empty");

        var node = GetMinNode(root) ?? throw new InvalidOperationException("Tree is empty");
        return node.Key;
    }

    private AVLTreeNode<TKey, TValue> GetMinNode(AVLTreeNode<TKey, TValue> node)
    {
        while (node.Left != null)
        {
            node = node.Left;
        }
        return node;
    }

    /// <summary>
    /// Gets the largest key in the tree.
    /// </summary>
    /// <returns>The largest key in the tree.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the tree is empty.</exception>
    public TKey GetMaxKey()
    {
        if (root == null)
            throw new InvalidOperationException("Tree is empty");

        var node = GetMaxNode(root) ?? throw new InvalidOperationException("Tree is empty");
        return node.Key;
    }

    private AVLTreeNode<TKey, TValue> GetMaxNode(AVLTreeNode<TKey, TValue> node)
    {
        while (node.Right != null)
        {
            node = node.Right;
        }
        return node;
    }
}
