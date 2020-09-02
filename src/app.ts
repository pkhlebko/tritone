 import { Line } from './classes/line';
import { Device } from './classes/device';
import { appConfig } from './configs/config';
import { TcpServer } from "./classes/tcp-server";

const driver = {
  lines: [],
  devices: []
};

driver.lines = appConfig.lines.map(item => new Line(item));

driver.devices = appConfig.devices.map(item => new Device(item, driver.lines));

/* Promise.all(driver.devices[0].read(['ia01', 'ia03'])).then(values => {
  console.log(values);
});
 */

const tcpServer = new TcpServer(2222);

tcpServer.start();
setTimeout(() => tcpServer.stop(), 5000000);