import {Animated} from 'react-native';

import Animation from './Animation';

import {ScaleResponder} from './responders';

import {caller} from '../../utils/lang';

export const minScale = 0.1;

export class ScaleResponderAnimation {
  _scale = new Animated.Value(1);
  
  constructor(slideHeight, onScale, onStart, onDone) {
    this._responder = new ScaleResponder(slideHeight);

    this._responder.subscribe(scale => {
      this._scale.setValue(scale);
      caller(onScale, scale - 0.5);
    }, onStart, () => {
      if (this._scale._value <= minScale) {
        caller(onDone);
        return;
      }
      Animation.timing(this._scale, 200, minScale, null, onDone);
    });
  }

  get style(): Object {
    return {
      transform: [{
        scale: this._scale
      }]
    }
  }

  get panHandlers() {
    return this._responder.panHandlers;
  }

  animateIn(callback) {
    Animation.timing(this._scale, 500, 1, null, callback);
  }

  animateOut(callback) {
    Animation.timing(this._scale, 500, 0, null, callback);
  }
}
