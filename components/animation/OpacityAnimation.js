import Easing from 'Easing';

import { Animated } from 'react-native';

import Animation from './Animation';

export default class OpacityAnimation {
  op: Animated.Value;

  constructor(opacity: number = 1) {
    this.op = new Animated.Value(opacity);
  }

  get style(): Object {
    return {
      opacity: this.op,
    };
  }

  get value() {
    return this.op._value;
  }

  setIn() {
    this.op.setValue(1);
  }

  setOut() {
    this.op.setValue(0);
  }

  animateIn(callback?: Function) {
    const inn = Animation.timing(this.op, 1000, 1);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this.op, 1000, 0);
    Animation.animate([out], callback);
  }
}
