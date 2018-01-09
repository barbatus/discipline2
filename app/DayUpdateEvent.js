import assert from 'assert';

import moment from 'moment';

import { AppState } from 'react-native';

import time from 'app/time/utils';

export class Timeout {
  waitMs = 0;

  cb = null;

  timeout = null;

  constructor(cb: Function, waitMs: number = 0) {
    this.cb = cb;
    this.waitMs = waitMs;
    this.start();
  }

  get active() {
    return !!this.timeout;
  }

  restart(leftMs: number) {
    this.stop();

    this.waitMs = leftMs;
    this.start();
  }

  start() {
    if (!this.timeout) return;

    this.timeout = setTimeout(this.cb, this.waitMs);
  }

  stop() {
    if (!this.active) return;

    clearTimeout(this.timeout);
    this.timeout = null;
  }
}

export default class DayUpdateEvent {
  downDate = null;

  upDate = null;

  dayTimer = null;

  cbs = [];

  subscribed = false;

  constructor() {
    this.handleAppStateChange = ::this.handleAppStateChange;
  }

  on(cb: Function) {
    assert.ok(cb);
    this.cbs.push(cb);
    if (!this.subscribed) {
      this.subscribe();
      this.setDayTimer();
      this.subscribed = true;
    }
  }

  destroy() {
    this.unsubscribe();
    this.unsetDayTimer();
  }

  unsubscribe() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  subscribe() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  setDayTimer() {
    const left = time.getToDayEndMs();

    if (this.dayTimer) {
      this.dayTimer.restart(left);
      return;
    }

    this.dayTimer = new Timeout(() => {
      this.events.emit('change');
    }, left);
  }

  unsetDayTimer() {
    if (this.dayTimer) {
      this.dayTimer.stop();
    }
  }

  handleAppStateChange(state) {
    if (state === 'background') {
      this.onAppBackground();
    }

    if (state === 'active') {
      this.onAppActive();
    }
  }

  onAppBackground() {
    this.downDate = moment();
  }

  onAppActive() {
    if (!this.downDate) return;

    this.upDate = moment();

    const dateChanged = !time.isSameDate(this.upDate, this.downDate);

    if (dateChanged) {
      this.fireCbs();
    }
    this.setDayTimer();
  }

  fireCbs() {
    this.cbs.forEach(cb => cb());
  }
}
