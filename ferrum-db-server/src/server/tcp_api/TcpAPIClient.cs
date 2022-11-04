using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;
using ferrum_db;
using ferrum_db_server.src.server.protocol;

namespace ferrum_db_server.src.server {
    public class TcpAPIClient {
        public readonly string id;
        public delegate void IoEvent(FerrumDb ferrumDb);
        private TcpClient client;
        private AutoResetEvent ioEvents;
        private Action<Message, NetworkStream, FerrumDb> handleCommand;

        public DateTimeOffset connectedSince;
        public int messagesReceived { get; private set; }
        public int messagesPerMinute { get; private set; }
        private readonly ConcurrentQueue<IoEvent> ioEventCallbacks;

        public TcpAPIClient(string id, TcpClient client, ConcurrentQueue<IoEvent> ioEventCallbacks, AutoResetEvent ioEvents, Action<Message, NetworkStream, FerrumDb> handleCommand) {
            this.client = client;
            this.messagesReceived = 0;
            this.messagesPerMinute = 0;
            this.ioEventCallbacks = ioEventCallbacks;
            this.ioEvents = ioEvents;
            this.handleCommand = handleCommand;
            this.id = id;
            this.connectedSince = DateTimeOffset.Now;
        }

        public void Process() {
            byte[] sizeBytes = new byte[4];
            byte[] buffer = new byte[1048576];
            client.ReceiveBufferSize = 1048576;
            var stream = client.GetStream();
            int immutableSize;
            var msgPerMinuteBuffer = 0;
            var time = DateTime.Now;
            while (client.Connected) {
                try {
                    if (!client.Connected) {
                        Logger.Info("Client disconnected");
                        break;
                    }

                    var read = stream.Read(sizeBytes, 0, 4);
                    var size = BitConverter.ToInt32(sizeBytes, 0);
                    immutableSize = size;

                    if (size < 0) {
                        Logger.Error("Invalid size. Potentially corrupt data");
                        break;
                    }

                    if (size > 1048576 * 512) {
                        Logger.Error($"Error: Msg Buffer overflow. Max Size : 512MB. Size: {size / 1048576} MB");
                        break;
                    }
                    else if (size > buffer.Length) {
                        buffer = new byte[size];
                    }
                    if (read == 0) {
                        Logger.Error("Client disconnected. No data read");
                        break;
                    }
                    var offset = 0;
                    while (size > 0 && (read = stream.Read(buffer, offset, size)) > 0) {
                        offset += read;
                        size -= read;
                    }
                    if (size != 0) {
                        Logger.Error("Client disconnected. Not all data received");
                        break;
                    }
                }
                catch (Exception e) {
                    Logger.Error("Exception in network thread", e);
                    break;
                }

                var command = MessageDecoder.decode(buffer);
                this.messagesReceived++;
                msgPerMinuteBuffer++;

                if (DateTime.Now.Subtract(time).TotalSeconds > 60) {
                    this.messagesPerMinute = msgPerMinuteBuffer;
                    msgPerMinuteBuffer = 0;
                    time = DateTime.Now;
                }

                if (command != null) {
                    this.ioEventCallbacks.Enqueue((FerrumDb ferrumDb) => {
                        this.handleCommand(command, stream, ferrumDb);
                    });
                    ioEvents.Set();
                }
            }
        }

        public void Kick() {
            this.client.Close();
        }


    }
}