/* @flow */

import React, { PureComponent } from 'react';

import { Provider } from 'react-redux';

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

class Home extends PureComponent {
  constructor(props: any) {
    super(props);
    this.state = {
      touchToClose: false,
      isOpen: false,
    };
    this.dayUpdate = new DayUpdateEvent();
    this.onMenuChange = ::this.onMenuChange;
    this.onMenu = ::this.onMenu;
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

  onMenuChange(isOpen) {
    this.setState({
      isOpen,
    });
  }

  onMenu() {
    this.setState({
      isOpen: true,
    });
  }

  render() {
    const { store, navigation } = this.props;
    const { isOpen } = this.state;
    return (
      <Provider store={store}>
        <SideMenu
          disableGestures
          menu={<Menu navigator={navigation} />}
          isOpen={isOpen}
          onChange={this.onMenuChange}
        >
          <MainScreen
            navigator={navigation}
            onMenu={this.onMenu}
          />
        </SideMenu>
      </Provider>
    );
  }
}
