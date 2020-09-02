"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const command_1 = require("./command");
const devices_config_1 = require("../configs/devices-config");
class Device {
    constructor(conf, lines) {
        this.addr = conf.addr || 1;
        this.name = conf.name || 'Device ' + this.addr;
        this.proto = devices_config_1.devicesConfig.find(function (item) {
            return conf.type === item.type;
        });
        this.line = lines[conf.line || 0];
    }
    read(inputs) {
        return this.proto.commands
            .filter(cmd => cmd.role === 'ReadCurData')
            .map(cmd => new command_1.Command(cmd, this.addr))
            .map(cmd => this.line.execute(cmd))
            .map(cmd => {
            return cmd.result
                .then(res => cmd.processResponse(res, inputs));
        });
    }
}
exports.Device = Device;
//# sourceMappingURL=device.js.map