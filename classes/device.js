import { Command } from './command.js';
import { devicesConfig } from '../configs/devices-config.js';

export class Device {

  constructor(conf, lines) {
    this.addr = conf.addr || 1;
    this.name = conf.name || 'Device ' + this.addr;
    this.proto = devicesConfig.find(function(item) {
      return conf.type === item.type;
    });
    this.line = lines[conf.line || 0];
  }

  read(inputs) {
    return this.proto.commands
      .filter(cmd => cmd.role === 'ReadCurData')
      .map(cmd => new Command(cmd, this.addr))
      .map(cmd => this.line.execute(cmd))
      .map(cmd => {
        return cmd.result
          .then(res => cmd.processResponse(res, inputs));
      });
  }
}
