/* @flow */

import Enum from './Enum';

export type TrackerId = 'DISTANCE' | 'GOAL' | 'COUNTER' | 'STOPWATCH' | 'SUM';

export const TrackerType = new Enum({
  GOAL: {
    title: 'Daily Goal',
    value: 'GOAL',
    desc: 'Make a daily goal and set it as reached with the help of this tracker',
    hint: 'track your gym visits',
  },

  COUNTER: {
    title: 'Counter',
    value: 'COUNTER',
    desc: 'Count number of a particular task or activity you do during the day',
    hint: 'number of coffee cups you drink',
  },

  SUM: {
    title: 'Sum',
    value: 'SUM',
    desc: 'Track expenses you make during the day for one particular category',
    hint: 'an amount you spend on lunch',
  },

  STOPWATCH: {
    title: 'Stopwatch',
    value: 'STOPWATCH',
    desc: 'Track time you spend on a task or activity during the day',
  },

  DISTANCE: {
    title: 'Distance',
    value: 'DISTANCE',
    desc: 'Measure the distance you cover for a particular task or activity per day',
  },
});


export const DepotEvent = {
  TICK_ADDED: 'tick_added',
  TICKS_REMOVED: 'ticks_removed',
  TICK_UPDATED: 'tick_updated',
  TRACK_REMOVED: 'track_removed',
  TRACK_ADDED: 'track_added',
  TRACK_UPDATED: 'track_updated',
};


export const DEFAULT_TRACKER_PROPS = [
  { propId: 'alerts', name: 'Send Notifications' },
];

export const TrackerToPropType = {
  DISTANCE: 'distData',
  GOAL: 'goalData',
  COUNTER: 'countData',
  STOPWATCH: 'watchData',
  SUM: 'sumData',
};

export type CopilotScreenId = 'EMPTY_APP' | 'FIRST_TRACKER';
export type CopilotStepId = 'CREATE_FIRST' | 'ADD_ICON';
