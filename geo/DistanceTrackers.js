'use strict';

import haversine from 'haversine';

import EventEmitter from 'eventemitter3';

import {GeoWatcher, getMetersFromLatLon} from './geo';

import {caller} from '../utils/lang';

class DistanceTrackers {
  _trackers = {};

  get(id: number, distInt: number, timeInt: number) {
    if (!this._trackers[id]) {
      this._trackers[id] =
        new DistanceTracker(distInt, timeInt);
    }
    return this._trackers[id];
  }

  dispose(id: number) {
    if (this._trackers[id]) {
      this._trackers[id].dispose();
      this._trackers[id] = null;
    }
  }
}

const trackers = new DistanceTrackers();
export default trackers;

export class DistanceTracker {
  _hInterval = null;

  _time = 0;

  _dist = 0;

  _latLon = {};

  _distInterval = 5.0;

  _timeInterval = 100; // ms

  _starting = false;

  events: EventEmitter = new EventEmitter();

  constructor(distInt, timeInt) {
    this._distInterval = distInt;
    this._timeInterval = timeInt;
  }

  get active() {
    return !!this._hInterval;
  }

  start() {
    if (this._starting || this.active) return;

    this._starting = true;
    GeoWatcher.start((pos, error) => {
      this._starting = false;
      this._fireOnStart(error);

      if (error) return;

      this._unwatch = GeoWatcher.watch(pos => {
        this._onPosition(pos);
        if (!this.active) {
          this._startTracking();
        }
      });
    });
  }

  stop() {
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
      this._fireOnStop(data, error);
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onStart');
    this.events.removeAllListeners('onUpdate');
    this.events.removeAllListeners('onStop');
  }

  _fireOnStart(error: any) {
    this.events.emit('onStart', error);
  }

  _fireOnUpdate(data: any) {
    this.events.emit('onUpdate', data);
  }

  _fireOnStop(data: any, error: any) {
    this.events.emit('onStop', data, error);
  }

  _startTracking() {
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
      this._fireOnUpdate(data);
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
