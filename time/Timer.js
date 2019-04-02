import EventEmitter from 'eventemitter3';
import BackgroundTimer from 'react-native-background-timer';

let timerCount = 0;

export default class Timer {
  timeMs = 0;

  lastStartMS = 0;

  timeIntMs = 0;

  init = false;

  active = false;

  events: EventEmitter = new EventEmitter();

  constructor(initValue: number, timeIntMs: number = 0) {
    this.timeMs = initValue;
    this.timeIntMs = timeIntMs;
    timerCount += 1;
  }

  reset(initValue: number) {
    this.timeMs = initValue;
  }

  start() {
    if (this.active) return;

    this.lastStartMS = 0;
    this.active = true;

    if (!this.init) {
      BackgroundTimer.runBackgroundTimer(() => {
        if (this.active) {
          this.lastStartMS += this.timeIntMs;
          this.events.emit('onTimer', this.timeMs + this.lastStartMS, this.lastStartMS);
        }
      }, this.timeIntMs);
      this.init = true;
    }
  }

  stop() {
    this.timeMs = this.timeMs + this.lastStartMS;
    this.active = false;
  }

  dispose() {
    this.active = false;
    this.events.removeAllListeners('onTimer');
    timerCount -= 1;
    if (timerCount === 0) {
      BackgroundTimer.stopBackgroundTimer();
    }
  }
}
