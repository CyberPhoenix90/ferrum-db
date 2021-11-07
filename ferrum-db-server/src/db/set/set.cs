using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public class Set {
    private readonly string path;
    public readonly long pos;
    private readonly string name;
    private Dictionary<string, long> contentSet;
    private BinaryWriter writer;

    public Set(string path, long pos, string name, Set? transactionSet) {
        this.contentSet = new Dictionary<string, long>(5000);
        this.path = path;
        this.pos = pos;
        this.name = name;
        initialize(transactionSet);
    }

    private void initialize(Set? transactionSet) {
        Console.WriteLine($"Initializing set {name}");
        Directory.CreateDirectory(this.path);
        if (File.Exists(Path.Join(this.path, "records.set"))) {
            using (BinaryReader reader = new BinaryReader(File.Open(Path.Join(this.path, "records.set"), FileMode.Open))) {
                while (reader.PeekChar() != -1) {
                    this.readRecords(reader, transactionSet);
                }
            }
        }

        this.writer = new BinaryWriter(File.Open(Path.Join(path, "records.set"), FileMode.OpenOrCreate));
        this.writer.BaseStream.Seek(0, SeekOrigin.End);
    }

    public void compact() {
    }

    private void readRecords(BinaryReader reader, Set? transactionSet) {
        var commited = true;

        var key = reader.ReadString();
        var transactionId = reader.ReadInt64();
        if (transactionId != -1 && transactionSet != null) {
            if (!transactionSet.has(transactionId.ToString())) {
                commited = false;
            }
        }
        var isAlive = reader.ReadByte();
        if (isAlive == 1 && commited || isAlive == 2 && !commited) {
            this.contentSet.TryAdd(key, reader.BaseStream.Position - 1);
        }
    }

    public void dispose() {
        this.contentSet.Clear();
        this.writer.Close();
    }

    public bool has(string key) {
        return this.contentSet.Keys.Contains(key);
    }

    public string[] getKeys() {
        var array = new string[this.contentSet.Count];
        this.contentSet.Keys.CopyTo(array, 0);
        return array;
    }

    public void clear() {
        this.contentSet.Clear();
        this.writer.Close();
        Directory.Delete(this.path, true);

        this.initialize(null);
    }

    public void delete(string key, long transactionId) {
        if (this.contentSet.ContainsKey(key) == false) {
            return;
        }
#if DEBUG
        Console.WriteLine($"Deleting record {key} from set {this.name}");
#endif
        var pos = this.contentSet[key];
        this.contentSet.Remove(key);
        if (transactionId != -1) {
            this.writer.BaseStream.Seek(pos - 8, SeekOrigin.Begin);
            this.writer.Write(transactionId);
            this.writer.Write((byte)2);
        } else {
            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.Write(false);
        }

        this.writer.BaseStream.Seek(0, SeekOrigin.End);
        this.writer.Flush();
    }

    public void add(string key, long transactionId) {
#if DEBUG
        Console.WriteLine($"Putting record {key} in set {this.name}");
#endif
        if (!this.has(key)) {
            this.writeRecord(this.writer, key, transactionId);
            this.contentSet.TryAdd(key, this.writer.BaseStream.Position - 1);
        }

    }

    private void writeRecord(BinaryWriter output, string key, long transactionId) {
        output.Write(key);
        output.Write(transactionId);
        output.Write(true);
        output.Flush();
    }

    public int getRecordCount() {
        return this.contentSet.Count;
    }
}