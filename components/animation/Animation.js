'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

class AnimationManager {
  _on = false;

  get on(): boolean {
    return this._on;
  }

  timing(field, duration, toValue, easing, callback) {
    this._on = true;
    let config = { duration, toValue }
    if (easing) {
      config.easing = easing;
    }

    Animated.timing(field, config).start(() => {
      this._on = false;
      caller(callback);
    });
  }

  combineStyles(anim1, anim2) {
    return {
      transform: [
        ...anim1.style.transform,
        ...anim2.style.transform
      ]
    }
  }
}

const Animation = new AnimationManager();
export default Animation;
