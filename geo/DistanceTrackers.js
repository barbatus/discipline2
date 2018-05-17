import EventEmitter from 'eventemitter3';

import { caller } from 'app/utils/lang';

import BGGeoLocationWatcher from './BGGeoLocationWatcher';

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

export default new DistanceTrackers();

export class DistanceTracker {
  hInterval = null;
  time: number;
  dist: number;
  latLon: { lat: number, lon: number };
  updTime: number
  isStarting = false;
  unwatch = null;
  events = new EventEmitter();

  constructor(distInt = 5, timeInt = 100) {
    this.distInterval = distInt;
    this.timeInterval = timeInt;
    this.onPosChange = ::this.onPosChange;
  }

  get active() {
    return !!this.hInterval;
  }

  get posState() {
    return {
      dist: this.dist,
      lat: this.latLon.lat,
      lon: this.latLon.lon,
    };
  }

  start(callback) {
    if (this.isStarting || this.active) return;

    this.isStarting = true;
    BGGeoLocationWatcher.watchPos(({ coords }, error) => {
      this.isStarting = false;
      caller(callback, error);

      if (error) return;

      this.startTracking(coords);
      this.unwatch = BGGeoLocationWatcher.on('position', this.onPosChange);
    });
  }

  stop(callback) {
    if (!this.active) return;

    clearInterval(this.hInterval);
    this.hInterval = null;

    const reset = () => {
      this.time = 0;
      this.dist = 0;
      this.latLon = {};

      this.unwatch();
      BGGeoLocationWatcher.stopWatch();
    };

    BGGeoLocationWatcher.getPos((pos, error) => {
      if (error) {
        caller(callback, null, error);
      } else {
        const newState = this.setNextPosState(pos);
        caller(callback, newState ? this.posState : null);
      }
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onLatLonUpdate');
    this.events.removeAllListeners('onTimeUpdate');
  }

  onPosChange(pos) {
    if (this.setNextPosState(pos)) {
      this.fireLatLonUpdate(this.posState);
    }
  }

  fireLatLonUpdate(latLon) {
    this.events.emit('onLatLonUpdate', latLon);
  }

  fireTimeUpdate() {
    this.events.emit('onTimeUpdate', this.time);
  }

  startTracking({ latitude, longitude, heading }) {
    this.dist = 0;
    this.time = 0;
    this.updTime = Date.now();
    this.heading = heading;
    this.latLon = { lat: latitude, lon: longitude };
    this.hInterval = setInterval(() => {
      this.time += this.timeInterval;
      this.fireTimeUpdate();
    }, this.timeInterval);
  }

  setNextPosState({ coords: { speed, latitude, longitude } }) {
    if (this.latLon.latitude !== latitude ||
        this.latLon.longitude !== longitude) {
      const time = Date.now() - this.updTime;
      const dist = (speed / 1000) * (time / 1000);
      this.dist += dist;
      this.latLon = { lat: latitude, lon: longitude };
      this.updTime = Date.now();
      return true;
    }
    return false;
  }

  onGeoError(error) {
    console.log(error);
  }
}
