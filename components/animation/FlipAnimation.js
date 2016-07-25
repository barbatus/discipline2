'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

import Animation from './Animation';

import {screenWidth} from '../styles/common';

export default class FlipAnimation {
  _rotY = new Animated.Value(0);
  _move1 = new Animated.Value(0);
  _move2 = new Animated.Value(1);
  _opacity1 = new Animated.Value(1);
  _opacity2 = new Animated.Value(0);

  get style1() {
    return {
      opacity: this._opacity1,
      transform: [
        {
          rotateY: this._rotY.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg']
          })
        },
        {
          translateY: this._move1.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          })
        }
      ]
    }
  }

  get style2() {
    return {
      opacity: this._opacity2,
      transform: [
        {
          rotateY: this._rotY.interpolate({
            inputRange: [0, 1],
            outputRange: ['-180deg', '0deg']
          })
        },
        {
          translateY: this._move2.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          })
        }
      ]
    }
  }

  animateIn(callback: Function) {
    this._move2.setValue(0);

    this._animateFlip(1, 0, 1,
      value => value > 0.5, () => {
        this._move1.setValue(1);
        caller(callback);
    });
  }

  animateOut(callback: Function) {
    this._move1.setValue(0);

    this._animateFlip(0, 1, 0,
      value => value <= 0.5, () => {
        this._move2.setValue(1);
        caller(callback);
    });
  }

  _animateFlip(stopVal, op1, op2, opCondition, callback) {
    this._rotY.removeAllListeners();

    let id = this._rotY.addListener(({ value }) => {
      if (opCondition(value)) {
        this._rotY.removeListener(id);
        this._opacity1.setValue(op1);
        this._opacity2.setValue(op2);
      }
    });

    Animation.timing(this._rotY, 1000, stopVal,
      Easing.inOut(Easing.sin), callback);
  }
}
