'use strict';

var ticks = require('./ticks');
var db = require('./rndb/db');
var table = db.createTable('trackers');

var trackers = {
  getAll: async function() {
    return await table.getAll();
  },

  getOne: async function(trackId) {
    return await table.getId(trackId);
  },

  count: async function() {
    let rows = await table.getAll();
    return rows.length;
  },

  addAt: async function(tracker, index) {
    return await table.addAt(tracker, index);
  },

  add: async function(tracker) {
    return await table.add(tracker);
  },

  addTick: async function(trackId, dateTimeMs, opt_value) {
    return await ticks.add({
      trackId: trackId,
      value: opt_value,
      dateTimeMs: dateTimeMs
    });
  },

  getTicks: async function(trackId, opt_minDateMs, opt_maxDateMs) {
    return await ticks.getByTrackId(
      trackId, opt_minDateMs, opt_maxDateMs);
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
