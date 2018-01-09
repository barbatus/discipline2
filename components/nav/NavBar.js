import check from 'check-types';

import React, { PureComponent } from 'react';

import { StyleSheet, Animated } from 'react-native';

import NavigationBar from 'react-native-navbar';

import { caller } from 'app/utils/lang';

import Animation from '../animation/Animation';

import NavTitle from './Title';

import { screenWidth, navHeight } from '../styles/common';

const styles = StyleSheet.create({
  navbar: {
    height: navHeight,
    width: screenWidth,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
});

export default class NavBar extends PureComponent {
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

      this.showButtons(() => {
        caller(callback);
      });
    };

    if (!this.state.leftBtn && !this.state.rightBtn) {
      showButtons();
      return;
    }

    this.hideButtons(() => {
      showButtons();
    });
  }

  setOpacity(dx: number) {
    check.assert.number(dx);

    this.opacity.setValue(dx);
  }

  setTitle(title: string, titleStyle: Object) {
    this.setState({
      title,
      titleStyle,
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

  getAnimatedBtn(button) {
    const mode = this.state.disabled ? 'none' : 'auto';
    const style = [{ opacity: this.btnOpacity }];
    return (
      <Animated.View pointerEvents={mode} style={style}>
        {button}
      </Animated.View>
    );
  }

  animateOpacity(value, callback) {
    const anim = Animation.timing(this.btnOpacity, 500, value);
    Animation.animate([anim], callback);
  }

  showButtons(callback: Function) {
    this.animateOpacity(1, callback);
  }

  hideButtons(callback: Function) {
    this.animateOpacity(0, callback);
  }

  active = false;

  opacity = new Animated.Value(1);

  btnOpacity = new Animated.Value(0);

  render() {
    const { title, titleStyle, leftBtn, rightBtn } = this.state;
    const style = [styles.navbar, { opacity: this.opacity }];
    return (
      <Animated.View style={style}>
        <NavigationBar
          tintColor="transparent"
          navigator={navigator}
          title={<NavTitle style={titleStyle} title={title} />}
          leftButton={this.getAnimatedBtn(leftBtn)}
          rightButton={this.getAnimatedBtn(rightBtn)}
        />
      </Animated.View>
    );
  }
}
