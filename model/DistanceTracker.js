'use strict';

import {DeviceEventEmitter} from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import haversine from 'haversine'

import Tracker from './Tracker';

import {GeoWatcher, getMetersFromLatLon} from '../utils/geo';

import {caller} from '../utils/lang';

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

  _latLon = {};

  _starting: boolean = false;

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

  tick(value?: number, cb: Function) {
    check.assert(!this.isActive);

    if (this._starting) return;

    this._starting = true;
    GeoWatcher.start((pos, error) => {
      this._starting = false;
      caller(cb, error);

      if (error) return;

      this._addTick(0, { time: 0 });

      this._initTime = this.time;
      this._initDist = this.value;
      this._hInterval = setInterval(() => {
        this._time += timeInterval;

        this._updateTick(
          this._initDist, this._dist,
          this._initTime, this._time,
          this._time % saveTimeInterval === 0);

      }, timeInterval);

      GeoWatcher.watch(this._onPosition, this);
    });
  }

  stop() {
    if (!this.isActive) return;

    super.stop();

    let reset = () => {
      this._time = 0;
      this._dist = 0;
      this._latLon = {};
      clearInterval(this._hInterval);
      this._hInterval = null;

      GeoWatcher.offWatch(this._onPosition, this);
      GeoWatcher.stop();
    };

    GeoWatcher.getPos((pos, error) => {
      if (!error) {
        this._updateTick(
          this._initDist, this._dist,
          this._initTime, this._time, true);
      }
      reset();
      this.fireStop();
    });
  }

  onAppActive(diffMs, dateChanged) {
    super.onAppActive(diffMs, dateChanged);

    if (!this.isActive) return;

    // Each tracker can't run more than a day,
    // so day's changed, we check how much time past
    // since the day start to estimate exact time
    // to add to the prev tracker click.
    if (dateChanged) {
      clearInterval(this._hInterval);
      let past = time.getFromDayStartMs();
      diffMs -= past;
    }

    this._time += diffMs;
    this._updateTick(
      this._initDist, this._dist,
      this._initTime, this._time, true);
  }

  _addTick(value, data: Object) {
    depot.ticks.addData(tickDataSchema, data);
    return this.addTick(value);
  }

  _updateTick(initDist, dist, initTime, time, save) {
    if (save) {
      requestAnimationFrame(() => {
        let tick = this.lastTick;
        depot.ticks.updateData(tickDataSchema, tick.id, { time });
        this.updLastTick(dist);
      });
    }

    this.fireValue({
      dist: initDist + dist,
      time: initTime + time
    });
  }

  _onPosition(pos) {
    let { latitude, longitude } = pos.coords;

    let dist = haversine(this._latLon, { latitude, longitude });
    this._dist += dist || 0;

    this._latLon = { latitude, longitude };
  }

  _onGeoError(error) {
    console.log(error);
  }
}
