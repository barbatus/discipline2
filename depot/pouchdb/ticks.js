/* @flow */

import check from 'check-types';

import assert from 'assert';

import isObject from 'lodash/isObject';

import has from 'lodash/has';

import omit from 'lodash/omit';

import time from 'app/time/utils';

import db, { TRACKER_TICK_DATA_TYPE } from './db';

class Ticks {
  async getOne(tickId: string): Promise<Tick> {
    return db.find('tick', tickId);
  }

  async getForPeriod(trackId: string, minDateMs: number, maxDateMs?: number):Promise<Array<Tick>> {
    return db.selectBy('tick', 'tracker', trackId, 'dateTimeMs', minDateMs, maxDateMs);
  }

  async add(tick: Tick, data?: Object): Promise<Tick> {
    const newTick = { ...tick };
    const { tracker } = tick;
    const tickType = TRACKER_TICK_DATA_TYPE[tracker.typeId];
    if (data && tickType) {
      const tickData = await db.save(tickType, data);
      newTick[tickType] = tickData;
    }
    return await db.save('tick', newTick);
  }

  async getLast(trackId: string): Promise<Tick> {
    check.assert.string(trackId);

    const ticks = await this.getForPeriod(trackId, time.getDateMs());
    return ticks[ticks.length - 1];
  }

  async update(tick: Tick, value: number, data?: Object) {
    const { tracker } = tick;
    const tickType = TRACKER_TICK_DATA_TYPE[tracker.typeId];
    const tickData = tick[tickType];

    if (tickData && data) {
      Object.keys(data).forEach((prop) => {
        if (Array.isArray(tickData[prop]) && !Array.isArray(data[prop])) {
          tickData[prop].push(data[prop]);
          return;
        }
        tickData[prop] = data[prop];
      });
      await db.save(tickType, tickData);
    }

    return db.save('tick', { ...tick, value });
  }

  async remove(tickOrId: string | Tick) {
    if (isObject(tickOrId)) {
      assert(has(tickOrId, 'rev'));
    }

    const tick = isObject(tickOrId) ? tickOrId : await this.getOne(tickOrId);
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
    const types = Object.values(TRACKER_TICK_DATA_TYPE);
    return types.reduce((accum, type) => {
      if (tick[type]) {
        return { ...omit(accum, type), ...tick[type] };
      }
      return accum;
    }, tick);
  }
}

export default new Ticks();
