'use strict';

import {handleActions} from 'redux-actions';

import {List} from 'immutable';

import {
  LOAD_TEST_DATA,
  REMOVE_TRACKER,
  ADD_TRACKER,
  UPDATE_TRACKER,
  TICK_TRACKER,
  UNDO_LAST_TICK,
  UPDATE_LAST_TICK,
  CHANGE_DAY,
} from './actions';

import Trackers from './Trackers';

const trackEqual = tracker1 => {
  return tracker2 => tracker1.id === tracker2.id;
};

export const trackers = handleActions({
  [LOAD_TEST_DATA]: (state, { trackers }) => {      
    return {
      trackers: new List(trackers.map(
        tracker => Trackers.create(tracker))
      ),
    }
  },
  [REMOVE_TRACKER]: (state, { tracker }) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    return {
      removeIndex: index,
      trackers: state.trackers.delete(index),
    }
  },
  [ADD_TRACKER]: (state, { tracker, index } ) => {
    let trackers = state.trackers.insert(index,
      Trackers.create(tracker));
    return {
      addIndex: index,
      trackers,
    }
  },
  [UPDATE_TRACKER]: (state, { tracker }) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const newTracker = Trackers.create(tracker);
    const trackers = state.trackers.update(index,
      tracker => newTracker);
    return {
      updateIndex: index,
      trackers,
    }
  },
  [TICK_TRACKER]: (state, { tracker, click } ) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.create(tracker));
    return { trackers };
  },
  [UNDO_LAST_TICK]: (state, { tracker } ) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.create(tracker));
    return { trackers };
  },
  [UPDATE_LAST_TICK]: (state, { tracker }) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.create(tracker));
    return { trackers };
  },
  [CHANGE_DAY]: (state, { trackers }) => {
    return {
      trackers: new List(trackers.map(
        tracker => Trackers.create(tracker))
      ),
    };
  },
}, {});
