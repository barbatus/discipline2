/* @flow */
/* eslint no-undef: off */

export type TRACKER_ID = 'distance' | 'goal';

export type AppProps = { alerts: boolean; };

export interface App {
  ver: string;
  props: AppProps;
}

export type PropType = {
  [string]: *;
};

export interface Tracker {
  id: string;
  title: string;
  typeId: TRACKER_ID;
  iconId: string;
  active: false;
  ticks?: Array<Tick>;
  props: Array<PropType>;
}

export interface NewTracker {
  title: string;
  typeId: string;
  iconId: string;
  props: Array<PropType>;
}

export const TRACKER_TYPE = {
  distance: 'distData',
  goal: 'goalData',
};

export interface Tick {
  id: string;
  dateTimeMs: number;
  value: number;
  data: any;
  [key: $Values<typeof TRACKER_TYPE>]: Object;
}
