/* @flow */

import assert from 'assert';
import isObject from 'lodash/isObject';
import has from 'lodash/has';

import { Tracker, Notification } from '../interfaces';

import db from './db';

class Notifications {
  async getOne(alertId: string): Promise<Notification> {
    return db.find('notification', alertId);
  }

  async getLastWithLimit(trackId: string, limit: number): Promise<Notification[]> {
    return db.selectOrderBy('notification', 'tracker', trackId, 'createdAt', limit);
  }

  async add(alert: { tracker: Tracker, createdAt: number }): Promise<Notification> {
    return db.save('notification', alert);
  }

  async remove(alertOrId: string | Notification) {
    if (isObject(alertOrId)) {
      assert(has(alertOrId, 'rev'));
    }

    const alert = typeof alertOrId === 'string' ?
      await this.getOne(alertOrId) : alertOrId;
    if (!alert) { return false; }

    return Boolean(await db.del('notification', alert));
  }

  async removeForTracker(trackId: string) {
    const alerts = await db.findHasMany('notification', 'tracker', trackId);
    await Promise.all(alerts.map((alert) => db.del('notification', alert)));
    return alerts.map((alert) => alert.id);
  }
}

export default new Notifications();
