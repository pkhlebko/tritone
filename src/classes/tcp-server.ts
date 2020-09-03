import { Server, AddressInfo, Socket } from 'net';
import colors from 'colors';
import { Subject } from 'rxjs';

export class TcpServer {

  private port: number;
  private server: Server;
  private socket: Socket;
  private data$: Subject<Buffer>;

  constructor(port) {
    this.port = parseInt(port, 10) || 2222;
  }

  start() {
    this.server = new Server();
    this.server.maxConnections = 1;
    this.server.on('close', this.onServerClose); // emitted when server closes ...not emitted until all connections closes.
    this.server.on('connection', this.onConnection.bind(this)); // emitted when new client connects
    this.server.on('error', this.onError); // emits when any error occurs -> calls closed event immediately after this.
    this.server.on('listening', this.onServerListening); // emits when server is bound with server.listen
    this.server.listen(this.port);
  }

  stop() {
    return new Promise((resolve, reject) => this.server.close((err) => err ? reject(err) : resolve()));
  }

  async requestData(request: Buffer) {
    await this.writeData(request);
    const data = await this.readData();
  }

  async readData() {

  }

  private writeData(data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket is empty');
      }

      const isKernelBufferFull = this.socket.write(data, () => {

      });

      if (isKernelBufferFull) {
        return true;
      } else {
        this.socket.pause();
      }
    });
  }

  private onConnection(socket: Socket) {
    const { localPort, localAddress, remotePort, remoteAddress, remoteFamily } = socket;

    console.info(colors.gray(`Server is listening at ${localAddress}:${localPort}`));
    console.info(colors.gray(`Remote socket is listening at ${remoteAddress}:${remotePort} ${remoteFamily}`));

    this.server.getConnections(this.onServerClientConnected);

    socket.setEncoding('hex');
    socket.setTimeout(800000);
    socket.on('data', this.onSocketData);
    socket.on('drain', this.onSocketDrain);
    socket.on('timeout', this.onSoketTimeout);
    socket.on('end', this.onSoketEnd);
    socket.on('close', this.onSocketClose);
    socket.on('error', this.onError);

    setTimeout(() => {
      console.info(`Socket destroyed: ${socket.destroyed}`);
      socket.destroy();
    }, 1200000);
  }

  private onServerClose() {
    console.info('Server closed!');
  }

  private onError(error: Error) {
    console.error(colors.red(error.stack || `Error: ${error.message}`));
  }

  private onSoketEnd(data) {
    console.info(`Socket ended from other end! End data: ${data}`);
  }

  private onSocketClose() {
    const { bytesRead, bytesWritten } = this.socket;
    console.info(colors.gray(`Bytes read: ${bytesRead} | Bytes written: ${bytesWritten} | Socket closed!`));
  }

  private onSoketTimeout() {
    console.log('Socket timed out!');
    this.socket.end('Timed out!');
  }

  private onSocketDrain() {
    console.info('write buffer is empty now .. u can resume the writable stream');
    this.socket.resume();
  }

  private onSocketData(data: Buffer) {
    const arrByte = Uint8Array.from(data);

    console.info(`<=: ${arrByte.join('-')}`);
  }

  socketWrite(data: Buffer) {
    const isKernelBufferFull = this.socket.write(data);

    if (isKernelBufferFull) {
      console.info('Data was flushed successfully from kernel buffer i.e written successfully!');
    } else {
      this.socket.pause();
    }
  }

  private onServerListening() {
    console.info('Server is listening!');
  }

  private onServerClientConnected(error: Error, count: number) {
    console.info(colors.yellow(`Number of concurrent connections to the server : ${count}`));
  }

}
