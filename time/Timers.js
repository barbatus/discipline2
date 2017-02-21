'use strict';

import EventEmitter from 'eventemitter3';

class Timers {
  _timers = {};

  get(id: number, int: number) {
    if (!this._timers[id]) {
      this._timers[id] = new Timer(int);
    }
    return this._timers[id];
  }

  dispose(id: number) {
    if (this._timers[id]) {
      this._timers[id].dispose();
      this._timers[id] = null;
    }
  }
}

const timers = new Timers();
export default timers;

export class Timer {
  _pastMs = 0;

  _int = 0;

  _timer = null;

  events: EventEmitter = new EventEmitter();

  constructor(int: number = 0) {
    this._int = int;
  }

  get active() {
    return !!this._timer;
  }

  get timeMs() {
    return this._pastMs;
  }

  start(pos: number = 0) {
    if (this.active) return;

    this._pastMs = 0;
    this._timer = setInterval(() => {
      this._pastMs += this._int;
      this.events.emit('onTimer', pos + this._pastMs);
    }, this._int);
  }

  stop() {
    if (!this.active) return;

    clearInterval(this._timer);
    this._timer = null;
  }

  dispose() {
    this.events.removeAllListeners('onTimer');
  }
}
