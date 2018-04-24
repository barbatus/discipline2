/* @flow */

import assert from 'assert';

import has from 'lodash/has';
import isObject from 'lodash/isObject';

import { DBTracker } from '../interfaces';
import db from './db';

class Trackers {
  async getOne(trackId: string): Promise<DBTracker> {
    return db.find('tracker', trackId);
  }

  async getAll(): Promise<DBTracker[]> {
    const list = await db.findOne('trackerList');
    return list ? list.trackers : [];
  }

  async add(data: DBTracker, index?: number): DBTracker {
    const tracker = this.buildNewTracker(data);
    const newTracker = await db.save('tracker', tracker);
    const list = await db.findOneRaw('trackerList');
    const idObj = { id: newTracker.id };
    const trackers = list ? list.trackers : [];
    const at = index !== undefined ? index : trackers.length;
    trackers.splice(at, 0, idObj);
    await db.save('trackerList', { ...list, trackers });
    return newTracker;
  }

  async update(data: DBTracker): DBTracker {
    let tracker = await this.getOne(data.id);
    if (!tracker) { return null; }

    tracker = { ...tracker, ...data };
    return db.save('tracker', tracker);
  }

  async remove(trackerOrId: string | DBTracker): boolean {
    if (isObject(trackerOrId)) {
      assert(has(trackerOrId, 'rev'));
    }

    const tracker = isObject(trackerOrId) ?
      trackerOrId : await this.getOne(trackerOrId);
    if (!tracker) { return false; }

    const list = await db.findOneRaw('trackerList');
    const trackInd = list.trackers.findIndex((id) => id === tracker.id);
    list.trackers.splice(trackInd, 1);
    await db.save('trackerList', list);
    await db.del('tracker', tracker);
    return true;
  }

  buildNewTracker(data: DBTracker) {
    return { props: { alerts: false }, ...data };
  }
}

export default new Trackers();
