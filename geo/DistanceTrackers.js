'use strict';

import haversine from 'haversine';

import EventEmitter from 'eventemitter3';

import { BGGeoLocationWatcher, getMetersFromLatLon } from './geo';

import { caller } from '../utils/lang';

export class DistanceTrackers {
  trackers = {};

  get(id: number, distInt: number, timeInt: number) {
    if (!this.trackers[id]) {
      this.trackers[id] = new DistanceTracker(distInt, timeInt);
    }
    return this.trackers[id];
  }

  dispose(id: number) {
    if (this.trackers[id]) {
      this.trackers[id].dispose();
      delete this.trackers[id];
    }
  }
}

const trackers = new DistanceTrackers();
export default trackers;

export class DistanceTracker {
  hInterval = null;

  time = 0;

  dist = 0;

  latLon = {};

  distInterval = 5.0;

  timeInterval = 100; // ms

  starting = false;

  engaged = false;

  unwatch = null;

  events: EventEmitter = new EventEmitter();

  constructor(distInt, timeInt) {
    this.distInterval = distInt;
    this.timeInterval = timeInt;
  }

  get active() {
    return !!this.hInterval;
  }

  get track() {
    return {
      dist: this.dist,
      time: this.time,
      latitude: this.latLon.latitude,
      longitude: this.latLon.longitude,
    };
  }

  start() {
    if (this.starting || this.active) return;

    this.starting = true;
    BGGeoLocationWatcher.watchPos((pos, error) => {
      this.starting = false;
      this.fireOnStart(error);

      if (error) return;

      this.startTracking();
      this.unwatch = BGGeoLocationWatcher.on('position', ::this.onPosition);
    });
  }

  stop() {
    if (!this.active) return;

    const reset = () => {
      this.time = 0;
      this.dist = 0;
      this.latLon = {};
      clearInterval(this.hInterval);
      this.hInterval = null;

      this.unwatch();
      BGGeoLocationWatcher.stopWatch();
    };

    BGGeoLocationWatcher.getPos((pos, error) => {
      if (!error) {
        this.updatePosition(pos);
      }
      this.fireOnStop(this.track);
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onStart');
    this.events.removeAllListeners('onUpdate');
    this.events.removeAllListeners('onStop');
  }

  onPosition(pos) {
    this.updatePosition(pos);
  }

  trackPosition() {
    this.fireOnUpdate(this.track);
  }

  fireOnStart(error: Object) {
    this.events.emit('onStart', error);
  }

  fireOnUpdate(track: Object) {
    this.events.emit('onUpdate', track);
  }

  fireOnStop(track: Object) {
    this.events.emit('onStop', track);
  }

  startTracking() {
    this.dist = 0;
    this.time = 0;
    this.hInterval = setInterval(() => {
      this.time += this.timeInterval;
      this.trackPosition();
    }, this.timeInterval);
  }

  updatePosition({ coords }) {
    const { latitude, longitude } = coords;

    const dist = haversine(this.latLon, { latitude, longitude });
    this.dist += dist || 0;
    this.latLon = { latitude, longitude };
  }

  onGeoError(error) {
    console.log(error);
  }
}
