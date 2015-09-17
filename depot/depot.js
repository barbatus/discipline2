'use strict';

var trackers = require('./trackers');
var ticks = require('./ticks');
var consts = require('./consts');

var depot = {
  trackers: trackers,
  ticks: ticks,
  consts: consts,

  initTestData: async function() {
    await depot.trackers.add({
      title: 'Morning Run',
      type: consts.COUNTER,
      iconId: 'sneakers'
    });
    await depot.trackers.add({
      title: 'Cup of Coffee',
      type: consts.GOAL_TRACKER,
      iconId: 'coffee'
    });
    await depot.trackers.add({
      title: 'Spent on Food',
      type: consts.GOAL_TRACKER,
      iconId: 'pizza'
    });
    await depot.trackers.add({
      title: 'Reading',
      type: consts.COUNTER, 
      iconId: 'stopwatch'
    });
  },

  hasTestData: async function() {
    return await depot.trackers.count();
  }
};

module.exports = depot;
