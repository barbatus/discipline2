import { createStore, applyMiddleware, combineReducers } from 'redux';

import thunk from 'redux-thunk';

import { reducer as form } from 'redux-form';

import { trackersReducer } from './reducers';

const middleware = applyMiddleware(thunk);

export default (data = {}) => {
  const rootReducer = combineReducers({
    trackers: trackersReducer,
    form,
  });
  return createStore(rootReducer, data, middleware);
};
