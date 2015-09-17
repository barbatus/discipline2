'use strict';

var ticks = require('./ticks');
var db = require('./rndb/db');
var table = db.create_table('trackers');

var trackers = {
  get_all: async function(mapper) {
    var rows = await table.get_all();
    if (mapper) {
      var result = [];
      for (let row of rows) {
        result.push(mapper(row));
      }
      return result;
    }
    return rows;
  },

  count: async function() {
    var rows = await table.get_all();
    return rows.length;
  },

  add: async function(tracker) {
    await table.add(tracker);
  },

  addTick: async function(trackId, dateTimeMs, opt_value) {
    return await ticks.add({
      trackId: trackId,
      value: opt_value,
      dateTimeMs: dateTimeMs
    });
  },

  getTicks: async function(trackId, opt_minDateMs, opt_maxDateMs) {
    return await ticks.getByTrackId(trackId, opt_minDateMs, opt_maxDateMs);
  },

  getTodayTicks: async function(trackId) {
    return await trackers.getTicks(trackId, time.getDateMs());
  },

  getTodayCount: async function(trackId) {
    var rows = await trackers.getTodayTicks(trackId);
    return rows.length;
  }
};

module.exports = trackers;
