/* @flow */

import { AppRegistry } from 'react-native';

import { loadApp } from './model/actions';

import createStore from './model/createStore';

import createApp from './app/App';

const store = createStore();

const App = createApp(store);

export default App;

AppRegistry.registerComponent('Discipline', () => App);
