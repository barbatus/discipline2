import check from 'check-types';
import BackgroundGeolocation from 'react-native-background-geolocation';
import EventEmitter from 'eventemitter3';

import { ValuedError } from 'app/utils/lang';

import Enum from '../depot/Enum';

function configureBackgroundGeolocation(callback) {
  BackgroundGeolocation.ready({
    reset: true,
    desiredAccuracy: 0,
    distanceFilter: 5,
    stopOnTerminate: false,
    autoSync: false,
    stationaryRadius: 0,
    disableElasticity: true,
    foregroundService: true,
    debug: true,
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

  static async getOrCreate() {
    if (BGGeoLocationWatcher.singleton) {
      return Promise.resolve(BGGeoLocationWatcher.singleton);
    }

    return new Promise((resolve, reject) => {
      configureBackgroundGeolocation((state) => {
        const authStatus = state.lastLocationAuthorizationStatus;
        BackgroundGeolocation.stop();
        BackgroundGeolocation.start(() => {
          BGGeoLocationWatcher.singleton = new BGGeoLocationWatcher();
          if (BGError.LOCATION_PERMISSION_DENIED.valueOf() === authStatus ||
              BGError.LOCATION_UNKNOWN.valueOf() === authStatus) {
            reject(new ValuedError(
              BGGeoLocationWatcher.singleton,
              BGError.LOCATION_PERMISSION_DENIED,
            ));
          } else {
            resolve(BGGeoLocationWatcher.singleton);
          }
        }, (error) => reject(new ValuedError(null, error)));
      });
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

  async watchPos() {
    return new Promise((resolve, reject) => {
      if (this.watching) {
        resolve();
        return;
      }

      BackgroundGeolocation.changePace(true, () => {
        const watchPosition = () => BackgroundGeolocation.watchPosition(
          (pos) => this.emitter.emit('position', pos),
          (errorCode) => reject(new ValuedError(null, this.handleError(errorCode))),
          BG_POS_OPT,
        );

        BackgroundGeolocation.getCurrentPosition(
          { ...BG_POS_OPT, samples: 1, maximumAge: 0 },
          (pos) => {
            this.watching = true;
            watchPosition();
            resolve(pos);
          },
          (errorCode) => reject(new ValuedError(null, this.handleError(errorCode))),
        );
        setTimeout(() => {
          if (!this.watching) {
            reject(new ValuedError(null, BGError.LOCATION_TIMEOUT));
          }
        }, 1.5 * LOCATION_TIMEOUT * 1000);
      }, (errorCode) => reject(new ValuedError(null, this.handleError(errorCode))));
    });
  }

  async stopWatch() {
    return new Promise((resolve) => {
      if (this.listenerCount('position') === 0) {
        this.watching = false;
        BackgroundGeolocation.changePace(false);
        BackgroundGeolocation.stopWatchPosition();
      }
      resolve();
    });
  }

  async getPos() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.getCurrentPosition(
        BG_POS_OPT,
        (pos) => resolve(pos),
        (error) => reject(error),
      );
    });
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
