"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const serialport_1 = __importDefault(require("serialport"));
const parser_byte_length_1 = __importDefault(require("@serialport/parser-byte-length"));
class Line {
    constructor(conf) {
        this.port = conf.port || 'COM1';
        this.speed = conf.speed || 19200;
        this.timeOut = conf.timeOut || 250;
        this.name = conf.line || this.port;
    }
    execute(cmd) {
        const port = new serialport_1.default(this.port, {
            autoOpen: false,
            baudRate: this.speed
        });
        cmd.result = new Promise((resolve, reject) => {
            let timeOutId;
            const errorHandler = function (err) {
                if (err) {
                    reject(err.message);
                }
            };
            const resultHandler = function (result) {
                clearTimeout(timeOutId);
                port.close(errorHandler);
                resolve(result);
            };
            const parser = port.pipe(new parser_byte_length_1.default({ length: cmd.resp.length }));
            port.open(errorHandler);
            parser.on('data', resultHandler);
            port.write(cmd.reqBuffer, errorHandler);
            timeOutId = setTimeout(resultHandler, this.timeOut);
        });
        return cmd;
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map