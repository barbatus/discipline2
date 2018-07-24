import check from 'check-types';

import EventEmitter from 'eventemitter3';

import { caller } from 'app/utils/lang';

const NAV_POS_OPT = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 1000,
};

export default class NavGeoLocationWatcherKls {
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

    if (this.watchId) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.watchId = navigator.geolocation.watchPosition(
          (pos) => this.emitter.emit('position', pos),
          null, NAV_POS_OPT,
        );
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

  listenerCount(event) {
    return this.emitter.listeners(event).length;
  }
}
