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

  time = 0;

  dist = 0;

  latLon = {};

  isStarting = false;

  engaged = false;

  unwatch = null;

  events: EventEmitter = new EventEmitter();

  constructor(distInt = 5, timeInt = 100) {
    this.distInterval = distInt;
    this.timeInterval = timeInt;
    this.onPosChange = ::this.onPosChange;
  }

  get active() {
    return !!this.hInterval;
  }

  get track() {
    return {
      dist: this.dist,
      time: this.time,
      lat: this.latLon.lat,
      lon: this.latLon.lon,
    };
  }

  start(callback) {
    if (this.isStarting || this.active) return;

    this.isStarting = true;
    BGGeoLocationWatcher.watchPos(({ coords }, error) => {
      this.isStarting = false;
      this.fireOnStart(error);
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
      if (!error) {
        this.updatePosOnStop(pos);
      }
      this.fireOnStop(this.track);
      caller(callback, this.track, error);
      reset();
    });
  }

  dispose() {
    this.stop();
    this.events.removeAllListeners('onStart');
    this.events.removeAllListeners('onUpdate');
    this.events.removeAllListeners('onStop');
  }

  onPosChange(pos) {
    this.updatePosOnChange(pos);
    this.posTime = Date.now();
  }

  fireUpdatePos() {
    this.fireOnUpdate(this.track);
  }

  fireOnStart(error: Object) {
    this.events.emit('onStart', error);
    this.posTime = Date.now();
  }

  fireOnUpdate(track: Object) {
    this.events.emit('onUpdate', track);
  }

  fireOnStop(track: Object) {
    this.events.emit('onStop', track);
  }

  startTracking({ latitude, longitude, heading }) {
    this.dist = 0;
    this.time = 0;
    this.heading = heading;
    this.latLon = { lat: latitude, lon: longitude };
    this.hInterval = setInterval(() => {
      this.time += this.timeInterval;
      this.fireUpdatePos();
    }, this.timeInterval);
  }

  updatePosOnStop({ coords: { speed, latitude, longitude } }) {
    const time = Date.now() - this.posTime;
    const dist = (speed / 1000) * (time / 1000);
    this.dist += dist;
    this.latLon = { lat: latitude, lon: longitude };
  }

  updatePosOnChange({ coords }) {
    const { speed, latitude, longitude } = coords;
    const time = Date.now() - this.posTime;
    const dist = (speed / 1000) * (time / 1000);
    this.dist += dist;
    this.latLon = { lat: latitude, lon: longitude };
  }

  onGeoError(error) {
    console.log(error);
  }
}
