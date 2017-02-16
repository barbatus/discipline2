'use strict';

import haversine from 'haversine'

import {GeoWatcher, getMetersFromLatLon} from './geo';

import {caller} from '../utils/lang';

const tickDataSchema = 'DistData';

export default class DistanceTracker {
  _hInterval = null;

  _time = 0;

  _dist = 0;

  _latLon = {};

  _distInterval = 5.0;

  _timeInterval = 100; // ms

  _starting = false;

  constructor(distInterval, timeInterval) {
    this._distInterval = distInterval;
    this._timeInterval = timeInterval;
  }

  get active() {
    return !!this._hInterval;
  }

  start(onStart: Function, onUpdate: Function) {
    if (this._starting || this.active) return;

    this._starting = true;
    GeoWatcher.start((pos, error) => {
      this._starting = false;
      caller(onStart, error);

      if (error) return;

      this._dist = 0;
      this._time = 0;
      this._hInterval = setInterval(() => {
        this._time += this._timeInterval;
        const data = {
          dist: this._dist,
          time: this._time,
        };
        caller(onUpdate, data);
      }, this._timeInterval);

      GeoWatcher.watch(this._onPosition, this);
    });
  }

  stop(onStop: Function) {
    if (!this.active) return;

    const reset = () => {
      this._time = 0;
      this._dist = 0;
      this._latLon = {};
      clearInterval(this._hInterval);
      this._hInterval = null;

      GeoWatcher.offWatch(this._onPosition, this);
      GeoWatcher.stop();
    };

    GeoWatcher.getPos((pos, error) => {
      const data = {
        dist: this._dist,
        time: this._time,
      };
      caller(onStop, data, error);
      reset();
    });
  }

  _onPosition(pos) {
    const { latitude, longitude } = pos.coords;

    const dist = haversine(this._latLon, { latitude, longitude });
    this._dist += dist || 0;

    this._latLon = { latitude, longitude };
  }

  _onGeoError(error) {
    console.log(error);
  }
}
