/* @flow */

import check from 'check-types';
import assert from 'assert';

import isObject from 'lodash/isObject';
import has from 'lodash/has';
import omit from 'lodash/omit';

import time from 'app/time/utils';

import { Tick, Tracker, TRACKER_TYPE } from '../interfaces';
import db from './db';

type PouchTick = { ...Tick, tracker: Tracker };

class Ticks {
  async getOne(tickId: string): Promise<Tick> {
    return db.find('tick', tickId);
  }

  async getForPeriod(trackId: string, minDateMs: number, maxDateMs?: number): Promise<Tick[]> {
    return db.selectBy('tick', 'tracker', trackId, 'dateTimeMs', minDateMs, maxDateMs);
  }

  async add(
    tick: { tracker: Tracker, dateTimeMs: number, value?: number },
    data?: Object,
  ): Promise<Tick> {
    const newTick = Object.assign({}, tick);
    const { tracker } = tick;
    if (data) {
      const tickData = await db.save(TRACKER_TYPE[tracker.typeId], data);
      newTick[TRACKER_TYPE[tracker.typeId]] = tickData;
    }
    return db.save('tick', newTick);
  }

  async getLast(trackId: string): Promise<Tick> {
    check.assert.string(trackId);

    const ticks = await this.getForPeriod(trackId, time.getDateMs());
    return ticks[ticks.length - 1];
  }

  async update(tick: PouchTick, value: number, data?: Object) {
    const { tracker } = tick;
    const tickData = tick[TRACKER_TYPE[tracker.typeId]];

    if (tickData && data) {
      const newData = data;
      Object.keys(data).forEach((prop) => {
        if (Array.isArray(tickData[prop]) &&
            !Array.isArray(newData[prop])) {
          tickData[prop].push(newData[prop]);
        } else {
          tickData[prop] = newData[prop];
        }
      });
      await db.save(TRACKER_TYPE[tracker.typeId], tickData);
    }

    return db.save('tick', { ...tick, value });
  }

  async remove(tickOrId: string | Tick) {
    if (isObject(tickOrId)) {
      assert(has(tickOrId, 'rev'));
    }

    const tick = typeof tickOrId === 'string' ?
      await this.getOne(tickOrId) : tickOrId;
    if (!tick) { return false; }

    await db.del('tick', tick);
    return true;
  }

  async removeForTracker(trackId: string) {
    const ticks = await db.findHasMany('tick', 'tracker', trackId);
    await Promise.all(ticks.map((tick) => db.del('tick', tick)));
    const ids = ticks.map((tick) => tick.id);
    return ids;
  }

  plainTick(tick: Tick) {
    const types = Object.keys(TRACKER_TYPE);
    return types.reduce((accum, type) => {
      if (tick[type]) {
        return { ...omit(accum, type), ...tick[type] };
      }
      return accum;
    }, tick);
  }
}

export default new Ticks();
