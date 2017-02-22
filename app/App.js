/* @flow */

'use strict';

import React, {Component} from 'react';

import {Provider} from 'react-redux';

import {Navigator, StyleSheet} from 'react-native';

import SideMenu from 'react-native-side-menu';

import MainScreen from '../components/screens/MainScreen';

import Menu from '../components/nav/Menu';

import DayUpdateEvent from './DayUpdateEvent';

import {changeDay} from '../model/actions';

export default function CreateApp(store) {
  return () => <App store={store} />;
}

class App extends Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      touchToClose: false,
      isOpen: false,
    };
    this._dayUpdate = new DayUpdateEvent();
  }

  componentWillMount() {
    const store = this.props.store;
    this._dayUpdate.on(() => {
      store.dispatch(changeDay());
    });
  }

  componentWillUnmount() {
    this._dayUpdate.destroy();
  }

  renderScene(route: any, navigator: any) {
    const Component = route.component;
    const menu = <Menu navigator={navigator} />;
    const store = this.props.store;

    return (
      <Provider store={store}>
        <SideMenu
          disableGestures={true}
          menu={menu}
          isOpen={this.state.isOpen}>
          <Component
            navigator={navigator}
            route={route}
            onMenu={() => this.setState({isOpen: true})}
          />
        </SideMenu>
      </Provider>
    );
  }

  render() {
    return (
      <Navigator
        debugOverlay={false}
        initialRoute={{
          component: MainScreen
        }}
        renderScene={::this.renderScene}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
