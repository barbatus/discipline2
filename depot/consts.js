/* @flow */

'use strict';

import Enum from './Enum';

export const TrackerType = new Enum({
  GOAL: {
    title: 'Daily Goal',
    value: 'goal',
    desc: `Make a daily goal and set it as reached with the help of this tracker,
           e.g., track your gym visits.`,
  },

  COUNTER: {
    title: 'Counter',
    value: 'counter',
    desc: `Count the number of a particular task or activity you do during the day,
           e.g., number of coffee cups you drink.`,
  },

  SUM: {
    title: 'Sum',
    value: 'sum',
    desc: `Track expenses you make during the day for one particular category,
           e.g, an amount you spend on lunch.`,
  },

  STOPWATCH: {
    title: 'Stopwatch',
    value: 'stopwatch',
    desc: `Track time you spend on a task or activity during the day.`,
  },

  DISTANCE: {
    title: 'Distance',
    value: 'distance',
    desc: `Measure the distance you cover for a particular task or activity per day.`,
  },
});
