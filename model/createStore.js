import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import createThunkErrorHandlerMiddleware from 'redux-thunk-error-handler';
import Reactotron from 'reactotron-react-native';

import Bugsnag from 'app/log/Bugsnag';

import { trackersReducer } from './reducers';

function uncatchErrorHandler(error) {
  Reactotron.error(error);
  Bugsnag.notify(error);
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
