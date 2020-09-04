import { Server, Socket } from 'net';
import colors from 'colors';
import { Subject, Observable, observable } from 'rxjs';

const socketTimeout = 800000;
const socketDestroyTimeout = 1200000;

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

    const server = new Server((socket) => {
      socket.end('goodbye\n');
    }).on('error', (err) => {
      // Handle errors here.
      throw err;
    });

    // Grab an arbitrary unused port.
    server.listen(() => {
      console.log('opened server on', server.address());
    });

    this.server.maxConnections = 1;


    this.server.on('close', this.onServerClose); // emitted when server closes ...not emitted until all connections closes.
    this.server.on('connection', this.onConnection.bind(this)); // emitted when new client connects
    this.server.on('error', this.onError); // emits when any error occurs -> calls closed event immediately after this.
    //this.server.on('listening', this.onServerListening); // emits when server is bound with server.listen
    this.server.listen(this.port);
    this.data$ = new Subject<Buffer>();
    return this.data$;
  }

  stop() {
    this.data$.complete();
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
    socket.setTimeout(socketTimeout);

    const d$ = Observable.create((observer) => {
      socket.on('data', (val) => observer.next(val));
      socket.on('error', (err) => observer.error(err));
      socket.on('timeout', () => {
        socket.end('Timed out!');
        observer.error('timeout');
      });
    });

    // socket.on('data', this.onSocketData);
    socket.on('drain', this.onSocketDrain);
    // socket.on('timeout', this.onSoketTimeout);
    socket.on('end', this.onSoketEnd);
    socket.on('close', this.onSocketClose);


    setTimeout(this.onSocketDestroyTimeout.bind(this), socketDestroyTimeout);
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

/*   private onSocketData(data: Buffer) {
    const arrByte = Uint8Array.from(data);

    console.info(`<=: ${arrByte.join('-')}`);
    this.data$.next(data);
  } */
  private onSocketDrain() {
    console.info('write buffer is empty now .. u can resume the writable stream');
    this.socket.resume();
  }

  private onSocketDestroyTimeout() {
    console.info(`Socket destroyed: ${this.socket.destroyed}`);
    this.socket.destroy();
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
