import check from 'check-types';

import omit from 'lodash/omit';

import { NewTracker, Tracker } from '../interfaces';
import { TrackersSchemaType } from './interfaces';
import db from './db';

class Trackers {
  table: TrackersSchemaType;

  constructor() {
    const table = db.objects('Trackers');
    if (!table.length) {
      db.write(() => db.create('Trackers', {}));
    }
    [this.table] = table;
  }

  get trackers() {
    return this.table.trackers;
  }

  getAll(): Array<Tracker> {
    return this.trackers.slice();
  }

  getOne(trackId: string): Tracker {
    check.assert.string(trackId);

    return db.objectForPrimaryKey('Tracker', trackId);
  }

  count(): number {
    return this.trackers.length;
  }

  addAt(data: NewTracker, index: number): Tracker {
    const trackId = this.table.nextId.toString();
    const tracker = { ...data, id: trackId };
    db.write(() => {
      this.trackers.splice(index, 0, tracker);
      this.table.nextId = this.table.nextId + 1;
    });

    return tracker;
  }

  add(data: NewTracker): Tracker {
    const trackId = this.table.nextId.toString();
    const tracker = { ...data, id: trackId };
    db.write(() => {
      this.trackers.push(tracker);
      this.table.nextId = this.table.nextId + 1;
    });
    return tracker;
  }

  remove(trackId: string): boolean {
    check.assert.string(trackId);

    const tracker = this.getOne(trackId);
    if (!tracker) { return false; }

    db.write(() => db.delete(tracker));
    return true;
  }

  update(data: Tracker): Tracker {
    const tracker = this.getOne(data.id);
    if (!tracker) { return null; }

    db.write(() =>
      Object.assign(tracker, omit(data, 'id'))
    );
    return tracker;
  }
}

export default new Trackers();
