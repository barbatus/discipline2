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

      this._unwatch = GeoWatcher.watch(pos => {
        this._onPosition(pos);
        if (!this.active) {
          this._startTracking(onUpdate);
        }
      });
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

      this._unwatch();
      GeoWatcher.stop();
    };

    GeoWatcher.getPos((pos, error) => {
      const data = {
        dist: this._dist,
        time: this._time,
        latitude: this._latLon.latitude,
        longitude: this._latLon.longitude,
      };
      caller(onStop, data, error);
      reset();
    });
  }

  _startTracking(onUpdate) {
    this._dist = 0;
    this._time = 0;
    this._hInterval = setInterval(() => {
      this._time += this._timeInterval;
      const data = {
        dist: this._dist,
        time: this._time,
        latitude: this._latLon.latitude,
        longitude: this._latLon.longitude,
      };
      caller(onUpdate, data);
    }, this._timeInterval);
  }

  _onPosition({ coords }) {
    const { latitude, longitude } = coords;

    const dist = haversine(this._latLon, { latitude, longitude });
    this._dist += dist || 0;
    this._latLon = { latitude, longitude };
  }

  _onGeoError(error) {
    console.log(error);
  }
}
