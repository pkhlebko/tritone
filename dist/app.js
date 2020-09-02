"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const line_1 = require("./classes/line");
const device_1 = require("./classes/device");
const config_1 = require("./configs/config");
const tcp_server_1 = require("./classes/tcp-server");
const driver = {
    lines: [],
    devices: []
};
driver.lines = config_1.appConfig.lines.map(item => new line_1.Line(item));
driver.devices = config_1.appConfig.devices.map(item => new device_1.Device(item, driver.lines));
/* Promise.all(driver.devices[0].read(['ia01', 'ia03'])).then(values => {
  console.log(values);
});
 */
const tcpServer = new tcp_server_1.TcpServer(2222);
tcpServer.start();
setTimeout(() => tcpServer.stop(), 5000000);
//# sourceMappingURL=app.js.map