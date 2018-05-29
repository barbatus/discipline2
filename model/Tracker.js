import { TrackerType } from 'app/depot/consts';

import { Tracker as DBTracker, Tick as DBTick, type TRACKER_ID } from 'app/depot/interfaces';

import UserIconsStore from 'app/icons/UserIconsStore';

export class Tick implements DBTick {
  id: string;
  dateTimeMs: number;
  value: number;
  data: ?Object;

  constructor(tick: DBTick) {
    this.id = tick.id;
    this.dateTimeMs = tick.dateTimeMs;
    this.value = tick.value;
    this.data = tick.data;
    this.time = tick.time;
    this.latlon = tick.latlon;
    this.active = this.active;
  }
}

export const mapTicks = (ticks: DBTick[] = []) => ticks.map((tick) => new Tick(tick));

export default class Tracker implements DBTracker {
  id: string;
  title: string;
  iconId: string;
  typeId: TRACKER_ID;
  active: boolean;
  ticks: DBTick[];

  constructor(tracker: DBTracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;
    this.ticks = mapTicks(tracker.ticks);
    this.props = tracker.props;
    this.active = tracker.active;
  }

  clone(data?: Object) {
    const tracker = Object.assign(Object.getPrototypeOf(this), this, data);
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
    return this.count !== 0;
  }

  get value() {
    const values = this.ticks.map((tick) => tick.value || 0);
    return values.reduceRight((p, n) => p + n, 0);
  }

  get lastValue() {
    const len = this.ticks.length;
    if (!len) return null;
    return this.ticks[len - 1].value;
  }
}

export class DistanceTracker extends Tracker {
  get time() {
    const times = this.ticks.map((tick) => tick.time || 0);
    return times.reduceRight((p, n) => p + n, 0);
  }

  get paths() {
    return this.ticks.map((tick) => tick.latlon || []);
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
