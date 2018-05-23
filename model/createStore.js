import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunk from 'redux-thunk';

import { reducer as form } from 'redux-form';

import time from 'app/time/utils';

import { trackersReducer } from './reducers';

const middleware = applyMiddleware(thunk);

export default () => {
  const rootReducer = combineReducers({
    trackers: trackersReducer,
    form,
  });
  const state = { trackers: { dateMs: time.getDateMs() } };
  return createStore(rootReducer, state, middleware);
};
