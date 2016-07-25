'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

import Animation from './Animation';

import {screenHeight} from '../styles/common';

export default class ScreenInOutAnimation {
  _moveY = new Animated.Value(0);

  constructor(scaleFactor = 1) {
    this._scaleFactor = scaleFactor;
  }

  get style(): Object {
    return {
      transform: [{
        translateY: this._moveY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenHeight / this._scaleFactor]
        })
      }]
    }
  }

  get value() {
    return this._moveY._value;
  }

  animateIn(callback: Function) {
    this._moveY.setValue(0);
    caller(callback);
  }

  animateOut(callback: Function) {
    this._moveY.setValue(1);
    caller(callback);
  }
}
