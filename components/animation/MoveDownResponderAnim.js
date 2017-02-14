'use strict';

import {Animated} from 'react-native';

import Animation from './Animation';

import {MoveUpDownResponder} from './responders';

import {caller} from '../../utils/lang';

export class MoveDownResponderAnim {
  _moveY = new Animated.Value(0);

  _in: boolean = false;

  constructor(slideHeight: number) {
    this._maxDy = 0.5 * slideHeight;
  }

  get in() {
    return this._in;
  }

  get style(): Object {
    return {
      transform: [{
        translateY: this._moveY
      }]
    }
  }

  subscribe(responder: MoveUpDownResponder,
            onMove?: Function, onStart?: Function, onDone?: Function) {
    assert.ok(responder);

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

  dispose() {
    this._moveY.removeAllListeners();
  }

  animateIn(callback?: Function) {
    const inn = Animation.timing(this._moveY, 500, this._maxDy);
    Animation.animate([inn], () => {
      this._in = true;
      caller(callback);
    });
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this._moveY, 500, 0);
    Animation.animate([out], () => {
      this._in = false;
      caller(callback);
    });
  }
}
