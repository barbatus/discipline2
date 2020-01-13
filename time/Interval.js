import { AppState, Platform } from 'react-native';
import EventEmitter from 'eventemitter3';

export default class Interval extends EventEmitter {
  allTimeMs = 0;

  lastStartMS = 0;

  timeIntMs = 0;

  lastStoppedMS = 0;

  hInterval = null;

  paused = false;

  constructor(initValue: number, timeIntMs: number = 0) {
    super();
    this.allTimeMs = initValue;
    this.timeIntMs = timeIntMs;
    this.onAppStateChange = ::this.onAppStateChange;
    AppState.addEventListener('change', this.onAppStateChange);
  }

  get value() {
    return this.allTimeMs;
  }

  get active() {
    return Boolean(this.hInterval);
  }

  start(baseValMs: number = 0, startFromMs: number = 0): boolean {
    if (this.active) return;

    this.allTimeMs = baseValMs;
    this.lastStartMS = startFromMs;
    const onInterval = () => {
      this.allTimeMs += this.timeIntMs;
      this.lastStartMS += this.timeIntMs;
      this.emit('tick', this.allTimeMs, this.lastStartMS);
    };

    this.hInterval = setInterval(onInterval, this.timeIntMs);
  }

  restart(baseValMs: number = 0) {
    this.start(baseValMs, this.lastStartMS + Date.now() - this.lastStoppedMS);
  }

  stop() {
    if (!this.active) return;

    this.lastStartMS = 0;
    this.lastStoppedMS = Date.now();
    clearInterval(this.hInterval);
    this.hInterval = null;
  }

  on(cb: Function, context: any) {
    super.on('tick', cb, context);
  }

  off(cb: Function, context: any) {
    super.off('tick', cb, context);
  }

  onAppStateChange(appState) {
    if (appState === 'inactive' && this.active) {
      this.stop();
      this.paused = true;
    }
    if (appState === 'active' && this.paused) {
      this.restart(this.value);
      this.paused = false;
    }
  }

  dispose() {
    clearInterval(this.hInterval);
    this.hInterval = null;
    this.removeAllListeners('tick');
    AppState.removeEventListener('change', this.onAppStateChange);
  }
}
