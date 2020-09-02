import { Line } from './classes/line.js';
import { Device } from './classes/device.js';
import { appConfig } from './configs/config.js';

const driver = {
  lines: [],
  devices: []
};

driver.lines = appConfig.lines.map(item => new Line(item));

driver.devices = appConfig.devices.map(item => new Device(item, driver.lines));

Promise.all(driver.devices[0].read(['ia01', 'ia03'])).then(values => {
  console.log(values);
});