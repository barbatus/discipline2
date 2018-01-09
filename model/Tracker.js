import { TrackerType } from 'app/depot/consts';

import { Tracker as ITracker } from 'app/depot/interfaces';

import UserIconsStore from 'app/icons/UserIconsStore';

export default class Tracker {
  id: number;
  title: string;
  iconId: string;
  typeId: string;
  active: boolean;

  constructor(tracker: ITracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;
    this.ticks = tracker.ticks || [];
    this.props = tracker.props;
    this.active = tracker.active;
  }

  clone(data?: Object) {
    const tracker = Object.assign(Object.create(this.__proto__), this, data);
    return tracker;
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
    const count = this.count;
    return count !== 0;
  }

  get value() {
    const values = this.ticks.map((tick) => tick.value || 0);
    return values.reduceRight((p, n) => p + n, 0);
  }
}

export class DistanceTracker extends Tracker {
  get time() {
    const times = this.ticks.map((tick) => tick.time || 0);
    return times.reduceRight((p, n) => p + n, 0);
  }

  get paths() {
    return this.ticks.map((tick) => tick.latlon);
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
