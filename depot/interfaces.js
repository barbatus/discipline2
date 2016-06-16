 /* @flow */

'use strict';

declare type Tracker = {
  id?: number,
  title:  string,
  typeId: string,
  iconId: string
};

declare type Tick = {
  id?: number;
  trackerId:  number;
  dateTimeMs: number;
  value?: number;
};

declare interface ITicksDepot {
  getAll(trackId: number): Array<Tick>;

  getForPeriod(trackId: number,
               minDateMs: number,
               opt_maxDateMs: number): Array<Tick>;

  getLast(trackId: number): Tick;

  count(trackId: number): number;

  add(tick: Tick): Tick;

  remove(tickId: number): boolean;
};

declare interface ITrackersDepot {
  getAll(): Array<Tracker>;

  getOne(trackId: number): Tracker;

  count(): number;

  addAt(tracker: Tracker, index: number): Tracker;

  add(tracker: Tracker): Tracker;

  remove(trackId: number): boolean;

  update(tracker: Tracker): boolean;

  addTick(trackId: number,
          dateTimeMs: number,
          opt_value: number): Tick;

  getTicks(trackId: number,
           minDateMs: number,
           opt_maxDateMs: number): Array<Tick>;

  getLastTick(trackId: number): Tick;

  getTodayTicks(trackId: number): Array<Tick>;

  getTodayCount(trackId: number): number;

  getTodayValues(trackId: number): Array<number>;
};
