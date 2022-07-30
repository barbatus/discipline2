/* @flow */

import Enum from './Enum';

export type TrackerId = 'DISTANCE' | 'GOAL' | 'COUNTER' | 'STOPWATCH' | 'SUM';

export const TrackerType = new Enum({
  GOAL: {
    title: 'Daily Goal',
    value: 'GOAL',
    desc: 'Track if you are done with some of your daily goals',
    hint: 'track your gym visits',
  },

  COUNTER: {
    title: 'Counter',
    value: 'COUNTER',
    desc: 'Count number of things you do during the day',
    hint: 'number of coffee cups you drink',
  },

  SUM: {
    title: 'Sum',
    value: 'SUM',
    desc: 'Track expenses during your day',
    hint: 'an amount you spend on lunch',
  },

  STOPWATCH: {
    title: 'Stopwatch',
    value: 'STOPWATCH',
    desc: 'Track time of a day activity',
  },

  DISTANCE: {
    title: 'Distance',
    value: 'DISTANCE',
    desc: 'Measure distance whether it\'s jogging or just a walk to a grocery store',
  },
});

export const FreqType = new Enum({
  DAILY: {
    title: 'Daily',
    value: 'd',
  },
  WEEKLY: {
    title: 'Weekly',
    value: 'w',
  },
  MONTHLY: {
    title: 'Monthly',
    value: 'm',
  },
});

export const DepotEvent = {
  TICK_ADDED: 'tick_added',
  TICKS_REMOVED: 'ticks_removed',
  TICK_UPDATED: 'tick_updated',
  TRACK_REMOVED: 'track_removed',
  TRACK_ADDED: 'track_added',
  TRACK_UPDATED: 'track_updated',
  ALERT_ADDED: 'alert_added',
};


export const DEFAULT_TRACKER_PROPS = [
  { propId: 'alerts', name: 'Remind me' },
  { propId: 'freq', name: 'Frequency' },
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
