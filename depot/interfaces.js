/* @flow */

export interface DBTracker {
  id?: number;
  title: string;
  typeId: string;
  iconId: string;
  ticks?: Array<DBTick>;
}

export interface DBTick {
  id?: number;
  trackerId: number;
  dateTimeMs: number;
  value?: number;
  data?: Object;
}
