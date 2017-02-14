'use strict';

export const UPDATE_CALENDAR = 'UPDATE_CALENDAR';

export const updateCalendar = (tracker, todayMs, startDateMs, endDateMs) => {
  const ticks = depot.getTicks(tracker.id, startDateMs, endDateMs);
  return {
    type: UPDATE_CALENDAR,
    todayMs,
    tracker,
    ticks,
  }
};

export const tickGeoTracker = (tracker, value, data) => {
  const dateTimeMs = time.getDateTimeMs();
  const tick = depot.addTick(tracker.id, dateTimeMs, value, data);
  return {
    type: TICK_TRACKER,
    tracker,
    tick,
  };
};

export const LOAD_TEST_DATA = 'LOAD_INIT';

export const loadTestData = () => {
  const trackers = depot.loadTestData();
  return {
    type: LOAD_TEST_DATA,
    trackers,
  };
};

export const REMOVE_TRACKER = 'REMOVE_TRACK';

export const removeTracker = tracker => {
  depot.removeTracker(tracker.id);
  return {
    type: REMOVE_TRACKER,
    tracker,
  };
};

export const ADD_TRACKER = 'ADD_TRACKER';

export const addTracker = (tracker, index) => {
  tracker = depot.addTrackerAt(tracker, index);
  return {
    type: ADD_TRACKER,
    tracker,
    index,
  };
};

export const UPDATE_TRACKER = 'UPDATE_TRACKER';

export const updateTracker = (tracker) => {
  depot.updateTracker(tracker);
  return {
    type: UPDATE_TRACKER,
    tracker,
  };
};

export const TICK_TRACKER = 'TICK_TRACKER';

export const tickTracker = (tracker, value) => {
  const dateTimeMs = time.getDateTimeMs();
  const tick = depot.addTick(tracker.id, dateTimeMs, value);
  return {
    type: TICK_TRACKER,
    tracker,
    tick,
  };
};

export const UNDO_LAST_TICK = 'UNDO_LAST_TICK';

export const undoLastTick = tracker => {
  depot.undoLastTick(tracker.id);
  return {
    type: UNDO_LAST_TICK,
    tracker,
  };
};

export const UPDATE_LAST_TICK = 'UPDATE_LAST_TICK';

export const updateLastTick = (tracker, value) => {
  depot.updateLastTick(tracker.id, value);
  return {
    type: UPDATE_LAST_TICK,
    tracker,
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
