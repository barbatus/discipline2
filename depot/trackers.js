'use strict';

const ticks = require('./ticks');
const db = require('./rndb/db');
const table = db.createTable('trackers');

const trackers = {
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
    check.assert.number(index);

    return await table.addAt(tracker, index);
  },

  add: async function(tracker) {
    return await table.add(tracker);
  },

  remove: async function(trackId) {
    check.assert.number(trackId);

    return await table.removeById(trackId);
  },

  update: async function(trackId, tracker) {
    check.assert.number(trackId);

    return await table.updateById(trackId, tracker);
  },

  addTick: async function(trackId, dateTimeMs, opt_value) {
    check.assert.number(trackId);
    check.assert.number(dateTimeMs);

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

  getLastTick: async function(trackId) {
    return await ticks.getLast(trackId);
  },

  getTodayTicks: async function(trackId) {
    return await trackers.getTicks(trackId, time.getDateMs());
  },

  getTodayCount: async function(trackId) {
    let rows = await trackers.getTodayTicks(trackId);
    return rows.length;
  }
};

module.exports = trackers;
