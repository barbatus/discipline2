import assert from 'assert';

import { Animated } from 'react-native';

import { caller } from 'app/utils/lang';

import Animation from './Animation';

import { MoveUpDownResponder } from './responders';

export const minScale = 0.1;
export const minMoveScale = 0.5;

export class MoveUpScaleResponderAnim {
  scale = new Animated.Value(1);

  slideHeight = 0;
  unsubCb = null;

  constructor(slideHeight: number) {
    this.slideHeight = slideHeight;
  }

  get style(): Object {
    return {
      transform: [{ scale: this.scale }],
    };
  }

  subscribe(
    responder: MoveUpDownResponder,
    onScale?: Function,
    onStart?: Function,
    onDone?: Function,
  ) {
    assert.ok(responder);

    this.scale.addListener(({ value }) =>
      caller(onScale, value <= minScale ? 0 : value)
    );
    this.unsubCb = responder.subscribeUp({
      onMove: (dy) => {
        const speed = Math.abs(dy) * 2;
        let scale = (this.slideHeight - speed) / this.slideHeight;
        scale = Math.max(minMoveScale, scale);
        this.scale.setValue(scale);
      },
      onMoveStart: onStart,
      onMoveDone: () => {
        if (this.scale._value < 1) {
          const toMin = Animation.timing(this.scale, 200, minScale);
          Animation.animate([toMin], onDone);
        }
      },
    });
  }

  unsubscribe() {
    if (this.unsubCb) {
      this.unsubCb();
    }
  }

  dispose() {
    this.unsubscribe();
    this.scale.removeAllListeners();
  }

  animateIn(callback?: Function) {
    const inn = Animation.timing(this.scale, 500, 1);
    Animation.animate([inn], callback);
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this.scale, 500, 0);
    Animation.animate([out], callback);
  }
}
