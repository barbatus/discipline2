import EventEmitter from 'eventemitter3';

class Timers {
  timers = {};

  get(id: number, int: number) {
    if (!this.timers[id]) {
      this.timers[id] = new Timer(int);
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
  pastMs = 0;

  int = 0;

  timer = null;

  events: EventEmitter = new EventEmitter();

  constructor(int: number = 0) {
    this.int = int;
  }

  get active() {
    return !!this.timer;
  }

  get timeMs() {
    return this.pastMs;
  }

  start(pos: number = 0) {
    if (this.active) return;

    this.pastMs = 0;
    this.timer = setInterval(() => {
      this.pastMs += this.int;
      this.events.emit('onTimer', pos + this.pastMs);
    }, this.int);
  }

  stop() {
    if (!this.active) return;

    clearInterval(this.timer);
    this.timer = null;
  }

  dispose() {
    this.events.removeAllListeners('onTimer');
  }
}
