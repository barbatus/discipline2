/* @flow */

import EventEmitter from 'eventemitter3';

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
    DB.write(() => {
      tick.id = this.table.nextId;
      tick = DB.create('Tick', tick);
      this.table.nextId = tick.id + 1;
    });

    const { id, trackId } = tick;
    this.event.emit('added', {
      id,
      trackId,
    });

    return tick;
  }

  getData(schema: string, tickId: number) {
    const data = DB.objects(schema);
    return data.filtered(`tickId = ${tickId}`)[0];
  }

  addData(schema: string, data: Object) {
    DB.write(() => {
      data.tickId = this.table.nextId;
      DB.create(schema, data);
    });
  }

  update(tickId: number, value: number) {
    check.assert.number(tickId);

    const ticks = DB.objects('Tick');
    const tick = ticks.filtered(`id = ${tickId}`)[0];
    DB.write(() => {
      tick.value = value;
    });
  }

  updateData(schema: string, tickId: number, data: Object) {
    check.assert.string(schema);
    check.assert.number(tickId);

    const dataObj = DB.objects(schema);
    const tickData = dataObj.filtered(`tickId = ${tickId}`)[0];
    DB.write(() => {
      for (const prop in data) {
        tickData[prop] = data[prop];
      }
    });
  }

  remove(tickId: number): boolean {
    check.assert.number(tickId);

    const tick = DB.objects('Tick')
      .filtered(`id = ${tickId}`)[0];

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
