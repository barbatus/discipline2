import EventEmitter from 'eventemitter3';
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

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
    this.subscription = accelerometer.subscribe(({ x, y, z }) => {
      const acceleration = Math.sqrt(
        Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2),
      );
      if (
        acceleration > SHAKE_THRESHOLD &&
        Date.now() - this.lastShakeMs > MIN_TIME_BETWEEN_SHAKES_MS
      ) {
        this.lastShakeMs = Date.now();
        this.emit('shake');
      }
    }, noop);
  }
}

export default new ShakeEvent();
