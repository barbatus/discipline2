'use strict';

var meters = require('./meters');

var depot = {
  meters: meters,

  initTestData: async function() {
    await depot.meters.add({title: 'Morning Run', iconId: 'sneakers'});
    await depot.meters.add({title: 'Cup of Coffee', iconId: 'coffee'});
    await depot.meters.add({title: 'Spent on Food', iconId: 'pizza'});
    await depot.meters.add({title: 'Reading', iconId: 'stopwatch'});
  },

  hasTestData: async function() {
    return await depot.meters.count()
  }
};

module.exports = depot;
