import { PanResponder } from 'react-native';

import { caller } from 'app/utils/lang';

const ANGLE_TRESHOLD = Math.sin(10 * (Math.PI / 180));

const DY_TRESHOLD = 20;

export class MoveUpDownResponder {
  disabled = false;

  constructor() {
    this.panHandlers = this.createResponder().panHandlers;
  }

  subscribeUp({ onMove, onMoveStart, onMoveDone, onMoveCancel }) {
    this.onMoveUp = onMove;
    this.onMoveUpStart = onMoveStart;
    this.onMoveUpDone = onMoveDone;
    this.onMoveUpCancel = onMoveCancel;

    return () => this.unsubscribeUp();
  }

  subscribeDown({ onMove, onMoveStart, onMoveDone, onMoveCancel }) {
    this.onMoveDown = onMove;
    this.onMoveDownStart = onMoveStart;
    this.onMoveDownDone = onMoveDone;
    this.onMoveDownCancel = onMoveCancel;

    return () => this.unsubscribeDown();
  }

  unsubscribeUp() {
    this.onMoveUp = null;
    this.onMoveUpStart = null;
    this.onMoveUpDone = null;
    this.onMoveUpCancel = null;
  }

  unsubscribeDown() {
    this.onMoveDown = null;
    this.onMoveDownStart = null;
    this.onMoveDownDone = null;
    this.onMoveDownCancel = null;
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  dispose() {
    this.unsubscribeUp();
    this.unsubscribeDown();
  }

  createResponder() {
    let isUp = false;
    let isDown = false;

    return PanResponder.create({
      onMoveShouldSetPanResponder: (e: Object, state: Object) => {
        if (this.disabled) {
          return false;
        }

        const dy = Math.abs(state.dy);
        const dx = Math.abs(state.dx);
        const sin = dx / Math.sqrt(dy * dy + dx * dx);
        isUp = state.dy < 0;
        isDown = state.dy > 0;
        return sin <= ANGLE_TRESHOLD && dy >= DY_TRESHOLD;
      },
      onPanResponderMove: (e: Object, state: Object) => {
        if (isUp) {
          caller(this.onMoveUp, state.dy);
        }
        if (isDown) {
          caller(this.onMoveDown, state.dy);
        }
      },
      onPanResponderGrant: () => {
        if (isUp) {
          caller(this.onMoveUpStart);
        }
        if (isDown) {
          caller(this.onMoveDownStart);
        }
      },
      onPanResponderTerminate: () => {
        if (isUp) {
          caller(this.onMoveUpCancel);
        }
        if (isDown) {
          caller(this.onMoveDownCancel);
        }
      },
      onPanResponderRelease: () => {
        if (isUp) {
          caller(this.onMoveUpDone);
        }
        if (isDown) {
          caller(this.onMoveDownDone);
        }
      },
    });
  }
}
