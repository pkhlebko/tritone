import SerialPort from 'serialport';
import ByteLength from '@serialport/parser-byte-length';
import { Command } from './command';

export class Line {

  private port: string|number;
  private speed: number;
  private timeOut: number;
  public readonly name: string;

  constructor(conf) {
    this.port = conf.port || 'COM1';
    this.speed = conf.speed || 19200;
    this.timeOut = conf.timeOut || 250;
    this.name = conf.line || this.port;
  }

  execute(cmd: Command) {
    return this.isIp(this.port) ? this.ipExecute(cmd) : this.serialExecute(cmd);
  }

  private serialExecute(cmd: Command) {
    const portOpenOptions = {autoOpen: false, baudRate: this.speed};
    const port = new SerialPort(this.port as string, portOpenOptions);

    cmd.result = new Promise((resolve, reject) => {
      let timeOutId;

      const errorHandler = (err) => {
        if (err) {
          reject(err.message);
        }
      };

      const resultHandler = (result) => {
        clearTimeout(timeOutId);
        port.close(errorHandler);
        resolve(result);
      };

      const parser = port.pipe(new ByteLength({ length: cmd.resp.length }));

      port.open(errorHandler);
      parser.on('data', resultHandler);
      port.write(cmd.reqBuffer, errorHandler);
      timeOutId = setTimeout(resultHandler, this.timeOut);
    });

    return cmd;
  }

  private ipExecute(cmd: Command) {
    return cmd;
  }

  private isIp(port: string|number) {
    return isNaN(parseInt(port.toString(), 10));
  }

}
