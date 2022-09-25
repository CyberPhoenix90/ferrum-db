import { BinaryWriter, Encoding } from 'csharp-binary-stream';
import { Socket } from 'net';
import { ApiMessageType } from './protcol';
import { getBinaryReader, handleErrorResponse } from './utils';

const MAX_BUFFER_SIZE = 512 * 1024 * 1024;
export class FerrumServerClient {
    protected id: number = 0;
    public socket: Socket;
    protected pending: Map<number, (buffer: Buffer) => void>;
    private lengthBuffer: Buffer;
    private heartBeatPending: boolean = false;
    public disposed: boolean;
    private lastResponse: number = Date.now();
    private heartBeatInterval: NodeJS.Timeout;
    private ip: string;
    private port: number;
    private hearBeatTimeout: number;

    constructor(socket: Socket, heartBeatTimeout: number) {
        this.initialize(socket);
        this.hearBeatTimeout = heartBeatTimeout;
        this.heartBeatInterval = setInterval(() => {
            this.heartbeat();
        }, Math.ceil(this.hearBeatTimeout / 2.5));
    }

    private initialize(socket: Socket) {
        this.socket = socket;
        this.ip = socket.remoteAddress;
        this.port = socket.remotePort;
        this.lengthBuffer = Buffer.alloc(4);
        this.socket = socket;
        this.pending = new Map();
        this.disposed = false;
        let msgBuffer = Buffer.alloc(1048576);
        let reading = false;
        let msgSize = 0;
        let msgRemaining = 0;
        let writeOffset = 0;
        let readOffset = 0;

        socket.on('close', () => {
            if (!this.disposed) {
                setTimeout(() => {
                    this.reconnect();
                }, 400);
            }
        });

        this.socket.on('data', (data: Buffer) => {
            this.lastResponse = Date.now();
            while (readOffset < data.length) {
                if (reading === false) {
                    msgSize = msgRemaining = data.readInt32LE(readOffset);
                    readOffset += 4;
                    reading = true;
                    writeOffset = 0;
                } else {
                    const toRead = Math.min(data.length - readOffset, msgRemaining);
                    while (toRead + writeOffset > msgBuffer.length) {
                        msgBuffer = this.expandBuffer(msgBuffer, MAX_BUFFER_SIZE);
                    }
                    data.copy(msgBuffer, writeOffset, readOffset, readOffset + toRead);
                    msgRemaining -= toRead;
                    writeOffset += toRead;
                    readOffset += toRead;
                }

                if (msgRemaining < 0) {
                    throw new Error('Illegal state');
                }

                if (readOffset > data.length) {
                    throw new Error('Illegal state');
                }

                if (reading && msgRemaining === 0) {
                    reading = false;
                    writeOffset = 0;
                    const id = msgBuffer.readUInt32LE();
                    if (this.pending.has(id)) {
                        this.pending.get(id)(Buffer.from(msgBuffer.slice(4, msgSize)));
                        this.pending.delete(id);
                    }
                }
            }
            readOffset = 0;
        });
    }

    public reconnect(): void {
        this.disposed = false;
        this.heartBeatPending = false;
        if (!this.heartBeatInterval) {
            this.heartBeatInterval = setInterval(() => {
                this.heartbeat();
            }, 2000);
        }

        for (const pendingId of this.pending.keys()) {
            const pending = this.pending.get(pendingId);
            const error = new BinaryWriter();
            error.writeBoolean(false);
            error.writeString('Connection lost', Encoding.Utf8);
            pending(Buffer.from(error.toUint8Array()));
        }
        this.socket.connect(this.port, this.ip, () => {
            this.lastResponse = Date.now();
        });
    }

    public disconnect(): void {
        clearInterval(this.heartBeatInterval);
        this.heartBeatInterval = undefined;
        this.disposed = true;
        this.socket.destroy();
    }

    public async heartbeat(): Promise<void> {
        if (Date.now() - this.lastResponse > this.hearBeatTimeout) {
            this.socket.destroy(new Error('Heartbeat timeout'));
            return;
        }

        if (this.heartBeatPending) {
            return;
        }
        this.heartBeatPending = true;

        const { bw, myId } = this.getSendWriter(ApiMessageType.HEARTBEAT, 0);
        this.sendMsg(bw);

        const response = await this.getResponse(myId);
        this.heartBeatPending = false;
        const br = getBinaryReader(response);

        const success = br.readBoolean();
        if (!success) {
            return handleErrorResponse(br);
        }
    }

    private expandBuffer(buffer: Buffer, maxSize: number): Buffer {
        if (buffer.length * 2 < maxSize) {
            const newBuffer = Buffer.alloc(buffer.length * 2);
            buffer.copy(newBuffer);
            return newBuffer;
        } else {
            throw new Error('Buffer overflow');
        }
    }

    public getSendWriter(messageType: ApiMessageType, payloadSize: number): { bw: BinaryWriter; myId: number } {
        const buffer = Buffer.alloc(payloadSize + 24);

        //Hack to skip the constructor of BinaryWriter because it does unecessairy and expensive copying
        const bw = new BinaryWriter();
        //@ts-ignore
        bw._buffer = buffer;
        //@ts-ignore
        bw._length = buffer.length;
        //@ts-ignore
        bw._position = 0;

        const myId = this.id++;
        bw.writeInt(messageType);
        bw.writeUnsignedInt(myId);
        return { bw, myId };
    }

    public sendMsg(bw: BinaryWriter): void {
        this.lengthBuffer.writeInt32LE(bw.position);
        this.socket.write(this.lengthBuffer);
        //@ts-ignore
        this.socket.write(bw._buffer.slice(0, bw.position));
    }

    public getResponse(myId: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout waiting for database response'));
            }, 90000);

            this.pending.set(myId, (buffer) => {
                clearTimeout(timeout);
                resolve(buffer);
            });
        });
    }
}
