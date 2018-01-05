import Easing from 'Easing';

import { Animated } from 'react-native';

import Animation from './Animation';

import { screenWidth } from '../styles/common';

export default class ScreenSlideLeftRightAnim {
  moveX: Animated.Value;

  constructor(posX = 1) {
    this.moveX = new Animated.Value(posX);
  }

  get style(): Object {
    return {
      transform: [{
        translateX: this.moveX.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-(screenWidth + 1), 0, screenWidth + 1],
        }),
      }],
    };
  }

  get value() {
    return this.moveX._value;
  }

  get aIn() {
    return Animation.timing(
      this.moveX,
      500,
      this.value + 1,
      Easing.inOut(Easing.linear),
    );
  }

  get aOut() {
    return Animation.timing(
      this.moveX,
      500,
      this.value - 1,
      Easing.inOut(Easing.linear),
    );
  }

  animateIn(callback) {
    Animation.animate([this.aIn], callback);
  }

  setIn() {
    Animation.setValue(this.moveX, this.value + 1);
  }

  animateOut(callback) {
    Animation.animate([this.aOut], callback);
  }

  setOut() {
    Animation.setValue(this.moveX, this.value - 1);
  }
}
