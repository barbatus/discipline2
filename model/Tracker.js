/*  eslint no-undef: 0 */

import {
  Tracker as DBTracker,
  Tick as DBTick,
  type TrackerId,
  NewTracker,
  type PropType,
} from 'app/depot/interfaces';
import { TrackerType, DEFAULT_TRACKER_PROPS } from 'app/depot/consts';

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
    this.active = tick.active;
  }
}

// Generics map<> not working w/o flow
export const mapTicks = (ticks: DBTick[] = []) => ticks.map((tick) => new Tick(tick));

export default class Tracker implements DBTracker {
  id: string;

  title: string;

  iconId: string;

  typeId: TrackerId;

  active: boolean;

  ticks: DBTick[];

  props: Array<PropType>;

  static get properties() {
    return DEFAULT_TRACKER_PROPS;
  }

  static defaultValues(data: NewTracker) {
    return {
      active: false,
      props: { alerts: false },
      ...data,
    };
  }

  constructor(tracker: DBTracker) {
    this.id = tracker.id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;
    this.ticks = mapTicks(tracker.ticks);
    this.props = tracker.props;
    this.active = tracker.active;
  }

  get type() {
    return TrackerType.fromValue(this.typeId);
  }

  set type(type: any) {
    this.typeId = type.valueOf();
  }

  get icon() {
    return UserIconsStore.get(this.iconId);
  }

  set icon(icon: any) {
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
  speed: number;

  static get properties() {
    return [
      ...Tracker.properties,
      { propId: 'showSpeed', name: 'Show Speed' },
    ];
  }

  static defaultValues(data?: $Shape<NewTracker>) {
    return {
      active: false,
      props: { alerts: false, showSpeed: false },
      ...data,
    };
  }

  constructor(tracker: DBTracker) {
    super(tracker);
    this.speed = 0;
  }

  get time() {
    const times = this.ticks.map((tick) => tick.time || 0);
    return times.reduceRight((p, n) => p + n, 0);
  }

  get paths() {
    return this.ticks.map((tick) => tick.latlon || []);
  }
}
