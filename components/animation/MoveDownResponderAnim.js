'use strict';

import {Animated} from 'react-native';

import Animation from './Animation';

import {MoveUpDownResponder} from './responders';

import {caller} from '../../utils/lang';

export class MoveDownResponderAnim {
  _moveY = new Animated.Value(0);

  constructor(responder: MoveUpDownResponder, slideHeight: number,
              onMove?: Function, onStart?: Function, onDone?: Function) {
    this._maxDy = 0.75 * slideHeight;

    this._moveY.addListener(({ value }) => {
      caller(onMove, value / this._maxDy);
    });

    responder.subscribeDown({
      onMove: dy => {
        dy = Math.min(Math.abs(dy), this._maxDy);
        this._moveY.setValue(dy);
      },
      onMoveStart: onStart,
      onMoveDone: () => {
        this.animateIn(onDone);
      }
    });
  }

  get style(): Object {
    return {
      transform: [{
        translateY: this._moveY
      }]
    }
  }

  dispose() {
    this._moveY.removeAllListeners();
  }

  animateIn(callback?: Function) {
    let inn = Animation.timing(this._moveY, 500, this._maxDy);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    let out = Animation.timing(this._moveY, 500, 0);
    Animation.animate([out], callback);
  }
}
