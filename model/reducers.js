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
      ...state,
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
      ...state,
      removeIndex: index,
      trackers: state.trackers.delete(index),
    }
  },
  [ADD_TRACKER]: (state, { tracker, index } ) => {
    const trackers = state.trackers.insert(index,
      Trackers.create(tracker));
    return {
      ...state,
      addIndex: index,
      trackers,
    }
  },
  [UPDATE_TRACKER]: (state, { tracker }) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.getOne(tracker.id));
    return {
      ...state,
      updateIndex: index,
      trackers,
    }
  },
  [TICK_TRACKER]: (state, { tracker, click } ) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.getOne(tracker.id));
    return {
      ...state,
      trackers,
    };
  },
  [UNDO_LAST_TICK]: (state, { tracker } ) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.getOne(tracker.id));
    return {
      ...state,
      trackers,
    };
  },
  [UPDATE_LAST_TICK]: (state, { tracker }) => {
    const equal = trackEqual(tracker);
    const index = state.trackers.findIndex(
      tracker => equal(tracker));
    const trackers = state.trackers.update(index,
      tracker => Trackers.getOne(tracker.id));
    return {
      ...state,
      trackers,
    };
  },
  [CHANGE_DAY]: (state, { trackers }) => {
    return {
      ...state,
      trackers: new List(trackers.map(
        tracker => Trackers.getOne(tracker.id))
      ),
    };
  },
}, {});
