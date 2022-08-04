import assert from 'assert';

import { Animated } from 'react-native';

import { caller } from 'app/utils/lang';

import Animation from './Animation';
import { MoveUpDownResponder } from './responders';

export default class MoveDownResponderAnim {
  moveY = new Animated.Value(0);

  in = false;

  unsubCb = null;

  constructor(slideHeight: number) {
    this.maxDy = 0.6 * slideHeight;
  }

  get style(): Object {
    return {
      transform: [{ translateY: this.moveY }],
    };
  }

  subscribe(
    responder: MoveUpDownResponder,
    onMove?: Function,
    onStart?: Function,
    onDone?: Function,
    onCancel?: Function,
  ) {
    assert.ok(responder);
    assert.ok(!this.unsubCb);

    this.moveY.addListener(({ value }) => {
      caller(onMove, value / this.maxDy);
    });
    this.unsubCb = responder.subscribeDown({
      onMove: (dy) => {
        const offset = Math.min(Math.abs(dy), this.maxDy);
        this.moveY.setValue(offset);
      },
      onMoveStart: onStart,
      onMoveDone: () => this.animateIn(onDone),
      onMoveCancel: () => this.animateOut(onCancel),
    });
  }

  unsubscribe() {
    if (this.unsubCb) {
      this.unsubCb();
      this.unsubCb = null;
      this.moveY.removeAllListeners();
    }
  }

  dispose() {
    this.unsubscribe();
  }

  animateIn(callback?: Function) {
    const nu = (this.maxDy - this.moveY._value) / this.maxDy;
    const inn = Animation.timing(this.moveY, nu * 300, this.maxDy);
    Animation.animate([inn], () => {
      this.in = true;
      caller(callback);
    });
  }

  animateOut(callback?: Function) {
    const out = Animation.timing(this.moveY, 300, 0);
    Animation.animate([out], () => {
      this.in = false;
      caller(callback);
    });
  }
}
