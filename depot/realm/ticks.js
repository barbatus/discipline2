import check from 'check-types';

import isArrayLike from 'lodash/isArrayLike';

import { Tick } from '../interfaces';
import { TickSchemaType } from './interfaces';
import db from './db';

class Ticks {
  table: TickSchemaType;

  constructor() {
    const table = db.objects('Ticks');
    if (!table.length) {
      db.write(() => db.create('Ticks', {}));
    }
    [this.table] = table;
  }

  getForTracker(trackId: string): Array<Tick> {
    check.assert.string(trackId);

    const ticks = db.objects('Tick');
    return ticks
      .filtered(`trackId = ${trackId}`)
      .sorted('createdAt')
      .map((tick) => tick);
  }

  getForPeriod(
    trackId: string,
    minDateMs: number,
    maxDateMs?: number,
  ): Array<Tick> {
    check.assert.string(trackId);
    check.assert.number(minDateMs);

    const ticks = db.objects('Tick');
    let query = `trackId = ${trackId} AND createdAt >= ${minDateMs}`;
    if (maxDateMs) {
      query = `${query} AND createdAt < ${maxDateMs}`;
    }

    return ticks
      .filtered(query)
      .sorted('createdAt')
      .map((tick) => tick);
  }

  getLast(trackId: string): Tick {
    check.assert.string(trackId);

    const ticks = this.getForTracker(trackId);
    return ticks[ticks.length - 1];
  }

  count(trackId: string): number {
    check.assert.string(trackId);

    const ticks = this.getForTracker(trackId);
    return ticks.length;
  }

  add(tick: Tick): Tick {
    let dbTick = { ...tick };
    db.write(() => {
      dbTick.id = this.table.nextId.toString();
      dbTick = db.create('Tick', dbTick);
      this.table.nextId = this.table.nextId + 1;
    });
    return dbTick;
  }

  getData(schema: string, tickId: string) {
    const data = db.objects(schema);
    return data.filtered(`tickId = ${tickId}`)[0];
  }

  addData(schema: string, tick: Tick, data: Object) {
    db.write(() => {
      db.create(schema, { tick, ...data });
    });
  }

  update(tickId: string, value: number) {
    check.assert.string(tickId);

    const ticks = db.objects('Tick');
    const tick = ticks.filtered(`id = ${tickId}`)[0];
    db.write(() => {
      tick.value = value;
    });
    return tick;
  }

  updateData(schema: string, tickId: string, data: Object) {
    check.assert.string(schema);
    check.assert.string(tickId);

    const dataObj = db.objects(schema);
    const tickData = dataObj.filtered(`tick.id = ${tickId}`)[0];
    db.write(() => {
      Object.keys(data).forEach((prop) => {
        if (isArrayLike(tickData[prop]) && !isArrayLike(data[prop])) {
          tickData[prop].push(data[prop]);
          return;
        }
        tickData[prop] = data[prop];
      });
    });
  }

  remove(tickId: string): boolean {
    check.assert.string(tickId);

    const tick = db.objects('Tick').filtered(`id = ${tickId}`)[0];
    db.write(() => db.delete(tick));
    return true;
  }

  removeForTracker(trackId: string) {
    check.assert.string(trackId);

    const ticks = db.objects('Tick').filtered(`trackId = ${trackId}`);

    const ids = ticks.map((tick) => tick.id);
    db.write(() => db.delete(ticks));
    return ids;
  }
}

export default new Ticks();
