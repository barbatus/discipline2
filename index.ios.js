 /* @flow */

'use strict';

import React, {Component} from 'react';

import {AppRegistry} from 'react-native';

import './globals';

import {loadTestData} from './model/actions';

import createStore from './model/createStore';

import App from './app/App';

const store = createStore();

AppRegistry.registerComponent('Discipline',
  () => () => <App store={store} />);

store.dispatch(loadTestData());
