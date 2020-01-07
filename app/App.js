/* @flow */

import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import {
  createStackNavigator,
  createAppContainer,
  StackNavigator as StackNav,
} from 'react-navigation';

import Logger from 'app/log';

import { changeDay, loadApp } from '../model/actions';
import MainScreen from './screens/MainScreen';

import DayChangeEvent from './DayChangeEvent';

export default function createApp(store: Store<any>) {
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
    store.dispatch(changeDay());
    Logger.log('Day has been changed');
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
