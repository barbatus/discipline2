 /* @flow */

'use strict';

import ticksDB from './ticks';

import DB from './db';

import EventEmitter from 'eventemitter3';

class TrackersDepot {
  events: EventEmitter = new EventEmitter();

  _table: TrackersSchemaType;

  constructor() {
    let table = DB.objects('Trackers');
    if (!table.length) {
      DB.write(() => {
        DB.create('Trackers', {});
      });
    }
    this._table = table[0];
  }

  get _trackers() {
    return this._table.trackers;
  }

  getAll(): Array<Tracker> {
    return this._trackers.map(tracker => tracker);
  }

  getOne(trackId: number): Tracker {
    check.assert.number(trackId);

    let trackers = this._trackers.filtered('id = $0', trackId);
    return trackers[0];
  }

  count(): number {
    let trackers = this.getAll();
    return trackers.length;
  }

  addAt(tracker: Tracker, index: number): Tracker {
    DB.write(() => {
      tracker.id = this._table.nextId;
      this._trackers.splice(index, 0, tracker);
      this._table.nextId = tracker.id + 1;
    });

    return tracker;
  }

  add(tracker: Tracker): Tracker {
    DB.write(() => {
      tracker.id = this._table.nextId;
      this._trackers.push(tracker);
      this._table.nextId = tracker.id + 1;
    });

    this.events.emit('added', {
      trackerId: tracker.id
    });

    return tracker;
  }

  remove(trackId: number): boolean {
    check.assert.number(trackId);

    let tracker = this._trackers
      .filtered('id = $0', trackId)[0];
    if (tracker) {
      DB.write(() => {
        DB.delete(tracker);
      });
    }

    this.events.emit('removed', {
      trackerId: trackId
    });

    return !!tracker;
  }

  update(data: Tracker): boolean {
    let tracker = this._trackers
      .filtered('id = $0', data.id)[0];    
    if (tracker) {
      DB.write(() => {
        Object.assign(tracker, data);
      });
    }

    this.events.emit('updated', {
      trackerId: tracker.id
    });

    return !!tracker;
  }

  addTick(trackId: number,
          dateTimeMs: number,
          value?: number): Tick {
    check.assert.number(trackId);
    check.assert.number(dateTimeMs);

    return ticksDB.add({
      trackerId: trackId,
      dateTimeMs: dateTimeMs,
      value: value
    });
  }

  getTicks(trackId: number,
           minDateMs: number,
           maxDateMs?: number): Array<Tick> {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    return ticksDB.getForPeriod(
      trackId, minDateMs, maxDateMs);
  }

  getLastTick(trackId: number): Tick {
    return ticksDB.getLast(trackId);
  }

  getTodayTicks(trackId: number): Array<Tick> {
    check.assert.number(trackId);

    return this.getTicks(trackId, time.getDateMs());
  }

  getTodayCount(trackId: number): number {
    let ticks = this.getTodayTicks(trackId);
    return ticks.length;
  }

  getTodayValues(trackId: number): Array<number> {
    let ticks = this.getTodayTicks(trackId);
    return ticks.map(tick => tick.value ? tick.value : 0);
  }
};

let depot = new TrackersDepot();
export default depot;
