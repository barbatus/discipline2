/* @flow */

import assert from 'assert';

import has from 'lodash/has';

import isObject from 'lodash/isObject';

import db from './db';

class Trackers {
  async getOne(trackId: string): Promise<Tracker> {
    return db.find('tracker', trackId);
  }

  async getAll(): Promise<Tracker[]> {
    const list = await db.findOne('trackerList');
    return list ? list.trackers : [];
  }

  async add(data: Tracker, index?: number): Tracker {
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

  async update(data: Tracker): Tracker {
    let tracker = await this.getOne(data.id);
    if (!tracker) { return null; }

    tracker = { ...tracker, ...data };
    return await db.save('tracker', tracker);
  }

  async remove(trackerOrId: string | Tracker): boolean {
    if (isObject(trackerOrId)) {
      assert(has(trackerOrId, 'rev'));
    }

    const tracker = isObject(trackerOrId) ?
      trackerOrId : await this.getOne(trackerOrId);
    if (!tracker) { return false; }

    const list = await db.findOneRaw('trackerList');
    const trackers = list.trackers;
    const trackInd = trackers.findIndex((id) => id === tracker.id);
    trackers.splice(trackInd, 1);
    await db.save('trackerList', { ...list, trackers });
    await db.del('tracker', tracker);
    return true;
  }

  buildNewTracker(data: Tracker) {
    return { props: { alerts: false }, ...data };
  }
}

export default new Trackers();
