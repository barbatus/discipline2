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
      .filtered(`trackerId = ${trackId}`)
      .sorted('dateTimeMs');
  }

  getForPeriod(trackId: number,
               minDateMs: number,
               maxDateMs?: number): Array<Tick> {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    let ticks = DB.objects('Tick');
    let query = `trackerId = ${trackId} AND dateTimeMs >= ${minDateMs}`;

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
      trackerId: tick.trackerId
    });

    return tick;
  }

  remove(tickId: number): boolean {
    check.assert.number(tickId);

    let ticks = DB.objects('Tick');
    let tick = ticks.filtered(`id = ${tickId}`)[0];
    let { id, trackerId } = tick;
    DB.write(() => {
      DB.delete(tick);
    });

    this.events.emit('removed', { id, trackerId });

    return tick !== null;
  }
};

let depot = new TicksDepot();
export default depot;
