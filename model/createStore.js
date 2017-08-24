import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunk from 'redux-thunk';

import { trackersReducer } from './reducers';

const middleware = applyMiddleware(thunk);

export default (data = {}) => {
  const rootReducer = combineReducers({
    trackers: trackersReducer,
  });
  return createStore(rootReducer, data, middleware);
};
