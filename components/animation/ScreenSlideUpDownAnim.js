import Easing from 'Easing';

import { Animated } from 'react-native';

import { caller } from '../../utils/lang';

import Animation from './Animation';

import { screenHeight } from '../styles/common';

export default class ScreenSlideUpDownAnim {
  moveY = new Animated.Value(0);

  constructor(scaleFactor: number = 1) {
    this.scaleFactor = scaleFactor;
  }

  get style(): Object {
    return {
      transform: [
        {
          translateY: this.moveY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight / this.scaleFactor],
          }),
        },
      ],
    };
  }

  get value() {
    return this.moveY._value;
  }

  setIn() {
    Animation.setValue(this.moveY, 0);
  }

  setOut() {
    Animation.setValue(this.moveY, 1);
  }
}
