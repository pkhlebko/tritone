import SerialPort from 'serialport';
import ByteLength from '@serialport/parser-byte-length';
import { Command } from './command';
import { Observable, of } from 'rxjs';
import { TcpServer } from './tcp-server';

export class Line {

  private port: string|number;
  private speed: number;
  private timeOut: number;
  private ipLine: boolean;
  private tcpServer?: TcpServer;
  public readonly name: string;
  private flowMode: boolean;
  private enabled: boolean;

  constructor(conf) {
    this.port = conf.port || 'COM1';
    this.speed = conf.speed || 19200;
    this.timeOut = conf.timeOut || 250;
    this.name = conf.line || this.port;
    this.ipLine = this.isIp(this.port);
    this.flowMode = conf.flowMode || false;
    this.enabled = conf.enabled || true;

    if (this.ipLine && this.enabled) {
      this.tcpServer = new TcpServer(this.port);
      this.tcpServer.start;
    }
  }

  async destructor() {
    if (this.tcpServer) {
      await this.tcpServer.stop();
      this.tcpServer = undefined;
    }
  }

  execute(cmd: Command): Observable<Buffer> {
    return this.ipLine ? this.ipExecute(cmd) : this.serialExecute(cmd);
  }

  private isIp(port: string|number) {
    return isNaN(parseInt(port.toString(), 10));
  }

  private serialExecute(cmd: Command): Observable<Buffer> {
    const portOpenOptions = {autoOpen: false, baudRate: this.speed};
    const port = new SerialPort(this.port as string, portOpenOptions);

    return new Observable((subscriber) => {
      let timeOutId;

      const errorHandler = (err) => {
        if (err) {
          subscriber.error(err.message);
        }
      };

      const resultHandler = (result) => {
        clearTimeout(timeOutId);
        port.close(errorHandler);
        subscriber.next(result);
      };

      const parser = port.pipe(new ByteLength({ length: cmd.respConfig.length }));

      port.open(errorHandler);
      parser.on('data', resultHandler);
      port.write(cmd.reqBuffer, errorHandler);
      timeOutId = setTimeout(resultHandler, this.timeOut);
    });
  }

  private ipExecute(cmd: Command): Observable<Buffer> {
    this.tcpServer.requestData(cmd.reqBuffer);
    return of(new Buffer(''));
  }


}
