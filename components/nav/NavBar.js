import check from 'check-types';

import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';

import Animation from '../animation/Animation';

import NavTitle from './Title';

import NavigationBar from '../navbar/NavBar';
import { SCREEN_WIDTH, NAV_HEIHGT } from '../styles/common';

const styles = StyleSheet.create({
  navbar: {
    height: NAV_HEIHGT,
    width: SCREEN_WIDTH,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
});

export default class NavBar extends PureComponent {
  isActive = false;

  opacity = new Animated.Value(1);

  btnOpacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    };
  }

  setButtons(leftBtn, rightBtn, callback, animated = true) {
    if (!animated) {
      this.btnOpacity.setValue(1);
      this.setState({ leftBtn, rightBtn });
      this.isActive = false;
      return;
    }

    if (this.isActive) {return;}

    this.isActive = true;
    const showButtons = () => {
      if (this.isActive) {
        this.setState({ leftBtn, rightBtn });

        this.showButtons(callback);
        this.isActive = false;
      }
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

  setDisabled(disabled, callback) {
    this.setState({ disabled }, callback);
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
    const anim = Animation.timing(this.btnOpacity, 250, value);
    Animation.animate([anim], callback);
  }

  showButtons(callback: Function) {
    this.animateOpacity(1, callback);
  }

  hideButtons(callback: Function) {
    this.animateOpacity(0, callback);
  }

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
