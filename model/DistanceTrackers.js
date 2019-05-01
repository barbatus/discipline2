import check from 'check-types';
import EventEmitter from 'eventemitter3';
import last from 'lodash/last';
import Reactotron from 'reactotron-react-native';

import Bugsnag from 'app/log/Bugsnag';
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

  async getOrCreate(trackerId: number, initValue?: number, distFilter?: number) {
    if (!this.trackers[trackerId]) {
      return new Promise(async (resolve, reject) => {
        const createTracker = (geoWatcher) => {
          const tracker = new DistanceTracker(geoWatcher, initValue, distFilter);
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

interface IDistState {
  dist: number; // km
  delta: number; // km
  lastStartDist: number; // km
  timestamp: number; // ms
  lat: number;
  lon: number;
}

export class DistanceTracker {
  events = new EventEmitter();

  state: IDistState;

  dist: number = 0; // km

  distFilter: number = 0.005; // 5m

  paths = [];

  isStarting = false;

  unwatch = null;

  constructor(geoWatcher, initValue: number, distFilterM: number = 5) {
    check.assert.number(initValue);

    this.state = {
      dist: initValue,
      lastStartDist: 0,
      delta: 0,
      timestamp: Date.now(),
      lat: null,
      lon: null,
    };
    this.geoWatcher = geoWatcher;
    this.distFilter = distFilterM / 1000;
    this.onPosChange = ::this.onPosChange;
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
    if ((state = this.setNextPosState(this.state, pos))) {
      if ((state.dist - this.dist) >= this.distFilter) {
        this.fireLatLonUpdate(state);
        this.dist = state.dist;
      }
      this.state = state;
      const path = last(this.paths);
      path.push({ lat: state.lat, lon: state.lon });
    }
  }

  fireLatLonUpdate(latLon) {
    this.events.emit('onLatLonUpdate', latLon);
  }

  startTracking({ latitude, longitude, heading }) {
    this.active = true;
    this.heading = heading;
    this.state = {
      ...this.state,
      lat: latitude,
      lon: longitude,
      timestamp: Date.now(),
      lastStartDist: 0,
    };
    this.paths.push([]);
  }

  setNextPosState(prevState, { coords: { speed, latitude, longitude } }) {
    if (prevState.lat !== latitude ||
        prevState.lon !== longitude) {
      const pastMs = Date.now() - prevState.timestamp;
      const speedAbs = Math.abs(speed);
      const delta = (speedAbs / 1000) * (pastMs / 1000);
      return {
        delta,
        speed: speedAbs * 3600 / 1000, // km / h
        dist: prevState.dist + delta,
        lastStartDist: prevState.lastStartDist + delta,
        lat: latitude,
        lon: longitude,
        timestamp: Date.now(),
      };
    }
    return null;
  }

  onGeoError(error) {
    Reactotron.error(error);
  }
}
