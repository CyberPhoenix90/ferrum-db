using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;

namespace page_file {
    class PageFile {
        public uint size;
        public long usedBytes;
        public long pos { get { return this.writer.BaseStream.Position; } }
        private BinaryWriter writer;
        private readonly string path;
        public readonly uint index;
        public uint liveEntries;

        public long availableBytes { get { return size - usedBytes; } }


        public PageFile(string path, uint index, uint size) {
            this.path = path;
            this.index = index;
            this.size = size;
            this.writer = new BinaryWriter(File.Open(path, FileMode.OpenOrCreate));
            this.liveEntries = 0;
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
        }

        public bool isEmpty() {
            return this.usedBytes == 0;
        }

        public byte[] read(long pos, uint len) {
            var buffer = new byte[len];
            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            this.writer.BaseStream.Read(buffer, 0, (int)len);
            return buffer;
        }

        public byte[] readUntil(long pos, long len, byte until) {
            var ptr = pos;
            List<byte> result = new List<byte>(256);
            this.writer.BaseStream.Seek(pos, SeekOrigin.Begin);
            while (ptr < len) {
                var data = this.writer.BaseStream.ReadByte();
                if (data == -1 || data == until) {
                    break;
                }
                result.Add((byte)data);
            }

            return result.ToArray();
        }

        public long write(byte[] value) {
            this.writer.BaseStream.Seek(0, SeekOrigin.End);
            var writePos = this.pos;
            this.writer.Write(value, 0, value.Length);
            this.usedBytes += (value.Length);
            this.writer.Flush();
#if DEBUG
            Console.WriteLine($"{value.Length} bytes written at {this.writer.BaseStream.Position - value.Length} to {this.writer.BaseStream.Position}");
#endif

            return writePos;
        }

        public void dispose() {
            this.writer.Close();
        }

        public void delete() {
#if DEBUG
            Console.WriteLine($"Deleting page {this.path}");
#endif
            this.writer.Dispose();
            File.Delete(this.path);
        }
    }
}
