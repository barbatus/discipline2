'use strict';

const db = require('./rndb/db');

var ticks = {
  getAll: async function(trackId) {
    let table = db.getTable(trackId);
    return await table.getAll();
  },

  count: async function(trackId) {
    let table = db.getTable(trackId);
    let rows = await table.getAll();
    return rows.length;
  },

  add: async function(tick) {
    let table = db.getTable(tick.trackId);
    return await table.add(tick);
  },

  getByTrackId: async function(
    trackId, opt_minDateMs, opt_maxDateMs) {
    let table = db.getTable(trackId);
    return await table.getAll();
  }
};

module.exports = ticks;
