import SerialPort from 'serialport';
import ByteLength from '@serialport/parser-byte-length';
import { Command } from './command';
import { Observable, of, } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { TcpServer, ServerEvent } from './tcp-server';
import colors from 'colors';

export class Line {

  private port: string|number;
  private speed: number;
  private timeOut: number;
  private ipLine: boolean;
  private tcpServer?: TcpServer;
  public readonly name: string;
  private flowMode: boolean;
  private enabled: boolean;
  private serverEvents$: Observable<ServerEvent>;

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
      this.serverEvents$ = this.tcpServer.start();

      const onServerEvent = this.onServerEvent.bind(this);
      const onServerError = this.onServerError.bind(this)
      const onServerComplete = this.onServerError.bind(this);

      this.serverEvents$.pipe(
        catchError((err) => of({type: 'info', body: err}))
      ).subscribe({
        next: onServerEvent,
        error: onServerError,
        complete: onServerComplete
      });
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

  private onServerEvent(event: ServerEvent) {
    const {type, body} = event;
    const isData = type === 'data';
    const typeColor = isData ? colors.green : colors.blue;
    const text: string = isData ? Uint8Array.from(body as Buffer).join('-') : body as string;

    console.info(typeColor(type), this.getCurrentTime(), colors.gray(text));
  }

  private onServerError(err: Error) {
    if (err) {
      console.error(this.getCurrentTime(), colors.red(err.stack || err.message));
    }
  }

  private onServerComplete() {
    console.info(this.getCurrentTime(), colors.yellow(`Server is down`));
  }

  private isIp(port: string|number) {
    return !isNaN(parseInt(port.toString(), 10));
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
    this.tcpServer.writeData(cmd.reqBuffer);
    return of(new Buffer(''));
  }

  private getCurrentTime(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    return colors.white(`${hours}:${minutes}:${seconds}`);
  }

}
