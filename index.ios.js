 /* @flow */

'use strict';

import './globals';

import React, { Component } from 'react';

import {
  AppRegistry,
  Navigator,
  StyleSheet
} from 'react-native';

import SideMenu from 'react-native-side-menu';
import MainScreen from './components/screens/MainScreen';
import Menu from './components/nav/Menu';

export default class DisciplineApp extends Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      touchToClose: false,
      isOpen: false
    };
  }

  renderScene(route: any, navigator: any) {
    const Component = route.component;
    const menu = <Menu navigator={navigator} />;

    return (
      <SideMenu
        disableGestures={true}
        menu={menu}
        isOpen={this.state.isOpen}>
        <Component
          navigator={navigator}
          route={route}
          onMenu={() => this.setState({isOpen: true})} />
      </SideMenu>
    );
  }

  render() {
    return (
      <Navigator
        debugOverlay={false}
        initialRoute={{
          component: MainScreen
        }}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

AppRegistry.registerComponent('Discipline', () => DisciplineApp);
