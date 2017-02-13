'use strict';

import {Animated} from 'react-native';

import Animation from './Animation';

import {MoveUpDownResponder} from './responders';

import {caller} from '../../utils/lang';

export const minScale = 0.1;

export const minMoveScale = 0.5;

export class MoveUpScaleResponderAnim {
  _scale = new Animated.Value(1);

  constructor(responder: MoveUpDownResponder, slideHeight: number,
              onScale?: Function, onStart?: Function, onDone?: Function) {

    this._scale.addListener(({value}) => {
      caller(onScale, value <= minScale ? 0 : value);
    });

    responder.subscribeUp({
      onMove: dy => {
        const speed = Math.abs(dy) * 2;
        let scale = (slideHeight - speed) / slideHeight;
        scale = Math.max(minMoveScale, scale);

        this._scale.setValue(scale);
      },
      onMoveStart: onStart,
      onMoveDone: () => {
        if (this._scale._value < 1) {
          const toMin = Animation.timing(this._scale, 200, minScale);
          Animation.animate([toMin], onDone);
        }
      }
    });
  }

  get style(): Object {
    return {
      transform: [{
        scale: this._scale
      }]
    }
  }

  dispose() {
    this._scale.removeAllListeners();
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
