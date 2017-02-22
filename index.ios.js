 /* @flow */

'use strict';

import React, {Component} from 'react';

import {AppRegistry, View} from 'react-native';

import './globals';

import {loadTestData} from './model/actions';

import createStore from './model/createStore';

import CreateApp from './app/App';

const store = createStore();

AppRegistry.registerComponent('Discipline', () => CreateApp(store));

store.dispatch(loadTestData());
