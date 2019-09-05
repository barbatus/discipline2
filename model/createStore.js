import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';

import Logger from 'app/log';

import { trackersReducer } from './reducers';

function uncatchErrorHandler(error) {
  Logger.notify(error);
}

const errorHandlerMiddleware = createThunkErrorHandlerMiddleware({ onError: uncatchErrorHandler });

const middleware = applyMiddleware(errorHandlerMiddleware, thunk);

export default () => {
  const rootReducer = combineReducers({
    trackers: trackersReducer,
    form,
  });
  return createStore(rootReducer, {}, middleware);
};
