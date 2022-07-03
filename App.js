/* @flow strict-local */

import { AppRegistry } from 'react-native';
import 'react-native-get-random-values';

import createStore from './model/createStore';

import createApp from './app/App';

const store = createStore();

const App = createApp(store);

export default App;

AppRegistry.registerComponent('Discipline', () => App);
