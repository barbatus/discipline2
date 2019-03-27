import EventEmitter from 'eventemitter3';
import { AppState } from 'react-native';

class Timers {
  timers = {};

  get(id: number, intervalMs: number) {
    if (!this.timers[id]) {
      this.timers[id] = new Timer(intervalMs);
    }
    return this.timers[id];
  }

  dispose(id: number) {
    if (this.timers[id]) {
      this.timers[id].dispose();
      delete this.timers[id];
    }
  }
}

const timers = new Timers();
export default timers;

export class Timer {
  timePastMs = 0;

  timeIntMs = 0;

  hTimer: number;

  downDateMs: number;

  events: EventEmitter = new EventEmitter();

  constructor(timeIntMs: number = 0) {
    this.timeIntMs = timeIntMs;
    this.handleAppStateChange = ::this.handleAppStateChange;
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  get active() {
    return !!this.hTimer;
  }

  get timeMs() {
    return this.timePastMs;
  }

  start(offsetMs: number = 0) {
    if (this.active) return;

    this.timePastMs = 0;
    this.offsetMs = offsetMs;
    this.hTimer = setInterval(() => {
      this.timePastMs += this.timeIntMs;
      this.events.emit('onTimer', offsetMs + this.timePastMs);
    }, this.timeIntMs);
  }

  stop() {
    if (!this.active) return;

    clearInterval(this.hTimer);
    this.hTimer = null;
  }

  dispose() {
    this.events.removeAllListeners('onTimer');
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(state) {
    if (!this.active) return;

    if (state === 'background') {
      this.downDate = Date.now();
    }

    if (state === 'active') {
      this.timePastMs += Date.now() - this.downDate;
      this.events.emit('onTimer', this.offsetMs + this.timePastMs);
    }
  }
}
