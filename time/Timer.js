import {Platform} from 'react-native';
import EventEmitter from 'eventemitter3';
import BackgroundTimer from 'react-native-background-timer';

function setIntervalInner(onInterval, timeIntMs) {
  if (Platform.OS === 'android') {
    return BackgroundTimer.setInterval(onInterval, timeIntMs);
  } else {
    return setInterval(onInterval, timeIntMs);
  }
}

function clearIntervalInner(hInterval) {
  if (Platform.OS === 'android') { 
    BackgroundTimer.clearInterval(hInterval);
  } else {
    clearInterval(hInterval);
  }
}

export default class Timer {
  timeMs = 0;

  lastStartMS = 0;

  timeIntMs = 0;

  events = new EventEmitter();

  hInterval = null;

  constructor(initValue: number, timeIntMs: number = 0) {
    this.timeMs = initValue;
    this.timeIntMs = timeIntMs;
  }

  start() {
    if (this.hInterval) return;

    this.lastStartMS = 0;
    const onInterval = () => {
      this.lastStartMS += this.timeIntMs;
      this.events.emit('onTimer', this.timeMs + this.lastStartMS, this.lastStartMS);
    };

    this.hInterval = setIntervalInner(onInterval, this.timeIntMs);
  }

  stop() {
    this.timeMs = this.timeMs + this.lastStartMS;
    clearIntervalInner(this.hInterval);
    this.hInterval = null;
  }

  dispose() {
    clearIntervalInner(this.hInterval);
    this.hInterval = null;
    this.events.removeAllListeners('onTimer');
  }
}
