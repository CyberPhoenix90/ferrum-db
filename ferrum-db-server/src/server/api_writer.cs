using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace ferrum_db_server.src.server {
    public class APIWriter {
        public static BinaryWriter startSend() {
            var ms = new MemoryStream(256);
            var s = new BinaryWriter(ms);
            return s;
        }

        public static void endSend(NetworkStream client, BinaryWriter s) {
            try {
                var buffer = ((MemoryStream)s.BaseStream).GetBuffer();
                client.Write(BitConverter.GetBytes(buffer.Length));
                client.Write(buffer);
#if DEBUG
                Console.WriteLine($"Sent {buffer.Length} bytes");
#endif
            }
            catch (Exception) {
            }
        }

        public static void sendLong(NetworkStream client, uint id, long value) {
            var s = APIWriter.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(value);
            APIWriter.endSend(client, s);
        }

        public static void sendInt(NetworkStream client, uint id, int value) {
            var s = APIWriter.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(value);
            APIWriter.endSend(client, s);
        }

        public static void sendError(NetworkStream client, uint id, Exception e) {
            var s = APIWriter.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ERROR for ID ${id}");
#endif
            Console.WriteLine(e.Message);
            Console.WriteLine(e.StackTrace);

            s.Write(false);
            s.Write(e.Message + '\n' + e.StackTrace);
            APIWriter.endSend(client, s);
        }

        public static void sendOk(NetworkStream client, uint id) {
            var s = APIWriter.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending ACK for ID ${id}");
#endif
            s.Write(true);
            APIWriter.endSend(client, s);
        }

        public static void sendList(NetworkStream client, uint id, List<long> list) {
            var s = APIWriter.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(list.Count);
            foreach (var item in list) {
                s.Write(item);
            }
            APIWriter.endSend(client, s);
        }

        public static void sendList(NetworkStream client, uint id, long[] list) {
            var s = APIWriter.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(list.Length);
            foreach (var item in list) {
                s.Write(item);
            }
            APIWriter.endSend(client, s);
        }

        public static void sendList(NetworkStream client, uint id, string[] list) {
            var s = APIWriter.startSend();
            s.Write(id);
            s.Write(true);
            s.Write(list.Length);
            foreach (var item in list) {
                s.Write(item);
            }
            APIWriter.endSend(client, s);
        }

        public static void sendList(NetworkStream client, uint id, List<byte[]> list) {
            var s = APIWriter.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending {list.Count} binary items for ID ${id}");
#endif
            s.Write(true);
            s.Write(list.Count);
            foreach (var item in list) {
                if (item == null) {
                    s.Write(0);
                }
                else {
                    s.Write(item.Length);
                    s.Write(item);

                }
            }
            APIWriter.endSend(client, s);
        }

        public static void sendBinary(NetworkStream client, uint id, byte[] data) {
            var s = APIWriter.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending binary for ID ${id}");
#endif
            s.Write(true);
            if (data == null) {
                s.Write(0);
            }
            else {
                s.Write(data.Length);
                s.Write(data);
            }
            APIWriter.endSend(client, s);
        }

        public static void sendBool(NetworkStream client, uint id, bool state) {
            var s = APIWriter.startSend();
            s.Write(id);
#if DEBUG
            Console.WriteLine($"Sending bool for ID ${id}");
#endif
            s.Write(true);
            s.Write(state);
            APIWriter.endSend(client, s);
        }

    }
}