export type DevCmdMaskByte = string|number;

export interface DevCfgModel {
  type: string;
  commands: DevCmdCfgModel[];
}

export interface DevCmdCfgModel {
  role: string;
  name: string;
  req: DevCmdMaskByte[];
  resp: DevCfgRespModel|DevCfgRespModel[];
}

export interface DevCfgRespModel {
  type: 'buffer'|'msg';
  pattern?: DevCmdMaskByte[];
  text?: string;
  result?: boolean;
  length?: number,
  addrOffset?: number,
  crcOffset?: number,
  in?: DevCmdInputModel[];
}

export interface DevCmdInputModel {
  source: string;
  byte: number;
  type: 'Bool'|'Byte'|'UInt32'|'UInt16';
}