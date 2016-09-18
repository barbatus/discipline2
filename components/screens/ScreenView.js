'use strict';

import React, {Component} from 'react';

import {StyleSheet, View, Animated} from 'react-native';

import Easing from 'Easing';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

import ScreenSlideLeftRightAnim from '../animation/ScreenSlideLeftRightAnim';

import OpacityAnimation from '../animation/OpacityAnimation';

import Animation from '../animation/Animation';

export default class ScreenView extends Component {
  constructor(props) {
    super(props);

    let { posX } = props;
    this._leftRight = new ScreenSlideLeftRightAnim(posX);
    this._opacity = new OpacityAnimation();
  }

  static moveLeft(views, callback?: Function) {
    if (!Animation.on) {
      views.forEach(view => view.onLeftMove());
      Animation.animateOut(views.map(view => view._leftRight), callback);
    }
  }

  moveLeft(callback?: Function) {
    if (!Animation.on) {
      this.onLeftMove();
      this._leftRight.animateOut(callback);
    }
  }

  onLeftMove() {}

  setLeft() {
    this.onLeftMove();
    this._leftRight.setOut();
  }

  static moveRight(views, callback?: Function) {
    if (!Animation.on) {
      views.forEach(view => view.onRightMove());
      Animation.animateIn(views.map(view => view._leftRight), callback);
    }
  }

  moveRight(callback) {
    if (!Animation.on) {
      this.onRightMove();
      this._leftRight.animateIn(callback);
    }
  }

  onRightMove() {}

  setRight() {
    this.onRightMove();
    this._leftRight.setIn();
  }

  show(callback) {
    this._opacity.animateIn(callback);
  }

  setShown() {
    this._opacity.setIn();
  }

  hide(callback) {
    this._opacity.animateOut(callback);
  }

  setHidden() {
    this._opacity.setOut();
  }

  render() {
    let style1 = this._leftRight.style;
    let style2 = this._opacity.style;

    return (
      <Animated.View
        shouldRasterizeIOS={true}
        style={[commonStyles.absoluteFilled, style1, style2]}>
        {this.props.content || this.content}
      </Animated.View>
    );
  }
}

ScreenView.defaultProps = {
  posX: 0
};

ScreenView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = ScreenView;
