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
    desc: 'Track expenses you make during the day',
    hint: 'an amount you spend on lunch',
  },

  STOPWATCH: {
    title: 'Stopwatch',
    value: 'STOPWATCH',
    desc: 'Track how much time you spend on an activity',
  },

  DISTANCE: {
    title: 'Distance',
    value: 'DISTANCE',
    desc: 'Measure distance you cover for an activity',
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
  { propId: 'alerts', name: 'Send Alerts' },
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
