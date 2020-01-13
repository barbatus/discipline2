import { combineActions, handleActions } from 'redux-actions';
import { List } from 'immutable';

import time from 'app/time/utils';

import {
  LOAD_APP,
  LOAD_TEST_APP,
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
  STOP_TRACKER_WITH_TICK_UPDATE,
  UPDATE_APP_PROPS,
  UPDATE_COPILOT,
} from './actions';

import { Tick } from './Tracker';
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
    const tcks = tracker.ticks.filter((tck1) => !ticks.find((tck2) => tck1.id === tck2.id));
    trTicks = tcks.concat(ticks);
  }
  return trackers.update(trIndex, () => Trackers.clone(
    trackers.get(trIndex),
    { ...tracker, ticks: trTicks }),
  );
};

const cloneTicks = (trackers, tracker, progress, ticks: Tick[]) => {
  const trIndex = findIndex(trackers, tracker);
  let trTicks = tracker.ticks;
  if (ticks) {
    const tcks = tracker.ticks.filter((tck1) => !ticks.find((tck2) => tck1.id === tck2.id));
    trTicks = tcks.concat(ticks);
  }
  return trackers.update(trIndex, () => Trackers.clone(trackers.get(trIndex), {
    ...progress,
    ticks: trTicks,
  }));
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
    [combineActions(UPDATE_APP_PROPS, UPDATE_COPILOT)]: (state, { app }) => ({
      ...state,
      app,
    }),
    [combineActions(LOAD_APP, LOAD_TEST_APP)]: (state, { app: { trackers, ...app } }) => ({
      ...state,
      app,
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
      const trackers = cloneTracker(state.trackers, tracker, null);
      return {
        ...state,
        trackers,
      };
    },
    [STOP_TRACKER_WITH_TICK_UPDATE]: (state, { tracker, tick }) => {
      const trackers = cloneTracker(state.trackers, tracker, null, [tick]);
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
      const trackers = cloneTicks(state.trackers, tracker, null, [tick]);
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
    [UPDATE_LAST_TICK]: (state, { tracker, progress, tick }) => {
      const trackers = cloneTicks(state.trackers, tracker, progress, [tick]);
      return {
        ...state,
        trackers,
      };
    },
    [CHANGE_DAY]: (state, { todayMs, trackers }) => ({
      ...state,
      todayMs,
      trackers: new List(trackers.map((tracker) => Trackers.create(tracker))),
    }),
    [UPDATE_CALENDAR]: (state, { monthDateMs, ticks }) => ({
      ...state,
      monthDateMs,
      ticks,
    }),
    [COMPLETE_CHANGE]: (state) => ({
      ...state,
      addIndex: null,
      removeIndex: null,
      updateIndex: null,
    }),
  },
  { monthDateMs: time.getCurMonthDateMs(), trackers: List() },
);
