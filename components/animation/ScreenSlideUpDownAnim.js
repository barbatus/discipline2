import { Animated } from 'react-native';

import { screenHeight } from 'app/components/styles/common';

import Animation from './Animation';

export default class ScreenSlideUpDownAnim {
  moveY = new Animated.Value(0);
  inn = true;

  constructor(scaleFactor = 1) {
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

  get in() {
    return this.inn;
  }

  setIn() {
    Animation.setValue(this.moveY, 0, () => (this.inn = true));
  }

  setOut() {
    Animation.setValue(this.moveY, 1, () => (this.inn = false));
  }
}
