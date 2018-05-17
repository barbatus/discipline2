/* @flow */
/* eslint no-undef: off */

export type TRACKER_ID = 'distance' | 'goal';

export interface Tracker {
  id: string;
  title: string;
  typeId: TRACKER_ID;
  iconId: string;
  ticks?: Array<Tick>;
}

export interface NewTracker {
  title: string;
  typeId: string;
  iconId: string;
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
