'use strict';

import BackgroundGeolocation from 'react-native-background-geolocation';

import EventEmitter from 'eventemitter3';

import {caller} from './lang';

BackgroundGeolocation.configure({
  distanceFilter: 3,
  stopOnTerminate: false,
  autoSync: false,
});

class GeoFence_ {
  _started = false;

  _init = false;

  _cbMap = new Map();

  _starts = 0;

  on(event, cb, context) {
    let emitter = this._cbMap.get(event);
    if (!this._cbMap.has(event)) {
      emitter = new EventEmitter();
      this._cbMap.set(event, emitter);
    }
    emitter.on(event, cb, context);
  }

  once(event, cb, context) {
    let emitter = this._cbMap.get(event);
    if (!this._cbMap.has(event)) {
      emitter = new EventEmitter();
      this._cbMap.set(event, emitter);
    }
    emitter.once(event, cb, context);
  }

  off(event, cb, context) {
    if (!this._cbMap.has(event)) return;

    const emitter = this._cbMap.get(event);
    emitter.removeListener(event, cb, context);
  }

  start(cb: Function) {
    if (!this._init) {
      this._subscribe('motionchange');
      this._subscribe('location');
      this._subscribe('error');
      this._subscribe('activitychange');
      this._subscribe('heartbeat');
      this._init = true;
    }

    BackgroundGeolocation.start();

    this._start(() => {
      this._starts++;
      caller(cb);
    });
  }

  _start(onSuccess, onError, count = 0) {
    const successCb = () => {
      this._starts++;
      caller(onSuccess);
    };

    const errorCb = () => {
      if (count === 3) {
        caller(onError);
        return;
      }
      this._start(onSuccess, onError, count + 1);
    };

    BackgroundGeolocation.getCurrentPosition({
      persist: false,
      desiredAccuracy: 10,
      timeout: 5000
    }, successCb, errorCb);
  }

  stop() {
    if (this._starts === 0) {
      BackgroundGeolocation.stop();
      for (let emitter of this._cbMap.values()) {
        emitter.removeAllListeners();
      };
      return;
    }
    this._starts--;
  }

  _subscribe(event) {
    BackgroundGeolocation.on(event, (...args) => {
      if (!this._cbMap.has(event)) return;

      const emitter = this._cbMap.get(event);
      emitter.emit.apply(emitter, [event].concat(args));
    });
  }
}

export const GeoFence = new GeoFence_();

const POS_OPT = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
  distanceFilter: 5,
};

const WATCH_EVENT = 'watch';

class GeoWatcher_ {
  _starts = 0;

  _watchId = null;

  _cbMap = new Map();

  _emitter = new EventEmitter();

  start(cb: Function) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        this._starts++;
        this._startWatch();
        caller(cb, pos, null);
      },
      error => {
        caller(cb, null, error);
      },
      POS_OPT
    );
  }

  watch(cb: Function, context: any): Function {
    this._emitter.on(WATCH_EVENT, cb, context);

    return () => {
      this._emitter.removeListener(WATCH_EVENT, cb, context);
    }
  }

  offWatch(cb: Function, context: any) {
    this._emitter.removeListener(WATCH_EVENT, cb, context);
  }

  stop() {
    this._starts--;
    if (this._starts === 0) {
      navigator.geolocation.clearWatch(this._watchId);
      this._watchId = null;
    }
  }

  getPos(cb: Function) {
    navigator.geolocation.getCurrentPosition(
      pos => caller(cb, pos, null),
      error => caller(cb, null, error),
      POS_OPT
    );
  }

  _startWatch() {
    if (this._watchId) return;

    this._watchId = navigator.geolocation.watchPosition(pos => {
      this._emitter.emit(WATCH_EVENT, pos);
    }, null, POS_OPT);
  }
}

export const GeoWatcher = new GeoWatcher_();
