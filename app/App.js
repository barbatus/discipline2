/* @flow */

import React, { Component } from 'react';

import { Provider } from 'react-redux';

import { Navigator } from 'react-native-deprecated-custom-components';

import { StackNavigator } from 'react-navigation';

import SideMenu from 'react-native-side-menu';

import MainScreen from '../components/screens/MainScreen';

import Menu from '../components/nav/Menu';

import DayUpdateEvent from './DayUpdateEvent';

import { changeDay } from '../model/actions';

export default function CreateApp(store) {
  return StackNavigator(
    {
      Home: { screen: () => <Home store={store} /> },
    },
    { headerMode: 'none' },
  );
}

class Home extends Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      touchToClose: false,
      isOpen: false,
    };
    this.dayUpdate = new DayUpdateEvent();
  }

  componentWillMount() {
    const store = this.props.store;
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
        <SideMenu
          disableGestures
          menu={<Menu navigator={navigation} />}
          isOpen={this.state.isOpen}
        >
          <MainScreen
            navigator={navigation}
            onMenu={() => this.setState({ isOpen: true })}
          />
        </SideMenu>
      </Provider>
    );
  }
}
