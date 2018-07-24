import EventEmitter from 'eventemitter3';

import { caller } from 'app/utils/lang';

import BGGeoLocationWatcher from './BGGeoLocationWatcher';

export class DistanceTrackers {
  trackers = {};

  async get(id: number, distInt?: number, timeInt?: number) {
    if (!this.trackers[id]) {
      return new Promise((resolve, reject) => {
        BGGeoLocationWatcher.getOrCreate((geoWatcher, error) => {
          if (error) {
            reject(error);
            return;
          }
          this.trackers[id] = new DistanceTracker(geoWatcher, distInt, timeInt);
          resolve(this.trackers[id]);
        });
      });
    }
    return Promise.resolve(this.trackers[id]);
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

  constructor(geoWatcher, distInt = 5, timeInt = 100) {
    this.geoWatcher = geoWatcher;
    this.distInterval = distInt;
    this.timeInterval = timeInt;
    this.onPosChange = ::this.onPosChange;
  }

  get active() {
    return !!this.hInterval;
  }

  async start() {
    if (this.isStarting || this.active) return Promise.resolve();

    this.isStarting = true;
    return new Promise((resolve, reject) => {
      this.geoWatcher.watchPos((pos, error) => {
        this.isStarting = false;

        if (error) {
          reject(error);
          return;
        }
    
        this.startTracking(pos.coords);
        this.unwatch = this.geoWatcher.on('position', this.onPosChange);
        resolve();
      });
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
    };

    this.unwatch();
    this.geoWatcher.stopWatch(() => {
      caller(callback);
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onLatLonUpdate');
    this.events.removeAllListeners('onTimeUpdate');
    this.geoWatcher = null;
  }

  onPosChange(pos) {
    let state;
    if ((state = this.setNextPosState(pos))) {
      this.fireLatLonUpdate(state);
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
      return {
        speed: speed * 3600 / 1000, // km / h
        dist: this.dist,
        lat: this.latLon.lat,
        lon: this.latLon.lon,
      };
    }
    return null;
  }

  onGeoError(error) {
    console.log(error);
  }
}
