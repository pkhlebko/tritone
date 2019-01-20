const Line = require('./classes/line');
const Device = require('./classes/device');

const config = require('./configs/config');

const driver = {
  lines: [],
  devices: []
};

driver.lines = config.lines.map(item => new Line(item));

driver.devices = config.devices.map(item => new Device(item, driver.lines));

Promise.all(driver.devices[0].read(['ia01', 'ia03'])).then(values => {
  console.log(values);
});