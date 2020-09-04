import { Line } from './classes/line';
import { Device } from './classes/device';
import { appConfig } from './configs/config';
import { Driver } from './classes/driver';
import { Observable } from 'rxjs';

const driver = new Driver(appConfig);

/* setTimeout(() => driver.stop(), 5000000); */
