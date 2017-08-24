import { Animated } from 'react-native';

import Animation from './Animation';

import { MoveUpDownResponder } from './responders';

import { caller } from '../../utils/lang';

export const minScale = 0.1;

export const minMoveScale = 0.5;

export class MoveUpScaleResponderAnim {
  _scale = new Animated.Value(1);

  _slideHeight = 0;

  constructor(slideHeight: number) {
    this._slideHeight = slideHeight;
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

  subscribe(
    responder: MoveUpDownResponder,
    onScale?: Function,
    onStart?: Function,
    onDone?: Function,
  ) {
    assert.ok(responder);

    this._scale.addListener(({ value }) => {
      caller(onScale, value <= minScale ? 0 : value);
    });
    responder.subscribeUp({
      onMove: dy => {
        const speed = Math.abs(dy) * 2;
        let scale = (this._slideHeight - speed) / this._slideHeight;
        scale = Math.max(minMoveScale, scale);

        this._scale.setValue(scale);
      },
      onMoveStart: onStart,
      onMoveDone: () => {
        if (this._scale._value < 1) {
          const toMin = Animation.timing(this._scale, 200, minScale);
          Animation.animate([toMin], onDone);
        }
      },
    });
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
