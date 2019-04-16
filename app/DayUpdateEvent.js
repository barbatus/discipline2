import assert from 'assert';

import { AppState } from 'react-native';

import time from 'app/time/utils';

export class Timeout {
  waitMs = 0;

  cb: Function;

  timeout: number;

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
  downDateMs: number;

  dayTimer: Timeout;

  cbs: Function[] = [];

  subscribed = false;

  constructor() {
    this.onAppStateChange = ::this.onAppStateChange;
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

  dispose() {
    this.unsubscribe();
    this.unsetDayTimer();
  }

  unsubscribe() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  subscribe() {
    AppState.addEventListener('change', this.onAppStateChange);
  }

  setDayTimer() {
    const left = time.getToEndDayMs();

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

  onAppStateChange(state) {
    if (state === 'background') {
      this.onAppBackground();
    }

    if (state === 'active') {
      this.onAppActive();
    }
  }

  onAppBackground() {
    this.downDateMs = Date.now();
  }

  onAppActive() {
    if (!this.downDateMs) return;

    const dateChanged = !time.isSameDate(Date.now(), this.downDateMs);

    if (dateChanged) {
      this.fireCbs();
    }
    this.setDayTimer();
  }

  fireCbs() {
    this.cbs.forEach((cb) => cb());
  }
}
