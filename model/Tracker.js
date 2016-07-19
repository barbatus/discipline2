'use strict';

import {TrackerType} from '../depot/consts';

import {Tracker as ITracker} from '../depot/interfaces';

import UserIconsStore from '../icons/UserIconsStore';

export default class Tracker {
  id: number;
  title: string;
  iconId: string;
  typeId: string;

  _changeCbs: Array<Function> = [];

  _ticksCbs: Array<Function> = [];

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
    return values.reduceRight((prevVal, nextVal) => {
      return prevVal + nextVal;
    }, 0);
  }

  tick(value, onResult) {
    if (_.isFunction(value)) {
      onResult = value;
      value = null;
    }
    return this.addTick(value);
  }

  undo() {
    let tick = this.lastTick;
    depot.ticks.remove(tick.id);
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

  getTicks(startDateMs: number) {
    return depot.trackers.getTicks(this.id, startDateMs);
  }

  getTodayTicks() {
    return depot.trackers.getTodayTicks(this.id);
  }

  destroy() {
    this._unsubscribe();
    this._changeCbs = null;
    this._ticksCbs = null;
  }

  onChange(cb: Function) {
    check.assert.function(cb);

    this._changeCbs.push(cb);
  }

  onTick(cb: Function) {
    check.assert.function(cb);

    this._ticksCbs.push(cb);
  }

  _unsubscribe() {
    depot.trackers.events.removeListener('updated',
      this._onUpdated.bind(this));
    depot.ticks.events.removeListener('added',
      this._onTicks.bind(this));
    depot.ticks.events.removeListener('removed',
      this._onTicks.bind(this));
  }

  _subscribe() {
    depot.trackers.events.on('updated',
      this._onUpdated.bind(this));
    depot.ticks.events.on('added',
      this._onTicks.bind(this));
    depot.ticks.events.on('removed',
      this._onTicks.bind(this));
  }

  _onTicks(event) {
    if (event.trackerId === this.id) {
      this._ticksCbs.forEach(cb => cb());
    }
  }

  _onUpdated(event) {
    if (event.trackerId === this.id) {
      this._changeCbs.forEach(cb => cb());
    }
  }
}
