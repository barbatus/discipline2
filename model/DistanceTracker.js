'use strict';

import {DeviceEventEmitter} from 'react-native';

import {RNLocation as Location} from 'NativeModules';

import Tracker from './Tracker';

// Update distance interval in m.
const distInterval = 5.0;

const timeInterval = 100; // ms

const saveDistInterval = 100.0; // m

// Save data interval in ms.
const saveTimeInterval = 1000;

const tickDataSchema = 'DistData';

// Radius of the earth in km.
const R = 6371;

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  let dLat = deg2rad(lat2 - lat1);
  let dLon = deg2rad(lon2 - lon1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default class DistanceTracker extends Tracker {
  _hInterval = null;

  _time: number = 0;

  _dist: number = 0;

  _lat: number = 0;

  _lon: number = 0;

  tick() {
    Location.requestAlwaysAuthorization();
    Location.startUpdatingLocation();
    Location.setDistanceFilter(distInterval);

    this._addTick(0, { time: 0 });
    DeviceEventEmitter.addListener('locationUpdated',
      ::this._onLocationUpdate);

    let time = this.time;
    let dist = this.value;
    this._hInterval = setInterval(() => {
      this._time += timeInterval;
      this.fireValue({
        dist: dist + this._dist,
        time: time + this._time
      });

      if (this._time % saveTimeInterval === 0) {
        this._updateTick(this._dist, this._time);
      }
    }, timeInterval);
  }

  stop() {
    this._updateTick(this._dist, this._time);
    this.fireValue({
      dist: this.value,
      time: this.time
    });

    Location.stopUpdatingLocation();
    DeviceEventEmitter.removeListener('locationUpdated',
      ::this._onLocationUpdate);

    this._time = 0;
    this._dist = 0;
    this._lat = 0;
    this._lon = 0;
    clearInterval(this._hInterval);
    this._hInterval = null;

    this.fireStop();
  }

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

  _addTick(value, data: Object) {
    depot.ticks.addData(tickDataSchema, data);
    return this.addTick(value);
  }

  _updateTick(dist, time) {
    let tick = this.lastTick;
    depot.ticks.updateData(tickDataSchema, tick.id, { time });
    return this.updLastTick(dist);
  }

  _onLocationUpdate(location) {
    let { latitude, longitude, speed } = location.coords;

    let dist = getDistanceFromLatLonInMeters(
      this._lat, this._lon, latitude, longitude);
    if (dist <= distInterval) {
      this._dist += dist;
    }

    this._lat = latitude;
    this._lon = longitude;
  }
}
