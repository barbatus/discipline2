import EventEmitter from 'eventemitter3';
import { last } from 'lodash';

import { caller } from 'app/utils/lang';
import depot from 'app/depot/depot';

import BGGeoLocationWatcher from '../geo/BGGeoLocationWatcher';

import { Timers as BaseTimers } from './Timers';

class DistanceTimers extends BaseTimers {
  async onTimer(trackerId: number, lastStartMs: number) {
    try {
      await depot.updateLastTickData(trackerId, { time: lastStartMs });
    } catch {}
  }
}

export const Timers = new DistanceTimers();

export class DistanceTrackers {
  trackers = {};

  async getOrCreate(trackerId: number, initValue?: number, distInt?: number) {
    if (!this.trackers[trackerId]) {
      return new Promise((resolve, reject) => {
        BGGeoLocationWatcher.getOrCreate((geoWatcher, error) => {
          this.trackers[trackerId] = new DistanceTracker(geoWatcher, initValue, distInt);
          this.trackers[trackerId].events.on('onLatLonUpdate',
            (geo) => this.onLatLonUpdate(trackerId, geo));
          if (error) {
            reject({ tracker: this.trackers[trackerId], ...error });
            return;
          }
          resolve(this.trackers[trackerId]);
        });
      });
    }
    return Promise.resolve(this.trackers[trackerId]);
  }

  async onLatLonUpdate(trackerId: number, { lastStartDist, lat, lon, speed }) {
    try {
      await depot.updateLastTick(trackerId, lastStartDist, { latlon: { lat, lon } });
    } catch {}
  }

  dispose(trackerId: number) {
    if (this.trackers[trackerId]) {
      this.trackers[trackerId].dispose();
      delete this.trackers[trackerId];
    }
  }
}

export default new DistanceTrackers();

export class DistanceTracker {
  lastEventMs: number

  lastStartDist: number;

  dist: number;

  latLon: { lat: number, lon: number };

  paths = [];

  isStarting = false;

  unwatch = null;

  events = new EventEmitter();

  constructor(geoWatcher, initValue: number, distInt: number = 5) {
    this.dist = initValue;
    this.geoWatcher = geoWatcher;
    this.distInterval = distInt;
    this.onPosChange = ::this.onPosChange;
  }

  reset(initValue: number) {
    this.dist = initValue;
    this.lastStartDist = 0;
    this.latLon = {};
  }

  start() {
    if (this.isStarting || this.active) return Promise.resolve();

    this.isStarting = true;
    return new Promise((resolve, reject) => {
      this.geoWatcher.watchPos((pos, error) => {
        this.isStarting = false;

        if (error) {
          reject(error);
          return;
        }

        this.active = true;
        this.startTracking(pos.coords);
        this.unwatch = this.geoWatcher.on('position', this.onPosChange);
        resolve();
      });
    });
  }

  stop(callback) {
    if (!this.active) return;

    this.unwatch();
    this.geoWatcher.stopWatch(() => {
      this.reset();
      caller(callback);
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onLatLonUpdate');
    this.geoWatcher = null;
  }

  onPosChange(pos) {
    let state;
    // eslint-disable-next-line no-cond-assign
    if ((state = this.setNextPosState(pos))) {
      this.fireLatLonUpdate(state);
    }
  }

  fireLatLonUpdate(latLon) {
    this.events.emit('onLatLonUpdate', latLon);
  }

  startTracking({ latitude, longitude, heading }) {
    this.lastStartDist = 0;
    this.lastEventMs = Date.now();
    this.heading = heading;
    this.latLon = { lat: latitude, lon: longitude };
    this.paths.push([]);
  }

  setNextPosState({ coords: { speed, latitude, longitude } }) {
    if (this.latLon.lat !== latitude ||
        this.latLon.lon !== longitude) {
      const pastMs = Date.now() - this.lastEventMs;
      const speedAbs = Math.abs(speed);
      const nextDist = (speedAbs / 1000) * (pastMs / 1000);
      this.lastStartDist += nextDist;
      this.dist += nextDist;
      this.lastEventMs = Date.now();
      this.latLon = { lat: latitude, lon: longitude };
      const path = last(this.paths);
      path.push(this.latLon);
      return {
        speed: speedAbs * 3600 / 1000, // km / h
        dist: this.dist,
        lastStartDist: this.lastStartDist,
        lat: this.latLon.lat,
        lon: this.latLon.lon,
        paths: this.paths,
      };
    }
    return null;
  }

  onGeoError(error) {
    console.log(error);
  }
}
