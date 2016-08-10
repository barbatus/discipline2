'use strict';

import {DeviceEventEmitter} from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import {RNLocation as Location} from 'NativeModules';

import Tracker from './Tracker';

import {getDistanceFromLatLonInMeters} from '../utils/geo';

// Update distance interval in m.
const distInterval = 5.0;

const timeInterval = 100; // ms

const saveDistInterval = 100.0; // m

// Save data interval in ms.
const saveTimeInterval = 1000;

const tickDataSchema = 'DistData';

export default class DistanceTracker extends Tracker {
  _hInterval = null;

  _initTime: number = 0;

  _time: number = 0;

  _initDist: number = 0;

  _dist: number = 0;

  _lat: number = 0;

  _lon: number = 0;

  get time() {
    let ticks = this.getTodayTicks();
    let data = ticks.map(tick => depot.ticks.getData(
      tickDataSchema, tick.id));
    let times = data.map(item => item.time);
    return times.reduceRight((p, n) => {
      return p + n;
    }, 0);
  }

  get isActive() {
    return !!this._hInterval;
  }

  tick() {
    Location.requestAlwaysAuthorization();
    Location.startUpdatingLocation();
    Location.setDistanceFilter(distInterval);

    this._addTick(0, { time: 0 });
    DeviceEventEmitter.addListener('locationUpdated',
      ::this._onLocationUpdate);

    this._initTime = this.time;
    this._initDist = this.value;
    this._hInterval = this.setInterval(() => {
      this._time += timeInterval;

      this._updateTick(
        this._initDist, this._dist,
        this._initTime, this._time,
        this._time % saveTimeInterval === 0);

    }, timeInterval);
  }

  stop() {
    this._updateTick(
      this._initDist, this._dist,
      this._initTime, this._time, true);

    Location.stopUpdatingLocation();
    DeviceEventEmitter.removeListener('locationUpdated',
      ::this._onLocationUpdate);

    this._time = 0;
    this._dist = 0;
    this._lat = 0;
    this._lon = 0;
    this._init = false;
    this.clearInterval(this._hInterval);
    this._hInterval = null;

    this.fireStop();
  }

  onAppActive(diffMs, dateChanged) {
    if (!this.isActive || dateChanged) return;

    this._time += diffMs;
    this._updateTick(
      this._initDist, this._dist,
      this._initTime, this._time, true);
  }

  _addTick(value, data: Object) {
    depot.ticks.addData(tickDataSchema, data);
    return this.addTick(value);
  }

  _updateTick(initDist, dist, initTime, time) {
    this.requestAnimationFrame(() => {
      let tick = this.lastTick;
      depot.ticks.updateData(tickDataSchema, tick.id, { time });
      this.updLastTick(dist);
    });

    this.fireValue({
      dist: initDist + dist,
      time: initTime + time
    });
  }

  _onLocationUpdate(location) {
    let { latitude, longitude, speed } = location.coords;

    if (this._init) {
      let dist = getDistanceFromLatLonInMeters(
        this._lat, this._lon, latitude, longitude);
      if (dist < 2 * distInterval) {
        this._dist += dist;
      }
    }

    this._lat = latitude;
    this._lon = longitude;
    this._init = true;
  }
}

reactMixin(DistanceTracker.prototype, TimerMixin);
