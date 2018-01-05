import BackgroundGeolocation from 'react-native-background-geolocation';

import EventEmitter from 'eventemitter3';

import { caller } from '../utils/lang';

BackgroundGeolocation.configure({
  distanceFilter: 5,
  stopOnTerminate: false,
  autoSync: false,
  stationaryRadius: 0,
  disableElasticity: true,
});

const BG_POS_OPT = {
  persist: false,
  desiredAccuracy: 0,
  timeout: 5000,
};

class BGGeoLocationWatcher {
  emitter = new EventEmitter();

  watching = false;

  on(event, cb, context) {
    check.assert.function(cb);

    this.emitter.on(event, cb, context);
    return () => this.emitter.removeListener(event, cb, context);
  }

  off(event, cb, context) {
    check.assert.function(cb);

    this.emitter.removeListener(event, cb, context);
  }

  watchPos(onStart) {
    if (this.watching) onStart();

    BackgroundGeolocation.changePace(true);
    BackgroundGeolocation.watchPosition(
      (pos) => {
        if (!this.watching) {
          onStart(pos, null);
        }
        this.watching = true;
        this.emitter.emit('position', pos);
      },
      (errorCode) => onStart(null, errorCode),
      BG_POS_OPT,
    );
  }

  stopWatch() {
    if (this.listenerCount('position') === 0) {
      this.watching = false;
      BackgroundGeolocation.changePace(false);
      BackgroundGeolocation.stopWatchPosition();
    }
  }

  getPos(onPos: Function) {
    check.assert.function(onPos);

    BackgroundGeolocation.getCurrentPosition(
      BG_POS_OPT,
      (pos) => onPos(pos, null),
      (error) => onPos(null, error),
    );
  }

  start(onSuccess: Function, onError: Function, count = 0) {
    const successCb = (pos) => caller(onSuccess, pos);

    const errorCb = (error) => {
      if (count === 3) {
        caller(onError, error);
        return;
      }
      this.start(onSuccess, onError, count + 1);
    };

    BackgroundGeolocation.getCurrentPosition(BG_POS_OPT, successCb, errorCb);
  }

  subscribe(event: string) {
    BackgroundGeolocation.on(event, (...args) => {
      this.emitter.emit(...[event].concat(args));
    });
  }

  listenerCount(event) {
    return this.emitter.listeners(event).length;
  }
}

export default new BGGeoLocationWatcher();

const NAV_POS_OPT = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};

class NavGeoLocationWatcherKls {
  watchId = null;

  emitter = new EventEmitter();

  on(event: string, cb: Function, context: any): Function {
    check.assert.function(cb);

    this.emitter.on(event, cb, context);
    return () => this.emitter.removeListener(event, cb, context);
  }

  off(event: string, cb: Function, context: any) {
    check.assert.function(cb);

    this.emitter.removeListener(event, cb, context);
  }

  watchPos(onStart: Function) {
    check.assert.function(onStart);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.startWatch();
        caller(onStart, pos, null);
      },
      (error) => {
        caller(onStart, null, error);
      },
      NAV_POS_OPT,
    );
  }

  stopWatch() {
    if (this.listenerCount('position') === 0) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  getPos(onPos: Function) {
    check.assert.function(onPos);

    navigator.geolocation.getCurrentPosition(
      (pos) => caller(onPos, pos, null),
      (error) => caller(onPos, null, error),
      NAV_POS_OPT,
    );
  }

  startWatch() {
    if (this.watchId) return;

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => this.emitter.emit('position', pos),
      null, NAV_POS_OPT,
    );
  }

  listenerCount(event) {
    return this.emitter.listeners(event).length;
  }
}

export const NavGeoLocationWatcher = new NavGeoLocationWatcherKls();
