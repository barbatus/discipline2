import check from 'check-types';
import EventEmitter from 'eventemitter3';
import last from 'lodash/last';
import KeepAwake from 'react-native-keep-awake';

import Logger from 'app/log';
import { ValuedError, round } from 'app/utils/lang';
import depot from 'app/depot/depot';

import BGGeoLocationWatcher from '../geo/BGGeoLocationWatcher';
import * as utils from '../geo/utils';

import { Timers as BaseTimers, Timer as BaseTimer } from './Timers';

class DistanceTimer extends BaseTimer {
  tickTimeGetter = (tick) => tick.time;

  async saveTimerUpdate(lastTickMs: number) {
    try {
      await depot.updateLastTickData(this.trackerId, { time: lastTickMs });
    } catch (ex) {
      Logger.log(`Try to save DistanceTimer: ${ex.message}`);
    }
  }
}

class DistanceTimers {
  timers = {};

  getOrCreate(trackerId: number, initValueMs?: number, intervalMs?: number) {
    if (!this.timers[trackerId]) {
      this.timers[trackerId] = new DistanceTimer(trackerId, initValueMs, intervalMs);
    }
    return this.timers[trackerId];
  }

  dispose(trackerId: number) {
    if (this.timers[trackerId]) {
      this.timers[trackerId].dispose();
      delete this.timers[trackerId];
    }
  }
}

export const Timers = new DistanceTimers();

export class DistanceTrackers {
  trackers = {};

  async getOrCreate(trackerId: string, initValue?: number, distFilter?: number) {
    if (!this.trackers[trackerId]) {
      return new Promise(async (resolve, reject) => {
        const createTracker = (geoWatcher) =>
          new DistanceTracker(trackerId, geoWatcher, initValue, distFilter);
        try {
          const geoWatcher = await BGGeoLocationWatcher.getOrCreate();
          this.trackers[trackerId] = createTracker(geoWatcher);
          resolve(this.trackers[trackerId]);
        } catch (ex) {
          const geoWatcher = ex.value;
          this.trackers[trackerId] = createTracker(geoWatcher);
          reject(new ValuedError(this.trackers[trackerId], ex));
          Logger.log(`Try to get BGGeoLocationWatcher: ${ex.message}`);
        }
        this.trackers[trackerId].on('onStart', this.updateKeepAwake, this);
        this.trackers[trackerId].on('onStop', this.updateKeepAwake, this);
      });
    }
    return Promise.resolve(this.trackers[trackerId]);
  }

  async dispose(trackerId: number) {
    if (this.trackers[trackerId]) {
      await this.trackers[trackerId].dispose();
      delete this.trackers[trackerId];
    }
  }

  updateKeepAwake() {
    const trackers = Object.values(this.trackers).filter(tracker => tracker.active);
    if (trackers.length === 0) {
      KeepAwake.deactivate();
    }
    if (trackers.length === 1) {
      KeepAwake.activate();
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
  stopped: Boolean;
}

export class DistanceTracker extends EventEmitter {

  state: IDistState;

  savedDist: number = 0; // km

  distFilter: number;

  paths = [];

  isStarting = false;

  unwatchGeo = null;

  active = false;

  constructor(
    trackerId: string,
    geoWatcher: BGGeoLocationWatcher,
    initValue: number = 0,
    distFilterM: number = 5 // 5m
  ) {
    check.assert.number(initValue);
    super();

    this.state = {
      dist: initValue,
      lastStartDist: 0,
      delta: 0,
      speed: 0,
      timestamp: Date.now(),
      lat: null,
      lon: null,
    };
    this.trackerId = trackerId;
    this.geoWatcher = geoWatcher;
    this.distFilter = distFilterM / 1000;
    this.onPosChange = ::this.onPosChange;
  }

  get value() {
    return {
      speed: this.state.speed,
      dist: this.state.dist,
      lat: this.state.lat,
      lon: this.state.lon,
    };
  }

  async start(baseDist: number) {
    if (this.isStarting || this.active) return;

    this.isStarting = true;
    this.state = baseDist ? { ...this.state, dist: baseDist } : this.state;
    try {
      const pos = await this.geoWatcher.watchPos();
      this.startTracking(pos.coords);
      this.unwatchGeo = this.geoWatcher.on('position', this.onPosChange);
    } finally {
      this.isStarting = false;
    }
  }

  async checkGPS() {
    return this.geoWatcher.checkAvailable();
  }

  async stop() {
    if (!this.active) return;

    this.unwatchGeo();
    try {
      await this.geoWatcher.stopWatch();
    } finally {
      this.active = false;
      this.state = { ...this.state, stopped: true };
      if (this.state.dist !== this.savedDist) {
        await this.saveLatLonUpdate(this.state);
        this.fireLatLonUpdate(this.state);
      }
      this.emit('onStop');
    }
  }

  async dispose() {
    try {
      await this.stop();
    } finally {
      this.removeAllListeners();
      this.geoWatcher = null;
      this.paths = null;
    }
  }

  onPosChange(pos) {
    let state;
    // eslint-disable-next-line no-cond-assign
    if ((state = this.setNextPosState(this.state, pos))) {
      if ((state.dist - this.savedDist) >= this.distFilter) {
        this.saveLatLonUpdate(state);
        this.fireLatLonUpdate(state);
        this.savedDist = state.dist;
      }
      this.state = state;
      const path = last(this.paths);
      path.push({ lat: state.lat, lon: state.lon });
    }
  }

  fireLatLonUpdate(latLon) {
    this.emit('onLatLonUpdate', latLon);
  }

  async saveLatLonUpdate({ stopped, dist, lastStartDist, lat, lon }) {
    try {
      await depot.updateLastTick(this.trackerId, lastStartDist, { latlon: { lat, lon } });
    } catch (ex) {
      Logger.log(`Try to save DistanceTracker: ${ex.message}`);
    }
  }

  startTracking({ latitude, longitude, heading }) {
    this.active = true;
    this.heading = heading;
    this.state = {
      ...this.state,
      lat: null, //latitude,
      lon: null, //longitude,
      timestamp: Date.now(),
      lastStartDist: 0,
    };
    this.paths.push([]);
    this.emit('onStart');
  }

  setNextPosState(prevState, { coords: { speed, latitude: lat, longitude: lon } }) {
    if (prevState.lat !== lat || prevState.lon !== lon) {
      const speedAbs = Math.abs(speed);
      const delta = prevState.lat ? utils.delta(prevState.lat, lat, prevState.lon, lon) : 0;
      return {
        delta,
        lat,
        lon,
        speed: speedAbs * 3600 / 1000, // km / h
        dist: prevState.dist + delta,
        lastStartDist: prevState.lastStartDist + delta,
        timestamp: Date.now(),
        stopped: false,
      };
    }
    return null;
  }

  onGeoError(error) {
    Logger.error(error, { context: 'Geo' });
  }
}
