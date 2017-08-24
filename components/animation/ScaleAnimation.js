import Easing from 'Easing';

import { Animated } from 'react-native';

import { caller } from '../../utils/lang';

import Animation from './Animation';

export default class ScaleAnimation {
  _scale: Animated.Value;

  constructor(scale = 1) {
    this._scale = new Animated.Value(scale);
  }

  get style(): Object {
    return {
      transform: [
        {
          scale: this._scale,
        },
      ],
    };
  }

  get value() {
    return this._scale._value;
  }

  animateIn(callback?: Function) {
    const inn = Animation.timing(this._scale, 500, 1);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this._scale, 500, 0);
    Animation.animate([out], callback);
  }
}
