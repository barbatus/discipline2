import Easing from 'Easing';

import { Animated } from 'react-native';

import { caller } from '../../utils/lang';

import Animation from './Animation';

export default class ScaleAnimation {
  scale: Animated.Value;

  constructor(scale = 1) {
    this.scale = new Animated.Value(scale);
  }

  get style(): Object {
    return {
      transform: [{ scale: this.scale }],
    };
  }

  get value() {
    return this.scale._value;
  }

  animateIn(callback?: Function) {
    const inn = Animation.timing(this.scale, 500, 1);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this.scale, 500, 0);
    Animation.animate([out], callback);
  }
}
