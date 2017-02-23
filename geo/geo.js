'use strict';

import BackgroundGeolocation from 'react-native-background-geolocation';

import EventEmitter from 'eventemitter3';

import {caller} from '../utils/lang';

BackgroundGeolocation.configure({
  distanceFilter: 0,
  stopOnTerminate: false,
  autoSync: false,
  stationaryRadius: 0,
});

const BG_POS_OPT = {
  persist: false,
  desiredAccuracy: 0,
  timeout: 5000,
};

class BGGeoLocationWatcher_ {
  _init = false;

  _emitter = new EventEmitter();

  _watching = false;

  on(event, cb, context) {
    check.assert.function(cb);

    this._emitter.on(event, cb, context);
    return () => {
      this._emitter.removeListener(event, cb, context);
    }
  }

  off(event, cb, context) {
    check.assert.function(cb);

    this._emitter.removeListener(event, cb, context);
  }

  watchPos(onStart) {
    if (this._watching) onStart();

    BackgroundGeolocation.changePace(true);
    BackgroundGeolocation.watchPosition(
      pos => {
        if (!this._watching) {
          onStart(pos, null);
        }
        this._watching = true;
        this._emitter.emit('position', pos);
      },
      errorCode => onStart(null, errorCode),
      BG_POS_OPT,
    );
  }

  stopWatch() {
    if (this._listenerCount('position') === 0) {
      this._watching = false;
      BackgroundGeolocation.changePace(false);
      BackgroundGeolocation.stopWatchPosition();
    }
  }

  getPos(onPos: Function) {
    check.assert.function(onPos);

    BackgroundGeolocation.getCurrentPosition(
      BG_POS_OPT,
      pos => onPos(pos, null),
      error => onPos(null, error),
    );
  }

  _start(onSuccess: Function, onError: Function, count = 0) {
    const successCb = pos => {

      caller(onSuccess, pos);
    };

    const errorCb = error => {
      if (count === 3) {
        return caller(onError, error);
      }
      this._start(onSuccess, onError, count + 1);
    };

    BackgroundGeolocation.getCurrentPosition(
      BG_POS_OPT, successCb, errorCb);
  }

  _subscribe(event: string) {
    BackgroundGeolocation.on(event, (...args) => {
      this._emitter.emit(...[event].concat(args));
    });
  }

  _listenerCount(event) {
    return this._emitter.listeners(event).length;
  }
}

export const BGGeoLocationWatcher = new BGGeoLocationWatcher_();

const NAV_POS_OPT = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};

class NavGeoLocationWatcher_ {
  _watchId = null;

  _emitter = new EventEmitter();

  on(event: string, cb: Function, context: any): Function {
    check.assert.function(cb);

    this._emitter.on(event, cb, context);
    return () => {
      this._emitter.removeListener(event, cb, context);
    }
  }

  off(event: string, cb: Function, context: any) {
    check.assert.function(cb);

    this._emitter.removeListener(event, cb, context);
  }

  watchPos(onStart: Function) {
    check.assert.function(onStart);

    navigator.geolocation.getCurrentPosition(
      pos => {
        this._startWatch();
        caller(onStart, pos, null);
      },
      error => {
        caller(onStart, null, error);
      },
      POS_OPT,
    );
  }

  stopWatch() {
    if (this._listenerCount('position') === 0) {
      navigator.geolocation.clearWatch(this._watchId);
    }
  }

  getPos(onPos: Function) {
    check.assert.function(onPos);

    navigator.geolocation.getCurrentPosition(
      pos => caller(onPos, pos, null),
      error => caller(onPos, null, error),
      POS_OPT,
    );
  }

  _startWatch() {
    if (this._watchId) return;

    this._watchId = navigator.geolocation.watchPosition(pos => {
      this._emitter.emit('position', pos);
    }, null, POS_OPT);
  }

  _listenerCount(event) {
    return this._emitter.listeners(event).length;
  }
}

export const NavGeoLocationWatcher = new NavGeoLocationWatcher_();
