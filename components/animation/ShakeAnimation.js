import { Animated, Easing } from 'react-native';

import { caller } from 'app/utils/lang';

import Animation from './Animation';

export default class ShakeAnimation {
  moveX: Animated.Value;

  constructor(range = 5) {
    this.moveX = new Animated.Value(0);
    this.translateX = this.defineInterpolation(range);
  }

  get style(): Object {
    return {
      transform: [{ translateX: this.translateX }],
    };
  }

  defineInterpolation(range: number) {
    const inputRange = [0];
    const outputRange = [0];
    const step = 1 / (range * 2 + 1);
    let steps = step;
    for (let i = range; i >= 1; i -= 1) {
      inputRange.push(steps);
      inputRange.push(steps + step);
      outputRange.push(-i);
      outputRange.push(i);
      steps += 2 * step;
    }
    inputRange.push(1);
    outputRange.push(0);
    return this.moveX.interpolate({
      inputRange,
      outputRange,
    });
  }

  animate(callback?: Function) {
    const anim = Animation.timing(
      this.moveX,
      500,
      1,
      Easing.out(Easing.circle),
    );
    Animation.animate([anim], () => {
      this.moveX.setValue(0);
      caller(callback);
    });
  }
}
