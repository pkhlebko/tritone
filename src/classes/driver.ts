import { Line } from "./line";
import { Device } from "./device";

export class Driver {

  private lines: Line[];
  private devices: Device[];

  constructor(config) {
    this.lines = config.lines.map(item => new Line(item));
    this.devices = config.devices.map(item => new Device(item, this.lines));
    // setInterval(() => console.log('Hartbeat'), 1000);
  }

  start() {

  }

  stop() {
    this.lines.forEach((line) => line.destructor());
  }

}
