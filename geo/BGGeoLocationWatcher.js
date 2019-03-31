import check from 'check-types';

import BackgroundGeolocation from 'react-native-background-geolocation';

import EventEmitter from 'eventemitter3';

import { caller } from 'app/utils/lang';

import Enum from '../depot/Enum';

function configureBackgroundGeolocation(callback) {
  BackgroundGeolocation.ready({
    desiredAccuracy: 0,
    distanceFilter: 5,
    stopOnTerminate: false,
    autoSync: false,
    stationaryRadius: 0,
    disableElasticity: true,
  }, callback);
}

const LOCATION_TIMEOUT = 5;

const BG_POS_OPT = {
  persist: false,
  desiredAccuracy: 0,
  interval: 500,
  timeout: LOCATION_TIMEOUT, // sec
};

export const BG_ERROR_CODE = {
  LOCATION_UNKNOWN: 0,
  LOCATION_PERMISSION_DENIED: 2,
  LOCATION_TIMEOUT: 408,
};

export const BGError = new Enum({
  LOCATION_PERMISSION_DENIED: {
    value: BG_ERROR_CODE.LOCATION_PERMISSION_DENIED,
    message: 'Location Service is not allowed',
  },
  LOCATION_UNKNOWN: {
    value: BG_ERROR_CODE.LOCATION_UNKNOWN,
    message: 'Location unknown',
  },
  LOCATION_TIMEOUT: {
    value: BG_ERROR_CODE.LOCATION_TIMEOUT,
    message: 'Can\'t determine phone location. Make sure that GPS is available.',
  },
});

export default class BGGeoLocationWatcher {
  emitter = new EventEmitter();

  watching = false;

  singleton: BGGeoLocationWatcher = null;

  static getOrCreate(callback) {
    if (this.singleton) callback(this.singleton);

    configureBackgroundGeolocation((state) => {
      const authStatus = state.lastLocationAuthorizationStatus;
      BackgroundGeolocation.stop();
      BackgroundGeolocation.start(() => {
        this.singleton = new BGGeoLocationWatcher();
        if (BGError.LOCATION_PERMISSION_DENIED.valueOf() === authStatus ||
            BGError.LOCATION_UNKNOWN.valueOf() === authStatus) {
          callback(this.singleton, BGError.LOCATION_PERMISSION_DENIED);
        } else {
          callback(this.singleton);
        }
      }, (error) => callback(null, error));
    });
  }

  on(event, cb, context) {
    check.assert.function(cb);

    this.emitter.on(event, cb, context);
    return () => this.emitter.removeListener(event, cb, context);
  }

  off(event, cb, context) {
    check.assert.function(cb);

    this.emitter.removeListener(event, cb, context);
  }

  watchPos(onStart: Function) {
    if (this.watching) {
      caller(onStart);
      return;
    }

    BackgroundGeolocation.changePace(true, () => {
      const watchPosition = () => BackgroundGeolocation.watchPosition(
        (pos) => this.emitter.emit('position', pos),
        (errorCode) => caller(onStart, null, this.handleError(errorCode)),
        BG_POS_OPT,
      );

      BackgroundGeolocation.getCurrentPosition(
        { ...BG_POS_OPT, samples: 1, maximumAge: 0 },
        (pos) => {
          this.watching = true;
          watchPosition();
          caller(onStart, pos, null);
        },
        (errorCode) => this.handleError(errorCode),
      );
      setTimeout(() => {
        if (!this.watching) {
          caller(onStart, null, BGError.LOCATION_TIMEOUT);
        }
      }, 1.5 * LOCATION_TIMEOUT * 1000);
    }, (errorCode) => caller(onStart, null, this.handleError(errorCode)));
  }

  stopWatch(onStop: Function) {
    if (this.listenerCount('position') === 0) {
      this.watching = false;
      BackgroundGeolocation.changePace(false);
      BackgroundGeolocation.stopWatchPosition();
    }
    caller(onStop);
  }

  getPos(onPos: Function) {
    check.assert.function(onPos);

    BackgroundGeolocation.getCurrentPosition(
      BG_POS_OPT,
      (pos) => onPos(pos, null),
      (error) => onPos(null, error),
    );
  }

  subscribe(event: string) {
    BackgroundGeolocation.on(event, (...args) => {
      this.emitter.emit(...[event].concat(args));
    });
  }

  listenerCount(event) {
    return this.emitter.listeners(event).length;
  }

  handleError(errorCode: number) {
    return BGError.fromValue(errorCode) || errorCode;
  }
}
