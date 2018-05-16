/* @flow */

import assert from 'assert';

import has from 'lodash/has';
import isObject from 'lodash/isObject';

import { Tracker, NewTracker } from '../interfaces';
import db from './db';

class Trackers {
  async getOne(trackId: string): Promise<Tracker> {
    return db.find('tracker', trackId);
  }

  async getAll(): Promise<Tracker[]> {
    const list = await db.findOne('trackerList');
    return list ? list.trackers : [];
  }

  async add(data: NewTracker, index?: number): Promise<Tracker> {
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

  async update(data: Tracker): Promise<Tracker> {
    let tracker = await this.getOne(data.id);
    if (!tracker) { return tracker; }

    tracker = { ...tracker, ...data };
    return db.save('tracker', tracker);
  }

  async remove(trackerOrId: string | Tracker): Promise<boolean> {
    if (isObject(trackerOrId)) {
      assert(has(trackerOrId, 'rev'));
    }

    const tracker = typeof trackerOrId === 'string' ?
      await this.getOne(trackerOrId) : trackerOrId;
    if (!tracker) { return false; }

    const list = await db.findOneRaw('trackerList');
    const trackInd = list.trackers.findIndex((id) => id === tracker.id);
    list.trackers.splice(trackInd, 1);
    await db.save('trackerList', list);
    await db.del('tracker', tracker);
    return true;
  }

  buildNewTracker(data: NewTracker) {
    return { props: { alerts: false }, ...data };
  }
}

export default new Trackers();
