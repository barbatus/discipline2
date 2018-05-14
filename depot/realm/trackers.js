/* @flow */
import check from 'check-types';

import omit from 'lodash/omit';

import { DBTracker } from '../interfaces';
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

  getAll(): Array<DBTracker> {
    return this.trackers.slice();
  }

  getOne(trackId: string): DBTracker {
    check.assert.string(trackId);

    return db.objectForPrimaryKey('Tracker', trackId);
  }

  count(): number {
    return this.trackers.length;
  }

  buildNewTracker(id: string, data: DBTracker) {
    return { props: { alerts: false }, ...data, id };
  }

  addAt(data: DBTracker, index: number): DBTracker {
    const trackId = this.table.nextId.toString();
    const tracker = this.buildNewTracker(trackId, data);
    db.write(() => {
      this.trackers.splice(index, 0, tracker);
      this.table.nextId = this.table.nextId + 1;
    });

    return tracker;
  }

  add(data: DBTracker): DBTracker {
    const trackId = this.table.nextId.toString();
    const tracker = this.buildNewTracker(trackId, data);
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

  update(data: DBTracker): DBTracker {
    const tracker = this.getOne(data.id);
    if (!tracker) { return null; }

    db.write(() =>
      Object.assign(tracker, omit(data, 'id'))
    );
    return tracker;
  }
}

export default new Trackers();
