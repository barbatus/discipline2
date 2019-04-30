/* @flow */
import check from 'check-types';
import assert from 'assert';
import isObject from 'lodash/isObject';
import has from 'lodash/has';

import { Tracker, Notification } from '../interfaces';

import db from './db';

class Notifications {
  async getOne(notifId: string): Promise<Notification> {
    return db.find('notification', notifId);
  }

  async getLastOne(trackId: string): Promise<Notification> {
    check.assert.string(trackId);

    const notifs = await db.selectOrderBy('notification', 'tracker', trackId, 'createdAt');
    return notifs[0];
  }

  async getLastWithLimit(trackId: string, limit: number): Promise<Notification[]> {
    return db.selectOrderBy('notification', 'tracker', trackId, 'createdAt', limit);
  }

  async add(notif: { tracker: Tracker, createdAt: number }): Promise<Notification> {
    return db.save('notification', notif);
  }

  async remove(notifOrId: string | Notification) {
    if (isObject(notifOrId)) {
      assert(has(notifOrId, 'rev'));
    }

    const notif = typeof notifOrId === 'string' ?
      await this.getOne(notifOrId) : notifOrId;
    if (!notif) { return false; }

    return Boolean(await db.del('notification', notif));
  }

  async removeForTracker(trackId: string) {
    const notifs = await db.findHasMany('notification', 'tracker', trackId);
    await Promise.all(notifs.map((notif) => db.del('notification', notif)));
    return notifs.map((notif) => notif.id);
  }
}

export default new Notifications();
