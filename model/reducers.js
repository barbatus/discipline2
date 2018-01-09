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

const trackEqual = (tracker1) => (tracker2) => tracker1.id === tracker2.id;

const findIndex = (trackers, tracker) => {
  const equal = trackEqual(tracker);
  return trackers.findIndex((nTracker) => equal(nTracker));
};

const cloneTracker = (trackers, tracker, index?: number, ticks?: Tick[]) => {
  let trIndex = index;
  if (trIndex == null) {
    trIndex = findIndex(trackers, tracker);
  }
  let trTicks = tracker.ticks;
  if (ticks) {
    const tcks = tracker.ticks.filter((tck1) =>
      !ticks.find((tck2) => tck1.id === tck2.id));
    trTicks = tcks.concat(ticks);
  }
  return trackers.update(trIndex, () => Trackers.create({ ...tracker, ticks: trTicks }));
};

const insertTracker = (trackers, tracker, index?: number) => {
  let trIndex = index;
  if (trIndex == null) {
    trIndex = findIndex(trackers, tracker);
  }
  return trackers.insert(trIndex, Trackers.create(tracker));
};

export const trackersReducer = handleActions(
  {
    [LOAD_TEST_DATA]: (state, { trackers }) => ({
      ...state,
      trackers: new List(trackers.map(
        (tracker) => Trackers.create(tracker))),
    }),
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
    [START_TRACKER]: (state, { tracker, tick }) => {
      const trackers = cloneTracker(state.trackers, tracker, null, [tick]);
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
    [TICK_TRACKER]: (state, { tracker, tick }) => {
      const trackers = cloneTracker(state.trackers, tracker, null, [tick]);
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
    [UPDATE_LAST_TICK]: (state, { tracker, tick }) => {
      const trackers = cloneTracker(state.trackers, tracker, null, [tick]);
      return {
        ...state,
        trackers,
      };
    },
    [CHANGE_DAY]: (state, { trackers }) => ({
      ...state,
      trackers: new List(trackers.map(
        (tracker) => Trackers.getOne(tracker.id))),
    }),
    [UPDATE_CALENDAR]: (state, { dateMs, ticks }) => ({
      ...state,
      dateMs,
      ticks,
    }),
    [COMPLETE_CHANGE]: (state) => ({
      ...state,
      addIndex: null,
      removeIndex: null,
      updateIndex: null,
    }),
  },
  {},
);
