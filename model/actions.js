import moment from 'moment';

import last from 'lodash/last';

import time from 'app/time/utils';

import depot from '../depot/depot';

import { Tick, mapTicks } from './Tracker';
import Trackers from './Trackers';

export const UPDATE_APP_PROPS = 'UPDATE_APP_PROPS';

export const updateAppProps = (props) => (dispatch) => (
  depot.updateAppProps(props).then((app) => dispatch({ type: UPDATE_APP_PROPS, app }))
);

export const UPDATE_COPILOT = 'UPDATE_COPILOT';

export const updateCopilot = (screen, step) => async (dispatch) => {
  const app = await depot.loadApp();
  const { copilot } = app.props;
  const updated = { ...copilot, [screen]: step };
  return depot.updateAppProps({ copilot: updated })
    .then((updApp) => dispatch({ type: UPDATE_COPILOT, app: updApp }));
};

export const UPDATE_CALENDAR = 'UPDATE_CALENDAR';

export const updateCalendar = (
  tracker,
  monthDateMs,
  startDateMs,
  endDateMs,
) => async (dispatch) => {
  const endOfPrevMs = moment(monthDateMs).subtract(1, 'month').endOf('month').valueOf();
  const promise = Promise.all([
    depot.getTicks(tracker.id, startDateMs, endDateMs),
    depot.getLastTick(tracker.id, endOfPrevMs),
  ]);

  return promise.then(([ticks, prevTick]) => (
    dispatch({
      type: UPDATE_CALENDAR,
      monthDateMs,
      tracker,
      ticks: mapTicks(ticks),
      prevTick: prevTick ? new Tick(prevTick) : null,
    })
  ));
};

export const LOAD_APP = 'APP/LOAD';

export const loadApp = () => async (dispatch) => {
  const app = await depot.loadApp();
  return dispatch({
    type: LOAD_APP,
    app,
  });
};

export const LOAD_TEST_APP = 'APP/LOAD/TEST';

export const loadTestApp = () => async (dispatch) => {
  const trackers = Trackers.genTestTrackers();
  const app = await depot.loadTestApp(trackers);
  return dispatch({
    type: LOAD_TEST_APP,
    app,
  });
};

export const REMOVE_TRACKER = 'REMOVE_TRACK';

export const removeTracker = (tracker) => (dispatch) => (
  depot.removeTracker(tracker.id).then(() => dispatch({ type: REMOVE_TRACKER, tracker }))
);

export const ADD_TRACKER = 'ADD_TRACKER';

export const addTracker = (tracker, index) => (dispatch) => (
  depot.addTrackerAt(tracker, index)
    .then((added) => dispatch({ type: ADD_TRACKER, tracker: added, index }))
);

export const UPDATE_TRACKER = 'UPDATE_TRACKER';

export const updateTracker = (tracker) => (dispatch) => (
  depot.updateTracker(tracker)
    .then((updated) => dispatch({ type: UPDATE_TRACKER, tracker: updated }))
);

export const TICK_TRACKER = 'TICK_TRACKER';

export const tickTracker = (tracker, value, data) => async (dispatch) => {
  const createdAt = time.getNowMs();
  const tick = await depot.addTick(tracker.id, createdAt, value, data);
  return dispatch({
    type: TICK_TRACKER,
    tracker,
    tick: new Tick(tick),
  });
};

export const START_TRACKER = 'START_TRACKER';

export const startTracker = (tracker, value, data) => async (dispatch) => {
  const createdAt = time.getNowMs();
  const ticks = await depot.getTicks(tracker.id, time.getDateMs());
  const startedTracker = Trackers.clone(tracker, { ticks, active: true });
  const updTracker = await depot.updateTracker(startedTracker);
  const tick = await depot.addTick(tracker.id, createdAt, value, data);
  return dispatch({
    type: START_TRACKER,
    tracker: updTracker,
    tick: new Tick(tick),
  });
};

export const STOP_TRACKER = 'STOP_TRACKER';

export const STOP_TRACKER_WITH_TICK_UPDATE = 'STOP_TRACKER_WITH_TICK_UPDATE';

export const stopTracker = (tracker, value, data) => async (dispatch) => {
  const stoppedTracker = Trackers.clone(tracker, { active: false });
  const updTracker = await depot.updateTracker(stoppedTracker);
  if (value) {
    const tick = await depot.updateLastTick(tracker.id, value, data);
    return dispatch({
      type: STOP_TRACKER_WITH_TICK_UPDATE,
      tracker: updTracker,
      tick: new Tick(tick),
    });
  }
  const tick = await depot.getLastTick(tracker.id);
  return dispatch({
    type: STOP_TRACKER_WITH_TICK_UPDATE,
    tracker: updTracker,
    tick: new Tick(tick),
  });
};

export const UNDO_LAST_TICK = 'UNDO_LAST_TICK';

export const undoLastTick = (tracker) => async (dispatch) => {
  await depot.undoLastTick(tracker.id);
  const ticks = await depot.getTicks(tracker.id, time.getDateMs());
  return dispatch({
    type: UNDO_LAST_TICK,
    tracker: Trackers.clone(tracker, { ticks }),
  });
};

export const UPDATE_LAST_TICK = 'UPDATE_LAST_TICK';

export const updateLastTick = (tracker, value, data, progress) => async (dispatch) => {
  // const tick = await depot.getLastTick(tracker.id);
  const lastTick = last(tracker.ticks);
  const tick = new Tick({ ...lastTick, value, data });
  return dispatch({
    type: UPDATE_LAST_TICK,
    tracker,
    progress,
    tick,
  });
};

export const COMPLETE_CHANGE = 'COMPLETE_CHANGE';

export const completeChange = (index) => ({
  type: COMPLETE_CHANGE,
  index,
});

export const CHANGE_DAY = 'CHANGE_DAY';

export const changeDay = () => async (dispatch) => {
  const trackers = await depot.getTrackers();
  return dispatch({
    type: CHANGE_DAY,
    todayMs: time.getDateMs(),
    trackers,
  });
};
