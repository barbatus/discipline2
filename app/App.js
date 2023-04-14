/* @flow */

import React, { PureComponent } from 'react';
import { InteractionManager, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { createAppContainer } from 'react-navigation';
import {
  createStackNavigator,
  StackNavigator as StackNav,
} from 'react-navigation-stack';

import Logger from 'app/log';

import { changeDay, loadApp } from '../model/actions';
import MainScreen from './screens/MainScreen';

import DayChangeEvent from './DayChangeEvent';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

export default function createApp(store: Store<any>) {
  Logger.leaveBreadcrumb('App opened');

  return createAppContainer(
    createStackNavigator({
      Home: {
        screen: (props: { navigation: StackNav }) => (
          <Home navigation={props.navigation} store={store} />
        ),
      },
    },
    { headerMode: 'none' }),
  );
}

class Home extends PureComponent<{ store: Store<any>, navigation: StackNav }> {
  constructor(props) {
    super(props);
    this.onDayChange = ::this.onDayChange;
  }

  componentDidMount() {
    const { store } = this.props;
    DayChangeEvent.on(this.onDayChange);
    store.dispatch(loadApp());
  }

  componentWillUnmount() {
    DayChangeEvent.off(this.onDayChange);
  }

  onDayChange() {
    const { store } = this.props;
    InteractionManager.runAfterInteractions(() => {
      store.dispatch(changeDay());
    });
    Logger.log('Day has changed');
  }

  render() {
    const { store, navigation } = this.props;
    return (
      <Provider store={store}>
        <MainScreen navigator={navigation} />
      </Provider>
    );
  }
}
