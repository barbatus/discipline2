'use strict';

import Easing from 'Easing';

import {Animated} from 'react-native';

import {caller} from '../../utils/lang';

class AnimationManager {
  _on = false;

  _animations = [];

  _callback = [];

  _timeout = null;

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
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    animations.forEach(anim => {
      this._animations.push(anim);
    });
    this._callback.push(callback);
    this._timeout = setTimeout(() => {
      const callbacks = this._callback.slice();
      const animations = this._animations.slice();
      this._callback.length = 0;
      this._animations.length = 0;
      this._animate(animations, () => {
        callbacks.forEach(cb => caller(cb));
      });
    });
  }

  animateIn(animations, callback) {
    this.animate(animations.map(an => an.aIn), callback);
  }

  animateOut(animations, callback) {
    this.animate(animations.map(an => an.aOut), callback);
  }

  combineStyles(...anims) {
    let transform = [];
    for (const anim of anims) {
      transform = transform.concat(
        anim.style.transform);
    }
    return { transform }
  }

  _animate(animations, callback) {
    this._on = true;
    Animated.parallel(animations).start(() => {
      this._on = false;
      caller(callback);
    });
  }
}

const Animation = new AnimationManager();
export default Animation;
