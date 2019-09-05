/* @flow */
import check from 'check-types';
import assert from 'assert';
import isObject from 'lodash/isObject';
import has from 'lodash/has';

import { Tracker, Alert } from '../interfaces';

import db from './db';

class Alerts {
  async getOne(alertId: string): Promise<Alert> {
    return db.find('alert', alertId);
  }

  async getLastOne(trackId: string): Promise<Alert> {
    check.assert.string(trackId);

    const alerts = await db.selectOrderBy('alert', 'tracker', trackId, 'createdAt');
    return alerts[0];
  }

  async getLastWithLimit(trackId: string, limit: number): Promise<Alert[]> {
    return db.selectOrderBy('alert', 'tracker', trackId, 'createdAt', limit);
  }

  async add(alert: { tracker: Tracker, createdAt: number }): Promise<Alert> {
    return db.save('alert', alert);
  }

  async remove(alertOrId: string | Alert) {
    if (isObject(alertOrId)) {
      assert(has(alertOrId, 'rev'));
    }

    const alert = typeof alertOrId === 'string' ?
      await this.getOne(alertOrId) : alertOrId;
    if (!alert) { return false; }

    return Boolean(await db.del('alert', alert));
  }

  async removeForTracker(trackId: string) {
    const alerts = await db.findHasMany('alert', 'tracker', trackId);
    await Promise.all(alerts.map((alert) => db.del('alert', alert)));
    return alerts.map((alert) => alert.id);
  }
}

export default new Alerts();
