'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';

import NavTitle from './Title';

import NavigationBar from 'react-native-navbar';

import {screenWidth, navHeight} from '../styles/common';

import {caller} from '../../utils/lang';

class NavBar extends Component {
  _active = false;

  _opacity = new Animated.Value(1);

  constructor(props) {
    super(props);

    this.state = {
      disabled: false
    };
  }

  setButtons(leftBtn, rightBtn, callback) {
    if (this._active) return;

    this._active = true;
    this._hideButtons(() => {
      this.setState({
        leftBtn,
        rightBtn
      });

      this._showButtons(() => {
        this._active = false;
        caller(callback);
      });
    });
  }

  setOpacity(dx: number) {
    check.assert.number(dx);

    this._opacity.setValue(dx);
  }

  setTitle(navTitle: string) {
    this.setState({
      navTitle
    });
  }

  setDisabled(value, callback) {
    this.setState({
      disabled: value
    }, callback);
  }

  _hideButtons(callback: Function) {
    this._animateOpacity(0, callback);
  }

  _animateOpacity(value, callback) {
    Animated.timing(this._opacity, {
      duration: 500,
      toValue: value
    }).start(callback);
  }

  _showButtons(callback: Function) {
    this._animateOpacity(1, callback);
  }

  _getAnimatedBtn(button) {
    let mode = this.state.disabled ? 'none' : 'auto';
    return (
      <Animated.View
        pointerEvents={mode}
        style={{opacity: this._opacity}}>
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

const styles = StyleSheet.create({
  navbar: {
    height: navHeight,
    width: screenWidth,
    backgroundColor: 'transparent'
  }
});

module.exports = NavBar;
