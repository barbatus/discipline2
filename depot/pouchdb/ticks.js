/* @flow */

import check from 'check-types';
import assert from 'assert';

import isObject from 'lodash/isObject';
import has from 'lodash/has';
import omit from 'lodash/omit';

import { TrackerToPropType } from '../consts';
import { type PlainTick, Tick, Tracker } from '../interfaces';

import db from './db';

type PouchTick = { ...Tick, tracker: Tracker };

class Ticks {
  async getOne(tickId: string): Promise<Tick> {
    return db.find('tick', tickId);
  }

  async getForPeriod(
    trackId: string,
    minDateMs: number,
    maxDateMs?: number,
  ): Promise<Tick[]> {
    return db.selectBy(
      'tick',
      'tracker',
      trackId,
      'createdAt',
      minDateMs,
      maxDateMs,
    );
  }

  async add(
    tick: { tracker: Tracker, createdAt: number, value?: number },
    data?: Object,
  ): Promise<Tick> {
    const newTick = { ...tick };
    const { tracker } = tick;
    if (data) {
      const tickData = await db.save(TrackerToPropType[tracker.typeId], data);
      newTick[TrackerToPropType[tracker.typeId]] = tickData;
    }
    return db.save('tick', newTick);
  }

  async getLastOne(
    trackId: string,
    minDateMs?: number = null,
    maxDateMs?: number = null,
  ): Promise<Tick> {
    check.assert.string(trackId);

    const tick = await db.selectOrderBy(
      'tick',
      'tracker',
      trackId,
      'createdAt',
      1,
      minDateMs,
      maxDateMs,
    );
    return tick[0];
  }

  async getLastWithLimit(
    trackId: string,
    limit: number,
  ): Promise<Notification[]> {
    return db.selectOrderBy('tick', 'tracker', trackId, 'createdAt', limit);
  }

  async update(tick: PouchTick, value: number, data?: Object) {
    const { tracker } = tick;
    const tickData = tick[TrackerToPropType[tracker.typeId]];

    if (tickData && data) {
      const newData = data;
      Object.keys(data).forEach((prop) => {
        if (Array.isArray(tickData[prop]) && !Array.isArray(newData[prop])) {
          tickData[prop].push(newData[prop]);
        } else {
          tickData[prop] = newData[prop];
        }
      });
      await db.save(TrackerToPropType[tracker.typeId], tickData);
    }

    return db.save('tick', { ...tick, value });
  }

  async remove(tickOrId: string | Tick) {
    if (isObject(tickOrId)) {
      assert(has(tickOrId, 'rev'));
    }

    const tick =
      typeof tickOrId === 'string' ? await this.getOne(tickOrId) : tickOrId;
    if (!tick) {
      return false;
    }

    await db.del('tick', tick);
    return true;
  }

  async removeForTracker(trackId: string) {
    const ticks = await db.findHasMany('tick', 'tracker', trackId);
    await Promise.all(ticks.map((tick) => db.del('tick', tick)));
    const ids = ticks.map((tick) => tick.id);
    return ids;
  }

  plainTick(tick: Tick): PlainTick {
    check.assert.object(tick);
    const types = Object.keys(TrackerToPropType);
    return types.reduce((accum, type) => {
      const dataType = TrackerToPropType[type];
      if (tick[dataType]) {
        return { ...omit(accum, dataType), ...tick[dataType] };
      }
      return accum;
    }, tick);
  }
}

export default new Ticks();
