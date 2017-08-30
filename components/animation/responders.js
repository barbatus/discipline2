import React from 'react';

import { PanResponder } from 'react-native';

import { caller } from '../../utils/lang';

const ANGLE_TRESHOLD = Math.sin(10 * (Math.PI / 180));

const DY_TRESHOLD = 20;

export class MoveUpDownResponder {
  constructor() {
    this.panHandlers = this.createResponder().panHandlers;
  }

  subscribeUp({ onMove, onMoveStart, onMoveDone }) {
    this.onMoveUp = onMove;
    this.onMoveUpStart = onMoveStart;
    this.onMoveUpDone = onMoveDone;
  }

  subscribeDown({ onMove, onMoveStart, onMoveDone }) {
    this.onMoveDown = onMove;
    this.onMoveDownStart = onMoveStart;
    this.onMoveDownDone = onMoveDone;
  }

  dispose() {
    this.onMoveUp = null;
    this.onMoveUpStart = null;
    this.onMoveUpDone = null;
    this.onMoveDown = null;
    this.onMoveDownStart = null;
    this.onMoveDownDone = null;
  }

  createResponder() {
    let isUp = false;

    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e: Object, state: Object) => {
        const dy = Math.abs(state.dy);
        const dx = Math.abs(state.dx);
        const sin = dx / Math.sqrt(dy * dy + dx * dx);
        const captured = sin <= ANGLE_TRESHOLD && dy >= DY_TRESHOLD;
        isUp = state.vy < 0;
        return captured;
      },
      onPanResponderMove: (e: Object, state: Object) => {
        if (isUp && state.vy > 0) return;

        if (!isUp && state.vy < 0) return;

        if (isUp) caller(this.onMoveUp, state.dy);

        if (!isUp) caller(this.onMoveDown, state.dy);
      },
      onPanResponderGrant: (e: Object) => {
        if (isUp) caller(this.onMoveUpStart);

        if (!isUp) caller(this.onMoveDownStart);
      },
      onPanResponderRelease: (e: Object) => {
        if (isUp) caller(this.onMoveUpDone);

        if (!isUp) caller(this.onMoveDownDone);
      },
    });
  }
}
