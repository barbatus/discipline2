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

  async add(data: NewTracker): Promise<Tracker> {
    const tracker = await db.save('tracker', data);
    return tracker;
  }

  async update(data: Tracker): Promise<Tracker> {
    let tracker = await this.getOne(data.id);
    if (!tracker) {
      return tracker;
    }

    tracker = { ...tracker, ...data };
    return db.save('tracker', tracker);
  }

  async remove(trackerOrId: string | Tracker): Promise<?string> {
    if (isObject(trackerOrId)) {
      assert(has(trackerOrId, 'rev'));
    }

    const tracker =
      typeof trackerOrId === 'string' ?
        await this.getOne(trackerOrId) :
        trackerOrId;
    if (!tracker) {
      return null;
    }

    await db.del('tracker', tracker);
    return tracker.id;
  }
}

export default new Trackers();
