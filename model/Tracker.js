/*  eslint no-undef: 0 */

import {
  Tracker as DBTracker,
  Tick as DBTick,
  type TrackerId,
  type PropType,
  NewTracker,
} from 'app/depot/interfaces';
import { TrackerType, DEFAULT_TRACKER_PROPS } from 'app/depot/consts';
import UserIconsStore from 'app/icons/UserIconsStore';

export class Tick implements DBTick {
  id: string;

  createdAt: number;

  value: number;

  data: ?Object;

  constructor(tick: DBTick) {
    Object.assign(this, tick);
  }
}

// Generics map<> not working w/o flow
export const mapTicks = (ticks: DBTick[] = []) =>
  ticks.map((tick) => new Tick(tick));

export default class Tracker implements DBTracker {
  id: string;

  title: string;

  iconId: string;

  typeId: TrackerId;

  active: boolean;

  ticks: DBTick[];

  oneTick: boolean;

  props: Array<PropType>;

  createdAt: number;

  static get properties() {
    return DEFAULT_TRACKER_PROPS;
  }

  static defaultValues(data: NewTracker) {
    return {
      active: false,
      oneTick: false,
      props: { alerts: false, freq: '1d' },
      ...data,
    };
  }

  constructor(tracker: DBTracker) {
    Object.assign(this, tracker);
    this.ticks = mapTicks(tracker.ticks);
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
    if (!len) {
      return null;
    }
    return this.ticks[len - 1].value;
  }
}

export class SumTracker extends Tracker {
  static get properties() {
    return [...Tracker.properties, { propId: 'showBuck', name: 'Show $ Sign' }];
  }

  static defaultValues(data?: $Shape<NewTracker>) {
    const values = Tracker.defaultValues();
    return {
      props: {
        ...values.props,
        showBuck: false,
      },
      ...data,
    };
  }
}

export class DistanceTracker extends Tracker {
  speed: number;

  static get properties() {
    return [...Tracker.properties, { propId: 'showSpeed', name: 'Show Speed' }];
  }

  static defaultValues(data?: $Shape<NewTracker>) {
    const values = Tracker.defaultValues();
    return {
      active: false,
      props: {
        ...values.props,
        showSpeed: false,
      },
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

export class RateTracker extends Tracker {
  static defaultValues(data?: $Shape<NewTracker>) {
    const values = Tracker.defaultValues(data);
    return {
      ...values,
      oneTick: true,
    };
  }

  constructor(tracker: DBTracker) {
    super(tracker);
    this.oneTick = true;
  }
}
