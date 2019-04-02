/* @flow */

import React, { PureComponent } from 'react';

import { Provider } from 'react-redux';

import { Store } from 'redux';

import {
  createStackNavigator,
  createAppContainer,
  StackNavigator as StackNav,
} from 'react-navigation';

import MainScreen from '../components/screens/MainScreen';

import DayUpdateEvent from './DayUpdateEvent';

import { changeDay, loadApp } from '../model/actions';

export default function createApp(store: Store<any>) {
  return createAppContainer(
    createStackNavigator({
      Home: {
        screen: (props) => <Home navigation={props.navigation} store={store} />,
      },
    },
    { headerMode: 'none' }),
  );
}

class Home extends PureComponent<{ store: Store<any>, navigation: StackNav }> {
  dayUpdate = new DayUpdateEvent();

  componentDidMount() {
    const { store } = this.props;
    this.dayUpdate.on(() => {
      store.dispatch(changeDay());
    });
    store.dispatch(loadApp());
  }

  componentWillUnmount() {
    this.dayUpdate.destroy();
  }

  render() {
    const { store, navigation } = this.props;
    return (
      <Provider store={store}>
        <MainScreen
          navigator={navigation}
        />
      </Provider>
    );
  }
}