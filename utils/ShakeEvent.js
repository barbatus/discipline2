import EventEmitter from 'eventemitter3';
import { accelerometer, SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';

import { noop } from 'app/utils/lang';

const SHAKE_THRESHOLD = 5.5;
const MIN_TIME_BETWEEN_SHAKES_MS = 1000;
setUpdateIntervalForType(SensorTypes.accelerometer, 100);

export class ShakeEvent extends EventEmitter {
  lastShakeMs = Date.now();

  subscription = null;

  constructor() {
    super();
    this.subscribe();
  }

  on(callback) {
    super.on('shake', callback);
  }

  off(callback) {
    super.off('shake', callback);
  }

  dispose() {
    this.subscription.unsubscribe();
    this.removeAllListeners('shake');
  }

  subscribe() {
    let px = 0, py = 0, pz = 0;
    this.subscription = accelerometer.subscribe(({ x, y, z }) => {
      const acceleration = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2) + Math.pow(z - pz, 2));
      px = x, py = y, px = z;
      if (acceleration > SHAKE_THRESHOLD &&
          Date.now() - this.lastShakeMs > MIN_TIME_BETWEEN_SHAKES_MS) {
        this.lastShakeMs = Date.now();
        this.emit('shake');
      }
    }, noop);
  }
}

export default new ShakeEvent();
