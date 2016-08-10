'use strict';

import moment from 'moment';

import {AppState} from 'react-native';

import {TrackerType} from '../depot/consts';

import {Tracker as ITracker} from '../depot/interfaces';

import UserIconsStore from '../icons/UserIconsStore';

import EventEmitter from 'eventemitter3';

import {caller} from '../utils/lang';

export default class Tracker {
  id: number;
  title: string;
  iconId: string;
  typeId: string;

  events: EventEmitter = new EventEmitter();

  _downDate = null;

  _upDate = null;

  constructor(tracker: ITracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;

    this._subscribe();
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

  get isActive() {
    return false;
  }

  tick(value?: number) {
    return this.addTick(value);
  }

  undo() {
    let tick = this.lastTick;
    if (tick) {
      depot.ticks.remove(tick.id);
    }
  }

  save() {
    return depot.trackers.update({
      id: this.id,
      title: this.title,
      typeId: this.typeId,
      iconId: this.iconId
    });
  }

  remove() {
    depot.trackers.remove(this.id);
    this.destroy();
    return true;
  }

  addTick(value?: number) {
    return depot.trackers.addTick(this.id,
      time.getDateTimeMs(), value);
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
    this._unsubscribe();
  }

  fireValue(value) {
    this.events.emit('value', value);
  }

  fireStop() {
    this.events.emit('stop');
  }

  onAppActive() {}

  onAppBackground() {}

  _unsubscribe() {
    depot.trackers.events.removeListener('updated',
      ::this._onUpdated);
    depot.ticks.events.removeListener('added',
      ::this._onTicks);
    depot.ticks.events.removeListener('removed',
      ::this._onUndos);

    AppState.removeEventListener('change',
      ::this._handleAppStateChange);
  }

  _subscribe() {
    depot.trackers.events.on('updated',
      ::this._onUpdated);
    depot.ticks.events.on('added',
      ::this._onTicks);
    depot.ticks.events.on('removed',
      ::this._onUndos);

    AppState.addEventListener('change',
      ::this._handleAppStateChange);
  }

  _onTicks(event) {
    if (event.trackId === this.id) {
      this.events.emit('tick');
    }
  }

  _onUndos(event) {
    if (event.trackId === this.id) {
      this.events.emit('undo');
    }
  }

  _onUpdated(event) {
    if (event.trackId === this.id) {
      this.events.emit('change');
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
    if (dateChanged) {
      this.events.emit('change');
    }

    let diff = this._upDate.diff(this._downDate, 'milliseconds');
    this.onAppActive(diff, dateChanged);
  }

}
