'use strict';

import depot from '../depot/depot';

export const UPDATE_CALENDAR = 'UPDATE_CALENDAR';

export const updateCalendar = (tracker, dateMs, startDateMs, endDateMs) =>
  dispatch =>
    depot.getTicks(tracker.id, startDateMs, endDateMs).then(ticks => dispatch({
      type: UPDATE_CALENDAR,
      dateMs,
      tracker,
      ticks,
    }));

export const LOAD_TEST_DATA = 'LOAD_INIT';

export const loadTestData = () =>
  dispatch => depot.loadTestData().then(trackers => dispatch({
    type: LOAD_TEST_DATA,
    trackers,
  }));

export const REMOVE_TRACKER = 'REMOVE_TRACK';

export const removeTracker = tracker => dispatch =>
  depot.removeTracker(tracker.id).then(removed => dispatch({
    type: REMOVE_TRACKER,
    tracker,
  }));

export const ADD_TRACKER = 'ADD_TRACKER';

export const addTracker = (tracker, index) => dispatch =>
  depot.addTrackerAt(tracker, index).then(tracker => dispatch({
    type: ADD_TRACKER,
    tracker,
    index,
  }));

export const UPDATE_TRACKER = 'UPDATE_TRACKER';

export const updateTracker = tracker => dispatch =>
  depot.updateTracker(tracker).then(tracker => dispatch({
    type: UPDATE_TRACKER,
    tracker,
  }));

export const TICK_TRACKER = 'TICK_TRACKER';

export const tickTracker = (tracker, value, data) => dispatch => {
  const dateTimeMs = time.getDateTimeMs();
  depot
    .addTick(tracker.id, dateTimeMs, value, data)
    .then(tick => depot.getTicks(tracker.id, time.getDateMs()).then(ticks => {
      tracker.ticks = ticks;
      return dispatch({
        type: TICK_TRACKER,
        tracker,
        tick,
      });
    }));
};

export const START_TRACKER = 'START_TRACKER';

export const startTracker = tracker => {
  tracker.active = true;
  return {
    type: START_TRACKER,
    tracker,
  };
};

export const STOP_TRACKER = 'STOP_TRACKER';

export const stopTracker = tracker => {
  tracker.active = false;
  return {
    type: STOP_TRACKER,
    tracker,
  };
};

export const UNDO_LAST_TICK = 'UNDO_LAST_TICK';

export const undoLastTick = tracker => dispatch =>
  depot.undoLastTick(tracker.id).then(() =>
    depot.getTicks(tracker.id, time.getDateMs()).then(ticks => {
      tracker.ticks = ticks;
      return dispatch({
        type: UNDO_LAST_TICK,
        tracker,
      });
    }));

export const UPDATE_LAST_TICK = 'UPDATE_LAST_TICK';

export const updateLastTick = (tracker, value, data) =>
  dispatch =>
    depot.updateLastTick(tracker.id, value, data).then(tick =>
      depot.getTicks(tracker.id, time.getDateMs()).then(ticks => {
        tracker.ticks = ticks;
        return dispatch({
          type: UPDATE_LAST_TICK,
          tracker,
        });
      }));

export const COMPLETE_CHANGE = 'COMPLETE_CHANGE';

export const completeChange = index => {
  return {
    type: COMPLETE_CHANGE,
    index,
  };
};

export const CHANGE_DAY = 'CHANGE_DAY';

export const changeDay = () => {
  const trackers = depot.loadTrackers();
  return {
    type: CHANGE_DAY,
    trackers,
  };
};
