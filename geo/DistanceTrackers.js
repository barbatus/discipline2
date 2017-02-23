'use strict';

import haversine from 'haversine';

import EventEmitter from 'eventemitter3';

import {BGGeoLocationWatcher, getMetersFromLatLon} from './geo';

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

  _engaged = false;

  _unwatch = null;

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
    BGGeoLocationWatcher.watchPos((pos, error) => {
      this._starting = false;
      this._fireOnStart(error);

      if (error) return;

      this._startTracking();
      this._unwatch = BGGeoLocationWatcher.on(
        'position', ::this._onPosition);
    });
  }

  _onPosition(pos) {
    this._updatePosition(pos);
    this._engaged = true;
  }

  _trackPosition() {
    if (this._engaged) {
      return this._fireOnUpdate(this._track);
    }

    BGGeoLocationWatcher.getPos((loc, error) => {
      if (!error) {
        this._updateLocation(loc);
        this._fireOnUpdate(this._track);
      }
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
      BGGeoLocationWatcher.stopWatch();
    };

    BGGeoLocationWatcher.getPos((pos, error) => {
      if (!error) {
        this._updatePosition(pos);
      }
      this._fireOnStop(this._track);
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onStart');
    this.events.removeAllListeners('onUpdate');
    this.events.removeAllListeners('onStop');
  }

  get _track() {
    return {
      dist: this._dist,
      time: this._time,
      latitude: this._latLon.latitude,
      longitude: this._latLon.longitude,
    };
  }

  _fireOnStart(error: Object) {
    this.events.emit('onStart', error);
  }

  _fireOnUpdate(track: Object) {
    this.events.emit('onUpdate', track);
  }

  _fireOnStop(track: Object) {
    this.events.emit('onStop', track);
  }

  _startTracking() {
    this._dist = 0;
    this._time = 0;
    this._hInterval = setInterval(() => {
      this._time += this._timeInterval;

      this._trackPosition();
    }, this._timeInterval);
  }

  _updatePosition({ coords }) {
    const { latitude, longitude } = coords;

    const dist = haversine(this._latLon, { latitude, longitude });
    this._dist += dist || 0;
    this._latLon = { latitude, longitude };
  }

  _onGeoError(error) {
    console.log(error);
  }
}
