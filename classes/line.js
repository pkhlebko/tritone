import SerialPort from 'serialport';
import ByteLength from '@serialport/parser-byte-length';

export class Line {

  constructor(conf) {
    this.port = conf.port || 'COM1';
    this.speed = conf.speed || 19200;
    this.timeOut = conf.timeOut || 250;
    this.name = conf.line || this.port;
  }

  execute(cmd) {
    const port = new SerialPort(this.port, {
      autoOpen: false,
      baudRate: this.speed
    });

    cmd.result = new Promise((resolve, reject) => {
      let timeOutId;

      const errorHandler = function(err) {
        if (err) {
          reject(err.message);
        }
      };

      const resultHandler = function(result) {
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
}
