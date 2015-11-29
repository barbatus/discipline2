'use strict';

const Enum = require('./Enum');

const TrackerType = new Enum({
  GOAL_TRACKER: {
    title: 'Daily Goal',
    value: 'goal',
    desc: 'Mark a goal you want to reach during the day, for example, ' +
          'a pill you should take per day.'
  },

  COUNTER: {
    title: 'Counter',
    value: 'counter',
    desc: 'Count the number of things you usually do during the day, ' +
          'for example, number of cups of coffee you drink.'
  },

  SUM: {
    title: 'Sum',
    value: 'sum',
    desc: 'Calculate expenses you make during the day for one specific category, ' +
          'for example, an amount you spend on a lunch.'
  }
});

module.exports = {
  TrackerType
};
