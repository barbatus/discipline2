/* @flow */

import React, { PureComponent } from 'react';

import { Provider } from 'react-redux';

import { Store } from 'redux';

import { StackNavigator as StackNav } from 'react-navigation';

import MainScreen from '../components/screens/MainScreen';

import DayUpdateEvent from './DayUpdateEvent';

import { changeDay } from '../model/actions';

export default function CreateApp(store: Store<any>) {
  return StackNav(
    {
      Home: { screen: (props) => <Home {...props} store={store} /> },
    },
    { headerMode: 'none' },
  );
}

class Home extends PureComponent<{ store: Store<any>, navigation: StackNav }> {
  dayUpdate = new DayUpdateEvent();

  componentDidMount() {
    const { store } = this.props;
    this.dayUpdate.on(() => {
      store.dispatch(changeDay());
    });
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
