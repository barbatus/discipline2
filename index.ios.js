/* @flow */

import { AppRegistry } from 'react-native';

import './globals';

import { loadTestData } from './model/actions';

import createStore from './model/createStore';

import CreateApp from './app/App';

const store = createStore();

const App = CreateApp(store);

export default App;

AppRegistry.registerComponent('Discipline', () => App);

store.dispatch(loadTestData());
