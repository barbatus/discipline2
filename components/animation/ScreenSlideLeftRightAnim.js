import Easing from 'Easing';

import { Animated } from 'react-native';

import { caller } from '../../utils/lang';

import Animation from './Animation';

import { screenWidth } from '../styles/common';

export default class ScreenSlideLeftRightAnim {
  _moveX: Animated.Value;

  constructor(posX = 1) {
    this._moveX = new Animated.Value(posX);
  }

  get style(): Object {
    return {
      transform: [
        {
          translateX: this._moveX.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-(screenWidth + 1), 0, screenWidth + 1],
          }),
        },
      ],
    };
  }

  get value() {
    return this._moveX._value;
  }

  get aIn() {
    return Animation.timing(
      this._moveX,
      500,
      this.value + 1,
      Easing.inOut(Easing.linear),
    );
  }

  get aOut() {
    return Animation.timing(
      this._moveX,
      500,
      this.value - 1,
      Easing.inOut(Easing.linear),
    );
  }

  animateIn(callback) {
    Animation.animate([this.aIn], callback);
  }

  setIn() {
    this._moveX.setValue(this.value + 1);
  }

  animateOut(callback) {
    Animation.animate([this.aOut], callback);
  }

  setOut() {
    this._moveX.setValue(this.value - 1);
  }
}
