import { Animated } from 'react-native';

import flatten from 'lodash/flatten';

import { caller } from 'app/utils/lang';

export class AnimationManager {
  on = false;

  animations = [];

  callback = [];

  timeout = null;

  timing(field, duration, toValue, easing) {
    const config = { duration, toValue, useNativeDriver: true };
    if (easing) {
      config.easing = easing;
    }
    return Animated.timing(field, config);
  }

  setValue(field, toValue, callback) {
    this.animate([this.timing(field, 0, toValue)], callback);
  }

  animate(animations, callback) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    animations.forEach((anim) => {
      this.animations.push(anim);
    });
    this.callback.push(callback);
    this.timeout = setTimeout(() => {
      const allCb = this.callback.slice();
      const allAnim = this.animations.slice();
      this.callback.length = 0;
      this.animations.length = 0;
      this.runParallel(allAnim, () => allCb.forEach((cb) => caller(cb)));
    });
  }

  animateIn(animations, callback) {
    this.animate(animations.map((an) => an.aIn), callback);
  }

  animateOut(animations, callback) {
    this.animate(animations.map((an) => an.aOut), callback);
  }

  combineStyles(...anims) {
    const transform = flatten(anims.map((anim) => anim.style.transform));
    return { transform };
  }

  runParallel(animations, callback) {
    this.on = true;
    Animated.parallel(animations).start(() => {
      this.on = false;
      caller(callback);
    });
  }
}

export default new AnimationManager();
