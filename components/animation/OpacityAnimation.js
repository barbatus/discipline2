'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

import Animation from './Animation';

export default class OpacityAnimation {
  _op: Animated.Value;

  constructor(opacity: number = 1) {
    this._op = new Animated.Value(opacity);
  }

  get style(): Object {
    return {
      opacity: this._op
    }
  }

  get value() {
    return this._op._value;
  }

  setIn() {
    this._op.setValue(1);
  }

  setOut() {
    this._op.setValue(0);
  }

  animateIn(callback?: Function) {
    let inn = Animation.timing(this._op, 1000, 1);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    let out = Animation.timing(this._op, 1000, 0);
    Animation.animate([out], callback);
  }
}
