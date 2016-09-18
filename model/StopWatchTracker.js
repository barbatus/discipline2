'use strict';

import reactMixin from 'react-mixin';

import Tracker from './Tracker';

const minInterval = 100; // ms

const saveInterval = 1000; // ms

export default class StopWatchTracker extends Tracker {
  _hInterval = null;

  _time: number = 0;

  get isActive() {
    return !!this._hInterval;
  }

  tick() {
    super.tick();

    let value = this.value;
    this._hInterval = setInterval(() => {
      this._time += minInterval;
      this.fireValue(value + this._time);

      if (this._inval % saveInterval === 0) {
        this.updLastTick(this._time);
      }
    }, minInterval);
  }

  stop() {
    if (!this.isActive) return;

    super.stop();

    this.updLastTick(this._time);
    this._time = 0;

    clearInterval(this._hInterval);
    this._hInterval = null;

    this.fireStop();
  }
}
