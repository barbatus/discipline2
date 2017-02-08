'use strict';

import moment from 'moment';

import {AppState} from 'react-native';

import {TrackerType} from '../depot/consts';

import {Tracker as ITracker} from '../depot/interfaces';

import UserIconsStore from '../icons/UserIconsStore';

import EventEmitter from 'eventemitter3';

import {caller} from '../utils/lang';

class Timer {
  _ms = 0;

  _fn = null;

  _timer = null;

  constructor(fn: Function, ms: number = 0) {
    this._fn = fn;
    this._ms = ms;
    this.start();
  }

  get active() {
    return !!this._timer;
  }

  restart(ms: number) {
    this.stop();

    this._ms = ms;
    this.start();
  }

  start() {
    if (!this._timer) return;

    this._timer = setTimeout(this._fn, this._ms);
  }

  stop() {
    if (!this.active) return;

    clearTimeout(this._timer);
    this._timer = null;
  }
}

export default class Tracker {
  id: number;
  title: string;
  iconId: string;
  typeId: string;

  events: EventEmitter = new EventEmitter();

  _downDate = null;

  _upDate = null;

  _dayTimer = null;

  constructor(tracker: ITracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;

    // this._subscribe();
    // this._setDayTimer();
  }

  get type() {
    return TrackerType.fromValue(this.typeId);
  }

  set type(type) {
    this.typeId = type.valueOf();
  }

  get icon() {
    return UserIconsStore.get(this.iconId);
  }

  set icon(icon) {
    this.iconId = icon.id;
  }

  get lastTick() {
    return depot.trackers.getLastTick(this.id);
  }

  get count() {
    return depot.trackers.getTodayCount(this.id);
  }

  get checked() {
    let count = this.count;
    return count != 0;
  }

  get value() {
    let values = depot.trackers.getTodayValues(this.id);
    return values.reduceRight((p, n) => {
      return p + n;
    }, 0);
  }

  updLastTick(value: number) {
    return depot.trackers.updLastTick(this.id, value);
  }

  getTicks(startDateMs: number) {
    return depot.trackers.getTicks(this.id, startDateMs);
  }

  getTodayTicks() {
    return depot.trackers.getTodayTicks(this.id);
  }

  destroy() {
    this.stop();
    this._unsetDayTimer();
    this._unsubscribe();
  }

  onAppActive(diff, dateChanged) {
    if (dateChanged) {
      this.events.emit('change');
      return;
    }

    this._setDayTimer();
  }

  onAppBackground() {}

  _unsubscribe() {
    // depot.trackers.events.removeListener('updated',
    //   this._onUpdated, this);
    // depot.ticks.events.removeListener('added',
    //   this._onTicks, this);
    // depot.ticks.events.removeListener('removed',
    //   this._onUndos, this);

    AppState.removeEventListener('change',
      ::this._handleAppStateChange);
  }

  _subscribe() {
    // depot.trackers.events.on('updated',
    //   this._onUpdated, this);
    // depot.ticks.events.on('added',
    //   this._onTicks, this);
    // depot.ticks.events.on('removed',
    //   this._onUndos, this);

    AppState.addEventListener('change',
      ::this._handleAppStateChange);
  }

  _setDayTimer() {
    let left = time.getToDayEndMs();

    if (this._dayTimer) {
      this._dayTimer.restart(left);
      return;
    }

    this._dayTimer = new Timer(() => {
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
    this.onAppBackground(
      this._downDate.valueOf());
  }

  _onAppActive() {
    this._upDate = moment();

    let dateChanged = !time.isSameDate(
      this._upDate, this._downDate);

    let diff = this._upDate.diff(this._downDate, 'milliseconds');
    this.onAppActive(diff, dateChanged);
  }
}
