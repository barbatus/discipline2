/* @flow */

import EventEmitter from 'eventemitter3';

import { omit } from 'lodash';

import ticksDB from './ticks';

import DB from './db';

class TrackersDepot {
  events: EventEmitter = new EventEmitter();

  table: TrackersSchemaType;

  constructor() {
    const table = DB.objects('Trackers');
    if (!table.length) {
      DB.write(() => {
        DB.create('Trackers', {});
      });
    }
    this.table = table[0];
  }

  getAll(): Array<Tracker> {
    return this.trackers.slice();
  }

  getOne(trackId: number): Tracker {
    check.assert.number(trackId);

    const trackers = this.trackers.filtered('id = $0', trackId);
    return trackers[0];
  }

  count(): number {
    const trackers = this.getAll();
    return trackers.length;
  }

  addAt(tracker: Tracker, index: number): Tracker {
    DB.write(() => {
      tracker.id = this.table.nextId;
      this.trackers.splice(index, 0, tracker);
      this.table.nextId = tracker.id + 1;
    });

    return tracker;
  }

  add(tracker: Tracker): Tracker {
    DB.write(() => {
      tracker.id = this.table.nextId;
      this.trackers.push(tracker);
      this.table.nextId = tracker.id + 1;
    });

    this.events.emit('added', {
      trackId: tracker.id,
    });

    return tracker;
  }

  remove(trackId: number): boolean {
    check.assert.number(trackId);

    const tracker = this.trackers.filtered('id = $0', trackId)[0];
    if (tracker) {
      DB.write(() => {
        DB.delete(tracker);
      });
    }

    this.events.emit('removed', { trackId });

    return !!tracker;
  }

  update(tracker: Tracker): Tracker {
    const dbTracker = this.trackers.filtered('id = $0', tracker.id)[0];

    if (!dbTracker) return null;

    DB.write(() => {
      Object.assign(dbTracker, omit(tracker, 'id'));
    });

    this.events.emit('updated', {
      trackId: tracker.id,
    });

    return tracker;
  }

  get trackers() {
    return this.table.trackers;
  }
}

const depot = new TrackersDepot();
export default depot;
