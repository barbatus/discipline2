/* @flow */
import env from 'react-native-config';
import { Client } from 'bugsnag-react-native';
import Reactotron from 'reactotron-react-native';

import './polyfills';
import App from './App';
import Bugsnag from './log/Bugsnag';

Bugsnag.init(env.BUGSNAG, env.NAME);

if (env.DEV) {
  import('./reactotron');
}

export default App;
