 /* @flow */

'use strict';

import DB from './db';

import EventEmitter from 'eventemitter3';

class TicksDepot {
  events: EventEmitter = new EventEmitter();

  _table: TickSchemaType;

  constructor() {
    let table = DB.objects('Ticks');
    if (!table.length) {
      DB.write(() => {
        DB.create('Ticks', {});
      });
    }
    this._table = table[0];
  }

  getAll(trackId: number): Array<Tick> {
    check.assert.number(trackId);

    let ticks = DB.objects('Tick');
    return ticks
      .filtered(`trackId = ${trackId}`)
      .sorted('dateTimeMs');
  }

  getData(schema: string, tickId: number) {
    let data = DB.objects(schema);
    return data.filtered(`tickId = ${tickId}`)[0];
  }

  getForPeriod(trackId: number,
               minDateMs: number,
               maxDateMs?: number): Array<Tick> {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    let ticks = DB.objects('Tick');
    let query = `trackId = ${trackId} AND dateTimeMs >= ${minDateMs}`;

    if (maxDateMs) {
      query = `${query} AND dateTimeMs < ${maxDateMs}`;
    }

    return ticks
      .filtered(query)
      .sorted('dateTimeMs');
  }

  getLast(trackId: number): Tick {
    check.assert.number(trackId);

    let ticks = depot.getAll(trackId);
    return ticks[ticks.length - 1];
  }

  count(trackId: number): number {
    check.assert.number(trackId);

    let ticks = depot.getAll(trackId);
    return ticks.length;
  }

  add(tick: Tick): Tick {
    DB.write(() => {
      tick.id = this._table.nextId;
      tick = DB.create('Tick', tick);
      this._table.nextId = tick.id + 1;
    });

    this.events.emit('added', {
      id: tick.id,
      trackId: tick.trackId
    });

    return tick;
  }

  addData(schema: string, data: Object) {
    DB.write(() => {
      data.tickId = this._table.nextId;
      DB.create(schema, data);
    });
  }

  update(tickId: number, value: number) {
    check.assert.number(tickId);

    let ticks = DB.objects('Tick');
    let tick = ticks.filtered(`id = ${tickId}`)[0];
    DB.write(() => {
      tick.value = value;
    });
  }

  updateData(schema: string, tickId: number, data: Object) {
    check.assert.number(tickId);

    let dataObj = DB.objects(schema);
    let tickData = dataObj.filtered(`tickId = ${tickId}`)[0];
    DB.write(() => {
      for (let prop in data) {
        tickData[prop] = data[prop];
      }
    });
  }

  remove(tickId: number): boolean {
    check.assert.number(tickId);

    let ticks = DB.objects('Tick');
    let tick = ticks.filtered(`id = ${tickId}`)[0];
    let { id, trackId } = tick;
    DB.write(() => {
      DB.delete(tick);
    });

    this.events.emit('removed', { id, trackId });

    return tick !== null;
  }
};

let depot = new TicksDepot();
export default depot;
