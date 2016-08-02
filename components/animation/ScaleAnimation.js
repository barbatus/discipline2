'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

import Animation from './Animation';

export default class ScaleAnimation {
  _scale: Animated.Value;

  constructor(scale: number = 1) {
    this._scale = new Animated.Value(scale);
  }

  get style(): Object {
    return {
      transform: [{
        scale: this._scale
      }]
    }
  }

  get value() {
    return this._scale._value;
  }

  animateIn(callback) {
    Animation.timing(this._scale, 500, 1, null, callback);
  }

  animateOut(callback: Function) {
    Animation.timing(this._scale, 500, 0, null, callback);
  }
}
