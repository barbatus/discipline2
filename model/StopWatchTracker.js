'use strict';

import Tracker from './Tracker';

const timeInterval = 100; // ms

const saveInterval = 1000; // ms

export default class StopWatchTracker extends Tracker {
  _hInterval = null;

  _time: number = 0;

  tick() {
    if (this._hInterval) return;

    let value = this.value;
    super.tick();
    this._hInterval = setInterval(() => {
      this._time += timeInterval;
      this.fireValue(value + this._time);

      if (this._inval % saveInterval === 0) {
        this.updLastTick(this._time);
      }
    }, timeInterval);
  }

  stop() {
    this.updLastTick(this._time);
    this._time = 0;

    clearInterval(this._hInterval);
    this._hInterval = null;
    this.fireStop();
  }

  get isActive() {
    return !!this._hInterval;
  }
}
