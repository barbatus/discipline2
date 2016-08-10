'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

class AnimationManager {
  _on = false;

  get on(): boolean {
    return this._on;
  }

  timing(field, duration, toValue, easing) {
    let config = { duration, toValue };
    if (easing) {
      config.easing = easing;
    }

    return Animated.timing(field, config);
  }

  animate(animations, callback) {
    this._on = true;
    Animated.parallel(animations).start(() => {
      this._on = false;
      caller(callback);
    });
  }

  animateIn(animations, callback) {
    this.animate(animations.map(an => an.aIn), callback);
  }

  animateOut(animations, callback) {
    this.animate(animations.map(an => an.aOut), callback);
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
