'use strict';

var db = require('./rndb/db');
var table = db.create_table('ticks');

var ticks = {
  get_all: async function() {
    var rows = await table.get_all();
    return rows;
  },

  count: async function() {
    var rows = await table.get_all();
    return rows.length;
  },

  add: async function(tick) {
    await table.add(tick);
  },

  getByTrackId: async function(trackId, opt_minDateMs, opt_maxDateMs) {
    return await table.get({trackId: trackId});
  }
};

module.exports = ticks;
