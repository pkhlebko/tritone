import crc from 'crc';
import { DevCmdCfgModel, DevCfgRespModel } from '../models';

export class Command {

  public readonly addr: number;
  public readonly reqBuffer: Buffer;
  public readonly resp: DevCfgRespModel|DevCfgRespModel[];
  public result;

  constructor(cmd: DevCmdCfgModel, addr: number, attr1?: string, attr2?: string) {
    this.addr = addr;
    this.resp = cmd.resp;
    this.reqBuffer = this.reqToBuffer(cmd.req, addr, attr1, attr2);
    this.result = undefined;
  }

  private processResponse(cmd: Command, inputs) {
/*     const { addr, resp } = cmd;

    const inputToValue = (input) => {
      const inputConf = resp.in.find(val => val.source === input);

      return {
        input: input,
        value: this.extractValue(resp, inputConf.type, inputConf.byte)
      };
    };

    if (resp) {
      if (!this.validateAddr(resp, addr, resp.addrOffset)) {
        return 'wrong addr';
      }
      if (!this.validateCrc(resp, resp.crcOffset)) {
        return 'wrong crc';
      }

      return inputs.map(inputToValue);
    } else {
      return null;
    } */
  }

  private reqToBuffer(req, addr, attr1, attr2) {
    const arr = new Uint8Array(req.length);
    const buf = Buffer.allocUnsafe(req.length);

    let crcBuffer;
    let attr1Buffer;

    const getCrcByte = function (array, index, byteNum) {
      if (!crcBuffer) {
        crcBuffer = Buffer.allocUnsafe(2);
        crcBuffer.writeInt16LE(crc.crc16modbus(array.slice(0, index)), 0);
      }

      return crcBuffer.readUInt8(byteNum);
    };

    const getAttr1Byte = function (attr1, byteNum) {
      if (!attr1Buffer) {
        attr1Buffer = Buffer.allocUnsafe(2);
        attr1Buffer.writeInt16LE(attr1, 0);
      }

      return crcBuffer.readUInt8(byteNum);
    };

    const toByte = function (val, i) {
      switch (val) {

        case 'addr': return addr;
        case 'attr1': return attr1;
        case 'attr1b1': return getAttr1Byte(attr1, 0);
        case 'attr1b2': return getAttr1Byte(attr1, 1);
        case 'attr2': return attr2;
        case 'crcb1': return getCrcByte(arr, i, 0);
        case 'crcb2': return getCrcByte(arr, i, 1);
        default: return val;

      }
    };

    for (let i = 0; i < req.length; i++) {
      arr[i] = toByte(req[i], i);
      buf.writeUInt8(arr[i], i);
    }

    return buf;
  }

  private extractValue(buf, type, offset) {
    switch (type) {

      case 'UInt16': return buf.readInt16BE(offset);
      default: return null;

    }
  }

  private validateAddr(buf, addr, offset) {
    return addr === buf.readInt8(offset);
  }

  private validateCrc(buf, offset) {
    return crc.crc16modbus(buf.slice(0, offset)) === buf.readInt16LE(offset);
  }

}




