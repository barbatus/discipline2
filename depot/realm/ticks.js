/* @flow */
import check from 'check-types';

import EventEmitter from 'eventemitter3';

import isArrayLike from 'lodash/isArrayLike';

import DB from './db';

class Ticks {
  event = new EventEmitter();

  table: TickSchemaType;

  constructor() {
    const table = DB.objects('Ticks');
    if (!table.length) {
      DB.write(() => DB.create('Ticks', {}));
    }
    this.table = table[0];
  }

  getForTracker(trackId: number): Array<Tick> {
    check.assert.number(trackId);

    const ticks = DB.objects('Tick');
    return ticks
      .filtered(`trackId = ${trackId}`)
      .sorted('dateTimeMs')
      .map((tick) => tick);
  }

  getForPeriod(
    trackId: number,
    minDateMs: number,
    maxDateMs?: number,
  ): Array<Tick> {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    const ticks = DB.objects('Tick');
    let query = `trackId = ${trackId} AND dateTimeMs >= ${minDateMs}`;
    if (maxDateMs) {
      query = `${query} AND dateTimeMs < ${maxDateMs}`;
    }

    return ticks.filtered(query)
      .sorted('dateTimeMs')
      .map((tick) => tick);
  }

  getLast(trackId: number): Tick {
    check.assert.number(trackId);

    const ticks = this.getForTracker(trackId);
    return ticks[ticks.length - 1];
  }

  count(trackId: number): number {
    check.assert.number(trackId);

    const ticks = this.getForTracker(trackId);
    return ticks.length;
  }

  add(tick: Tick): Tick {
    let dbTick = { ...tick };
    DB.write(() => {
      dbTick.id = this.table.nextId;
      dbTick = DB.create('Tick', dbTick);
      this.table.nextId = dbTick.id + 1;
    });

    const { id, trackId } = dbTick;
    this.event.emit('added', {
      id,
      trackId,
    });

    return dbTick;
  }

  getData(schema: string, tickId: number) {
    const data = DB.objects(schema);
    return data.filtered(`tickId = ${tickId}`)[0];
  }

  addData(schema: string, tick: Tick, data: Object) {
    DB.write(() => {
      DB.create(schema, { tick, ...data });
    });
  }

  update(tickId: number, value: number) {
    check.assert.number(tickId);

    const ticks = DB.objects('Tick');
    const tick = ticks.filtered(`id = ${tickId}`)[0];
    DB.write(() => {
      tick.value = value;
    });
    return tick;
  }

  updateData(schema: string, tickId: number, data: Object) {
    check.assert.string(schema);
    check.assert.number(tickId);

    const dataObj = DB.objects(schema);
    const tickData = dataObj.filtered(`tick.id = ${tickId}`)[0];
    DB.write(() => {
      Object.keys(data).forEach((prop) => {
        if (isArrayLike(tickData[prop]) && !isArrayLike(data[prop])) {
          tickData[prop].push(data[prop]);
          return;
        }
        tickData[prop] = data[prop];
      });
    });
  }

  remove(tickId: number): boolean {
    check.assert.number(tickId);

    const tick = DB.objects('Tick').filtered(`id = ${tickId}`)[0];

    if (!tick) throw new Error('No tick found');

    const { id, trackId } = tick;
    DB.write(() => DB.delete(tick));
    this.event.emit('removed', { ids: [id], trackId });
    return true;
  }

  removeForTracker(trackId) {
    check.assert.number(trackId);

    const ticks = DB.objects('Tick')
      .filtered(`trackId = ${trackId}`);

    if (!ticks) throw new Error('No tracker found');

    const ids = ticks.map((tick) => tick.id);
    DB.write(() => DB.delete(ticks));
    this.event.emit('removed', { ids, trackId });
    return ids.length;
  }
}

export default new Ticks();
