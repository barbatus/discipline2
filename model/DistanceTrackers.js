import check from 'check-types';
import EventEmitter from 'eventemitter3';
import last from 'lodash/last';
import isNumber from 'lodash/isNumber';

import { ValuedError } from 'app/utils/lang';
import depot from 'app/depot/depot';

import BGGeoLocationWatcher from '../geo/BGGeoLocationWatcher';

import { Timers as BaseTimers } from './Timers';

class DistanceTimers extends BaseTimers {
  async onTimer(trackerId: number, lastStartMs: number) {
    await depot.updateLastTickData(trackerId, { time: lastStartMs });
  }
}

export const Timers = new DistanceTimers();

export class DistanceTrackers {
  trackers = {};

  async getOrCreate(trackerId: number, initValue?: number, distInt?: number) {
    if (!this.trackers[trackerId]) {
      return new Promise(async (resolve, reject) => {
        const createTracker = (geoWatcher) => {
          const tracker = new DistanceTracker(geoWatcher, initValue, distInt);
          tracker.events.on('onLatLonUpdate', (geo) => this.onLatLonUpdate(trackerId, geo));
          return tracker;
        };

        try {
          const geoWatcher = await BGGeoLocationWatcher.getOrCreate();
          this.trackers[trackerId] = createTracker(geoWatcher);
          resolve(this.trackers[trackerId]);
        } catch (error) {
          const geoWatcher = error.value;
          this.trackers[trackerId] = createTracker(geoWatcher);
          reject(new ValuedError(this.trackers[trackerId], error));
        }
      });
    }
    return Promise.resolve(this.trackers[trackerId]);
  }

  async onLatLonUpdate(trackerId: number, { lastStartDist, lat, lon }) {
    console.log('dist');
    await depot.updateLastTick(trackerId, lastStartDist, { latlon: { lat, lon } });
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
  events = new EventEmitter();

  dist: number;

  lastStartDist: number;

  lastEventMs: number;

  latLon: { lat: number, lon: number };

  paths = [];

  isStarting = false;

  unwatch = null;

  constructor(geoWatcher, initValue: number, distInt: number = 5) {
    check.assert.number(initValue);

    this.dist = initValue;
    this.geoWatcher = geoWatcher;
    this.distInterval = distInt;
    this.onPosChange = ::this.onPosChange;
  }

  reset(initValue?: number) {
    if (isNumber(initValue)) {
      this.dist = initValue;
    }
    this.lastStartDist = 0;
  }

  async start() {
    if (this.isStarting || this.active) return;

    this.isStarting = true;
    try {
      const pos = await this.geoWatcher.watchPos();
      this.startTracking(pos.coords);
      this.unwatch = this.geoWatcher.on('position', this.onPosChange);
    } finally {
      this.isStarting = false;
    }
  }

  async stop() {
    if (!this.active) return;

    this.unwatch();
    try {
      await this.geoWatcher.stopWatch();
    } finally {
      this.active = false;
      this.reset(this.dist);
    }
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onLatLonUpdate');
    this.geoWatcher = null;
    this.paths = null;
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
    this.active = true;
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
        paths: this.paths.slice(),
      };
    }
    return null;
  }

  onGeoError(error) {
    console.log(error);
  }
}
