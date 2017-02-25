'use strict';

import Easing from 'Easing';

import { Animated } from 'react-native';

import { caller } from '../../utils/lang';

import Animation from './Animation';

import { screenHeight } from '../styles/common';

export default class ScreenSlideUpDownAnim {
  _moveY = new Animated.Value(0);

  constructor(scaleFactor: number = 1) {
    this._scaleFactor = scaleFactor;
  }

  get style(): Object {
    return {
      transform: [
        {
          translateY: this._moveY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight / this._scaleFactor],
          }),
        },
      ],
    };
  }

  get value() {
    return this._moveY._value;
  }

  setIn() {
    this._moveY.setValue(0);
  }

  setOut() {
    this._moveY.setValue(1);
  }
}
