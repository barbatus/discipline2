 /* @flow */

declare type Tracker = {
  id?: number;
  title:  string;
  typeId: string;
  iconId: string;
  ticks?: Array<Tick>;
};

declare type Tick = {
  id?: number;
  trackerId:  number;
  dateTimeMs: number;
  value?: number;
  data?: Object;
};

declare interface IDepot {
  loadTrackers(): Array<Tracker>;

  getTracker(trackId: number): Tracker;

  addTracker(tracker: Tracker): Tracker;

  addTrackerAt(tracker: Tracker, index: number): Tracker;

  removeTracker(trackId: number): boolean;

  updateTracker(tracker: Tracker): boolean;

  addTick(trackId: number, dateTimeMs: number, value?: number, data?: Object): Tick;

  getTicks(trackId: number, minDateMs: number, maxDateMs?: number): Array<Tick>;

  undoLastTick(trackId: number): boolean;

  updateLastTick(trackId: number, value?: number, data?: Object): Tick;
};
