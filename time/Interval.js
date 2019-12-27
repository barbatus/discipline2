import { Platform } from 'react-native';
import EventEmitter from 'eventemitter3';
import BackgroundTimer from 'react-native-background-timer';

function setIntervalInner(onInterval, timeIntMs) {
  return BackgroundTimer.setInterval(onInterval, timeIntMs);
}

function clearIntervalInner(hInterval) {
  BackgroundTimer.clearInterval(hInterval);
}

export default class Interval extends EventEmitter {
  timeMs = 0;

  lastStartMS = 0;

  timeIntMs = 0;

  hInterval = null;

  constructor(initValue: number, timeIntMs: number = 0) {
    super();
    this.timeMs = initValue;
    this.timeIntMs = timeIntMs;
  }

  get value() {
    return this.timeMs + this.lastStartMS;
  }

  start(startFromMs: number = 0): boolean {
    if (this.hInterval) return false;

    this.lastStartMS = startFromMs;
    const onInterval = () => {
      this.lastStartMS += this.timeIntMs;
      this.emit('tick', this.timeMs + this.lastStartMS, this.lastStartMS);
    };

    this.hInterval = setIntervalInner(onInterval, this.timeIntMs);
    return true;
  }

  stop() {
    this.timeMs = this.timeMs + this.lastStartMS;
    clearIntervalInner(this.hInterval);
    this.hInterval = null;
  }

  on(cb: Function, context: any) {
    super.on('tick', cb, context);
  }

  off(cb: Function, context: any) {
    super.off('tick', cb, context);
  }

  dispose() {
    clearIntervalInner(this.hInterval);
    this.hInterval = null;
    this.removeAllListeners('tick');
  }
}
