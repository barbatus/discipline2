'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import Animation from '../animation/Animation';

import NavTitle from './Title';

import NavigationBar from 'react-native-navbar';

import { screenWidth, navHeight } from '../styles/common';

import { caller } from '../../utils/lang';

class NavBar extends Component {
  _active = false;

  _opacity = new Animated.Value(1);

  _btnOpacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    };
  }

  setButtons(leftBtn, rightBtn, callback) {
    const showButtons = () => {
      this.setState({
        leftBtn,
        rightBtn,
      });

      this._showButtons(() => {
        caller(callback);
      });
    };

    if (!this.state.leftBtn && !this.state.rightBtn) {
      showButtons();
      return;
    }

    this._hideButtons(() => {
      showButtons();
    });
  }

  setOpacity(dx: number) {
    check.assert.number(dx);

    this._opacity.setValue(dx);
  }

  setTitle(navTitle: string) {
    this.setState({
      navTitle,
    });
  }

  setDisabled(value, callback) {
    this.setState(
      {
        disabled: value,
      },
      callback,
    );
  }

  _hideButtons(callback: Function) {
    this._animateOpacity(0, callback);
  }

  _animateOpacity(value, callback) {
    const anim = Animation.timing(this._btnOpacity, 500, value);
    Animation.animate([anim], callback);
  }

  _showButtons(callback: Function) {
    this._animateOpacity(1, callback);
  }

  _getAnimatedBtn(button) {
    const mode = this.state.disabled ? 'none' : 'auto';
    const style = [{ opacity: this._btnOpacity }];
    return (
      <Animated.View pointerEvents={mode} style={style}>
        {button}
      </Animated.View>
    );
  }

  render() {
    const style = [styles.navbar, { opacity: this._opacity }];
    return (
      <Animated.View style={style}>
        <NavigationBar
          ref="navBar"
          tintColor="transparent"
          navigator={navigator}
          title={<NavTitle title={this.state.navTitle} />}
          leftButton={this._getAnimatedBtn(this.state.leftBtn)}
          rightButton={this._getAnimatedBtn(this.state.rightBtn)}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    height: navHeight,
    width: screenWidth,
    backgroundColor: 'transparent',
  },
});

module.exports = NavBar;
