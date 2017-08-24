import { Animated } from 'react-native';

import Animation from './Animation';

import { MoveUpDownResponder } from './responders';

import { caller } from '../../utils/lang';

export class MoveDownResponderAnim {
  moveY = new Animated.Value(0);

  in: boolean = false;

  constructor(slideHeight: number) {
    this.maxDy = 0.5 * slideHeight;
  }

  get style(): Object {
    return {
      transform: [
        {
          translateY: this.moveY,
        },
      ],
    };
  }

  subscribe(
    responder: MoveUpDownResponder,
    onMove?: Function,
    onStart?: Function,
    onDone?: Function,
  ) {
    assert.ok(responder);

    this.moveY.addListener(({ value }) => {
      caller(onMove, value / this.maxDy);
    });
    responder.subscribeDown({
      onMove: dy => {
        dy = Math.min(Math.abs(dy), this.maxDy);
        this.moveY.setValue(dy);
      },
      onMoveStart: onStart,
      onMoveDone: () => {
        this.animateIn(onDone);
      },
    });
  }

  dispose() {
    this.moveY.removeAllListeners();
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
      // Some issue with animate when out goes
      // immediately after in.
      if (this.moveY._value === 0) {
        this.in = false;
        caller(callback);
      }
    });
  }
}
