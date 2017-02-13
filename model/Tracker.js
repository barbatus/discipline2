'use strict';

import moment from 'moment';

import {TrackerType} from '../depot/consts';

import {Tracker as ITracker} from '../depot/interfaces';

import UserIconsStore from '../icons/UserIconsStore';

export default class Tracker {
  id: number;
  title: string;
  iconId: string;
  typeId: string;

  constructor(tracker: ITracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;
    this.ticks = tracker.ticks || [];
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
    return this.ticks[this.count - 1];
  }

  get count() {
    return this.ticks.length;
  }

  get checked() {
    let count = this.count;
    return count != 0;
  }

  get value() {
    const values = this.ticks.map(tick => tick.value || 0);
    return values.reduceRight((p, n) => {
      return p + n;
    }, 0);
  }
}

export class DistanceTracker extends Tracker {
  get time() {
    const data = this.ticks.map(tick => tick.data || {});
    const times = data.map(item => item.time || 0);
    return times.reduceRight((p, n) => {
      return p + n;
    }, 0);
  }
  // onAppActive(diffMs, dateChanged) {
  //   super.onAppActive(diffMs, dateChanged);

  //   if (!this.isActive) return;

  //   // Each tracker can't run more than a day,
  //   // so day's changed, we check how much time past
  //   // since the day start to estimate exact time
  //   // to add to the prev tracker click.
  //   if (dateChanged) {
  //     clearInterval(this._hInterval);
  //     let past = time.getFromDayStartMs();
  //     diffMs -= past;
  //   }

  //   this._time += diffMs;
  //   this._updateTick(
  //     this._initDist, this._dist,
  //     this._initTime, this._time, true);
  // }
}
