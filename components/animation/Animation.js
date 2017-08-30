import Easing from 'Easing';

import { Animated, InteractionManager } from 'react-native';

import flatten from 'lodash/flatten';

import { caller } from '../../utils/lang';

export class AnimationManager {
  on = false;

  animations = [];

  callback = [];

  timeout = null;

  timing(field, duration, toValue, easing) {
    const config = { duration, toValue };
    if (easing) {
      config.easing = easing;
    }
    return Animated.timing(field, config);
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
      this.animate(allAnim, () => allCb.forEach((cb) => caller(cb)));
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

  animate(animations, callback) {
    this.on = true;
    Animated.parallel(animations).start(() => {
      this.on = false;
      caller(callback);
    });
  }
}

const Animation = new AnimationManager();
export default Animation;
