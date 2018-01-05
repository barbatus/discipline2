/* @flow */
import EventEmitter from 'eventemitter3';

import omit from 'lodash/omit';

import DB from './db';

class Trackers {
  event = new EventEmitter();

  table: TrackersSchemaType;

  constructor() {
    const table = DB.objects('Trackers');
    if (!table.length) {
      DB.write(() => DB.create('Trackers', {}));
    }
    this.table = table[0];
  }

  get trackers() {
    return this.table.trackers;
  }

  getAll(): Array<Tracker> {
    return this.trackers.slice();
  }

  getOne(trackId: number): Tracker {
    check.assert.number(trackId);

    return DB.objectForPrimaryKey('Tracker', trackId);
  }

  count(): number {
    return this.trackers.length;
  }

  buildNewTracker(id, data) {
    return { props: { alerts: false }, ...data, id };
  }

  addAt(data: Tracker, index: number): Tracker {
    const trackId = this.table.nextId;
    const tracker = this.buildNewTracker(trackId, data);
    DB.write(() => {
      this.trackers.splice(index, 0, tracker);
      this.table.nextId = tracker.id + 1;
    });

    return tracker;
  }

  add(data: Tracker): Tracker {
    const trackId = this.table.nextId;
    const tracker = this.buildNewTracker(trackId, data);
    DB.write(() => {
      this.trackers.push(tracker);
      this.table.nextId = tracker.id + 1;
    });

    this.event.emit('added', {
      trackId: tracker.id,
    });

    return tracker;
  }

  remove(trackId: number): boolean {
    check.assert.number(trackId);

    const tracker = this.getOne(trackId);

    if (!tracker) throw new Error('No tracker found');

    DB.write(() => DB.delete(tracker));
    this.event.emit('removed', { trackId });
    return true;
  }

  update(data: Tracker): Tracker {
    const tracker = this.getOne(data.id);

    if (!tracker) throw new Error('No tracker found');

    DB.write(() =>
      Object.assign(tracker, omit(data, 'id'))
    );

    this.event.emit('updated', {
      trackId: tracker.id,
    });

    return tracker;
  }
}

export default new Trackers();
