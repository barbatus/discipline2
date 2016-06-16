'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';

import NavTitle from './Title';

import NavigationBar from 'react-native-navbar';

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(1)
    };
  }

  setButtons(leftBtn, rightBtn) {
    this._hideButtons(() => {
      this.setState({
        leftBtn,
        rightBtn
      });

      this._showButtons();
    });
  }

  setTitle(navTitle) {
    this.setState({
      navTitle
    });
  }

  _hideButtons(callback) {
    Animated.timing(this.state.opacity, {
      duration: 500,
      toValue: 0
    }).start(callback);
  }

  _showButtons(callback) {
    Animated.timing(this.state.opacity, {
      duration: 500,
      toValue: 1
    }).start();
  }

  _getAnimatedBtn(button) {
    return (
      <Animated.View style={{opacity: this.state.opacity}}>
        {button}
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={styles.navbar}>
        <NavigationBar
          ref='navBar'
          tintColor='transparent'
          navigator={navigator}
          title={
            <NavTitle title={this.state.navTitle} />
          }
          leftButton={this._getAnimatedBtn(this.state.leftBtn)}
          rightButton={this._getAnimatedBtn(this.state.rightBtn)} />
      </View>
    );
  }
};

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  navbar: {
    height: 64,
    width: window.width,
    backgroundColor: 'transparent'
  }
});

module.exports = NavBar;
