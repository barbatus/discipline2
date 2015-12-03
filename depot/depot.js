'use strict';

const trackers = require('./trackers');
const ticks = require('./ticks');
const { TrackerType } = require('./consts');
const consts = require('./consts');

const depot = {
  trackers: trackers,
  ticks: ticks,
  consts: consts,

  initTestData: async function() {
    await depot.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'sneakers'
    });
    await depot.trackers.add({
      title: 'Cup of Coffee',
      typeId: TrackerType.GOAL_TRACKER.valueOf(),
      iconId: 'coffee'
    });
    await depot.trackers.add({
      title: 'Spent on Food',
      typeId: TrackerType.GOAL_TRACKER.valueOf(),
      iconId: 'pizza'
    });
    await depot.trackers.add({
      title: 'Reading',
      typeId: TrackerType.COUNTER.valueOf(), 
      iconId: 'stopwatch'
    });
  },

  hasTestData: async function() {
    return await depot.trackers.count();
  }
};

module.exports = depot;
