import { handleActions } from 'redux-actions';

import { List } from 'immutable';

import {
  LOAD_TEST_DATA,
  REMOVE_TRACKER,
  ADD_TRACKER,
  UPDATE_TRACKER,
  TICK_TRACKER,
  UNDO_LAST_TICK,
  UPDATE_LAST_TICK,
  CHANGE_DAY,
  UPDATE_CALENDAR,
  COMPLETE_CHANGE,
  START_TRACKER,
  STOP_TRACKER,
} from './actions';

import Trackers from './Trackers';

const trackEqual = tracker1 => tracker2 => tracker1.id === tracker2.id;

const findIndex = (trackers, tracker) => {
  const equal = trackEqual(tracker);
  return trackers.findIndex(nTracker => equal(nTracker));
};

const cloneTracker = (trackers, tracker, index?: number) => {
  if (index == null) {
    index = findIndex(trackers, tracker);
  }
  return trackers.update(index, () => Trackers.clone(tracker));
};

const insertTracker = (trackers, tracker, index?: number) => {
  if (index == null) {
    index = findIndex(trackers, tracker);
  }
  return trackers.insert(index, Trackers.create(tracker));
};

export const trackersReducer = handleActions(
  {
    [LOAD_TEST_DATA]: (state, { trackers }) => {
      return {
        ...state,
        trackers: new List(trackers.map(tracker => Trackers.create(tracker))),
      };
    },
    [REMOVE_TRACKER]: (state, { tracker }) => {
      const index = findIndex(state.trackers, tracker);
      const trackers = state.trackers.delete(index);
      return {
        ...state,
        removeIndex: index,
        trackers,
        ticks: null,
      };
    },
    [ADD_TRACKER]: (state, { tracker, index }) => {
      const trackers = insertTracker(state.trackers, tracker, index);
      return {
        ...state,
        addIndex: index,
        trackers,
      };
    },
    [START_TRACKER]: (state, { tracker }) => {
      const trackers = cloneTracker(state.trackers, tracker);
      return {
        ...state,
        trackers,
      };
    },
    [STOP_TRACKER]: (state, { tracker }) => {
      const trackers = cloneTracker(state.trackers, tracker);
      return {
        ...state,
        trackers,
      };
    },
    [UPDATE_TRACKER]: (state, { tracker }) => {
      const index = findIndex(state.trackers, tracker);
      const trackers = cloneTracker(state.trackers, tracker, index);
      return {
        ...state,
        updateIndex: index,
        trackers,
      };
    },
    [TICK_TRACKER]: (state, { tracker }) => {
      const trackers = cloneTracker(state.trackers, tracker);
      return {
        ...state,
        trackers,
      };
    },
    [UNDO_LAST_TICK]: (state, { tracker }) => {
      const trackers = cloneTracker(state.trackers, tracker);
      return {
        ...state,
        trackers,
      };
    },
    [UPDATE_LAST_TICK]: (state, { tracker }) => {
      const trackers = cloneTracker(state.trackers, tracker);
      return {
        ...state,
        trackers,
      };
    },
    [CHANGE_DAY]: (state, { trackers }) => ({
      ...state,
      trackers: new List(trackers.map(tracker => Trackers.getOne(tracker.id))),
    }),
    [UPDATE_CALENDAR]: (state, { dateMs, ticks }) => {
      return {
        ...state,
        dateMs,
        ticks,
      };
    },
    [COMPLETE_CHANGE]: state => ({
      ...state,
      addIndex: null,
      removeIndex: null,
      updateIndex: null,
    }),
  },
  {},
);
