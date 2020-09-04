import { Server, Socket, AddressInfo } from 'net';
import colors from 'colors';
import { Observable, Subscriber, observable } from 'rxjs';

const socketTimeout = 800000;
const socketDestroyTimeout = 1200000;

export interface ServerEvent {
  type: 'info'|'data';
  body: string|Buffer;
}

export class TcpServer {

  private port: number;
  private server: Server;
  private socket: Socket;
  private keepAlive: number = 10000;
  private keepAliveTimer;

  constructor(port) {
    this.port = parseInt(port, 10) || 2222;
  }

  start() {
    return new Observable<ServerEvent>((observer) => {
      this.server = new Server();

      this.server.on('connection', (socket) => this.onServerConnection(socket, observer));
      this.server.on('close', () => this.emitInfo(observer, 'close'));//observer.complete());
      this.server.on('error', (err) => observer.error(err));
      this.server.maxConnections = 1;
      this.server.listen(this.port, () => this.onServerListen(this.server, observer));
      //this.server.getConnections((error: Error, count: number) => this.emitInfo(observer, `Number of connections to the server: ${count}`));
    });
  }

  stop() {
    return new Promise((resolve, reject) => this.server.close((err) => err ? reject(err) : resolve()));
  }

  writeData(data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        const isKernelBufferFull = this.socket.write(data, () => resolve(true));

        if (!isKernelBufferFull) {
          this.socket.pause();
        }
      }
    });
  }

  private async setKeepAliveTimer(observer: Subscriber<ServerEvent>) {
    if (this.socket) {
      await this.writeData(Buffer.from([0x0, 0x0]));
      this.emitInfo(observer, 'Keep alive ping');

      if (this.keepAliveTimer) {
        clearTimeout(this.keepAliveTimer);
      }

      this.keepAliveTimer = setTimeout(()=> this.setKeepAliveTimer(observer), this.keepAlive);
    }
  }

  private onServerConnection(socket: Socket, observer: Subscriber<ServerEvent>) {
    const { remotePort, remoteAddress, remoteFamily } = socket;

    this.socket = socket;
    this.emitInfo(observer, `Client is listening at ${remoteAddress}:${remotePort} ${remoteFamily}`);

    socket.setEncoding('hex');
    socket.setTimeout(socketTimeout);

    if (this.keepAlive > 0) {
      this.setKeepAliveTimer(observer);
    }

    socket.on('data', (body) => this.emitData(observer, body));
    socket.on('error', (err) => observer.error(err));
    socket.on('timeout', () => {socket.end('Timed out!'); observer.error('timeout');});
    socket.on('drain', () => this.socket.resume());
    socket.on('end', (data) => observer.next({type: 'info', body: `Socket closed from other end! End data: ${data}`}));
    socket.on('close', () => {
      this.emitInfo(observer, `Socket closed | read: ${socket.bytesRead} | written: ${socket.bytesWritten}`);
      this.socket = undefined;
    });

    setTimeout(() => {
      this.socket.destroy();
      this.socket = undefined;
    }, socketDestroyTimeout);
  }

  private onServerListen(server: Server, observer: Subscriber<ServerEvent>) {
    const {port, family, address} = server.address() as AddressInfo;

    this.emitInfo(observer, `Server on ${address}:${port} ${family}`);
  }

  private emitData(observer: Subscriber<ServerEvent>, body: Buffer) {
    return observer.next({type: 'data', body});
  }

  private emitInfo(observer: Subscriber<ServerEvent>, body: string) {
    return observer.next({type: 'info', body});
  }

}
