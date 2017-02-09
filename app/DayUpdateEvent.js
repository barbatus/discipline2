'use strict';

import assert from 'assert';

import moment from 'moment';

import {AppState} from 'react-native';

import EventEmitter from 'eventemitter3';

import {caller} from '../utils/lang';

class Timeout {
  _waitMs = 0;

  _cb = null;

  _timeout = null;

  constructor(cb: Function, waitMs: number = 0) {
    this._cb = cb;
    this._waitMs = waitMs;
    this.start();
  }

  get active() {
    return !!this._timeout;
  }

  restart(leftMs: number) {
    this.stop();

    this._waitMs = leftMs;
    this.start();
  }

  start() {
    if (!this._timeout) return;

    this._timeout = setTimeout(this._cb, this._waitMs);
  }

  stop() {
    if (!this.active) return;

    clearTimeout(this._timeout);
    this._timeout = null;
  }
}

export default class DayUpdateEvent {
  _downDate = null;

  _upDate = null;

  _dayTimer = null;

  _cbs = [];

  _subscribed = false;

  on(cb: Function) {
    assert.ok(cb);
    this._cbs.push(cb);
    if (!this._subscribed) {
      this._subscribe();
      this._setDayTimer();
      this._subscribed = true;
    }
  }

  destroy() {
    this._unsubscribe();
    this._unsetDayTimer();
  }

  _unsubscribe() {
    AppState.removeEventListener('change',
      ::this._handleAppStateChange);
  }

  _subscribe() {
    AppState.addEventListener('change',
      ::this._handleAppStateChange);
  }

  _setDayTimer() {
    const left = time.getToDayEndMs();

    if (this._dayTimer) {
      this._dayTimer.restart(left);
      return;
    }

    this._dayTimer = new Timeout(() => {
      this.events.emit('change');
    }, left);
  }

  _unsetDayTimer() {
    if (this._dayTimer) {
      this._dayTimer.stop();
    }
  }

  _handleAppStateChange(state) {
    if (state === 'background') {
      this._onAppBackground();
    }

    if (state === 'active') {
      this._onAppActive();
    }
  }

  _onAppBackground() {
    this._downDate = moment();
  }

  _onAppActive() {
    this._upDate = moment();

    const dateChanged = !time.isSameDate(
      this._upDate, this._downDate);

    if (dateChanged) {
      this._fireCbs();
    }
    this._setDayTimer();
  }

  _fireCbs() {
    this._cbs.forEach(cb => cb());
  }
}
