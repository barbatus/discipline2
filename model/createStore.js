'use strict';

import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';

import thunk from 'redux-thunk';

import {trackers} from './reducers';

const middleware = applyMiddleware(thunk);

export default (data = {}) => {
  const rootReducer = combineReducers({
    trackers,
  });
  return createStore(rootReducer, data, middleware);
};
