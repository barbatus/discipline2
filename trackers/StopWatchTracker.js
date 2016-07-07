'use strict';

import TrackerDAO from './Tracker';

export default class StopWatchTracker extends TrackerDAO {
  _hSetInterval = null;
  _interval: number = 100;
  _tickingCbs: Array<Function> = [];
  _startCbs: Array<Function> = [];
  _stopCbs: Array<Function> = [];
  _tickValue: number = 0;

  tick() {
    if (this._hSetInterval) return;

    let value = this.value;
    let tickPeriod = this._interval;
    this._tickValue = 0;
    this._startCbs.forEach(cb => cb(value));
    this._hSetInterval = setInterval(() => {
      this._tickValue += tickPeriod;
      tickPeriod += this._interval;
      this._tickingCbs.forEach(cb => cb(
        value + this._tickValue));
    }, this._interval);
  }

  stop() {
    super.tick(this._tickValue);
    this._tickValue = 0;

    if (this._hSetInterval) {
      clearInterval(this._hSetInterval);
      this._hSetInterval = null;
      this._stopCbs.forEach(cb => cb());
    }
  }

  get isTicking() {
    return !!this._hSetInterval;
  }

  onTicking(cb: Function) {
    check.assert.function(cb);

    this._tickingCbs.push(cb);
  }

  onStop(cb: Function) {
    check.assert.function(cb);

    this._stopCbs.push(cb);
  }

  onStart(cb: Function) {
    check.assert.function(cb);

    this._startCbs.push(cb);
  }
}
