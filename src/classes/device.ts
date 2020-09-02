import { Command } from './command';
import { devicesConfig } from '../configs/devices-config';
import { Line } from './line';
import { DevCfgModel } from '../models';

export class Device {

  public readonly addr: number;
  public readonly name: string;
  private readonly proto: DevCfgModel;
  private readonly line: Line;

  constructor(conf, lines) {
    this.addr = conf.addr || 1;
    this.name = conf.name || 'Device ' + this.addr;
    this.proto = devicesConfig.find((item) => conf.type === item.type);
    this.line = lines[conf.line || 0];
  }

  read(inputs) {
    return this.proto.commands
      .filter(protoCmd => protoCmd.role === 'ReadCurData')
      .map(protoCmd => new Command(protoCmd, this.addr))
      .map(cmd => this.line.execute(cmd));
  }
}
