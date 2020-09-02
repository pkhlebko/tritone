import crc from 'crc';

export class Command {

  private resp;
  private addr;
  private reqBuffer;
  private result;

  constructor(cmd, addr, attr1?, attr2?) {
    this.resp = cmd.resp;
    this.addr = addr;
    this.reqBuffer = reqToBuffer(cmd.req, addr, attr1, attr2);
    this.result = undefined;
  }

  processResponse(resp, inputs) {
    const inputToValue = (input) => {
      const inputConf = this.resp.in.find(val => val.source === input);

      return {
        input: input,
        value: extractValue(resp, inputConf.type, inputConf.byte)
      };
    };

    if (resp) {
      if (!validateAddr(resp, this.addr, this.resp.addrOffset)) {
        return 'wrong addr';
      }
      if (!validateCrc(resp, this.resp.crcOffset)) {
        return 'wrong crc';
      }

      return inputs.map(inputToValue);
    } else {
      return null;
    }
  }
}

function reqToBuffer(req, addr, attr1, attr2) {
  const arr = new Uint8Array(req.length);
  const buf = Buffer.allocUnsafe(req.length);

  let crcBuffer;
  let attr1Buffer;

  const getCrcByte = function(array, index, byteNum) {
    if (!crcBuffer) {
      crcBuffer = Buffer.allocUnsafe(2);
      crcBuffer.writeInt16LE(crc.crc16modbus(array.slice(0, index)), 0);
    }

    return crcBuffer.readUInt8(byteNum);
  };

  const getAttr1Byte = function(attr1, byteNum) {
    if (!attr1Buffer) {
      attr1Buffer = Buffer.allocUnsafe(2);
      attr1Buffer.writeInt16LE(attr1, 0);
    }

    return crcBuffer.readUInt8(byteNum);
  };

  const toByte = function(val, i) {
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

function extractValue(buf, type, offset) {
  switch (type) {

    case 'UInt16': return buf.readInt16BE(offset);
    default: return null;

  }
}

function validateAddr(buf, addr, offset) {
  return addr === buf.readInt8(offset);
}

function validateCrc(buf, offset) {
  return crc.crc16modbus(buf.slice(0, offset)) === buf.readInt16LE(offset);
}
