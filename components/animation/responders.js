'use strict';

import React from 'react';

import {PanResponder} from 'react-native';

import {caller} from '../../utils/lang';

export class MoveUpDownResponder {
  constructor() {
    this._panHandlers =
      this._createResponder().panHandlers;
  }

  get panHandlers() {
    return this._panHandlers;
  }

  subscribeUp({ onMove, onMoveStart, onMoveDone }) {
    this._onMoveUp = onMove;
    this._onMoveUpStart = onMoveStart;
    this._onMoveUpDone = onMoveDone;
  }

  subscribeDown({ onMove, onMoveStart, onMoveDone }) {
    this._onMoveDown = onMove;
    this._onMoveDownStart = onMoveStart;
    this._onMoveDownDone = onMoveDone;
  }

  dispose() {
    this._onMoveUp = null;
    this._onMoveUpStart = null;
    this._onMoveUpDone = null;
    this._onMoveDown = null;
    this._onMoveDownStart = null;
    this._onMoveDownDone = null;
  }

  _createResponder() {
    let isUp = false;

    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e: Object, state: Object) => {
        const dy = Math.abs(state.dy);
        const dx = Math.abs(state.dx);
        const cos = dx / dy;
        const captured = cos <= 0.20 && dy >= 20;
        isUp = state.vy < 0;
        return captured && !this.stopped;
      },
      onPanResponderMove: (e: Object, state: Object) => {
        if (isUp && state.vy > 0) return;

        if (!isUp && state.vy < 0) return;

        if (isUp) caller(this._onMoveUp, state.dy);

        if (!isUp) caller(this._onMoveDown, state.dy);
      },
      onPanResponderGrant: (e: Object, state: Object) => {
        if (isUp) caller(this._onMoveUpStart);

        if (!isUp) caller(this._onMoveDownStart);
      },
      onPanResponderRelease: (e: Object, state: Object) => {
        if (isUp) caller(this._onMoveUpDone);

        if (!isUp) caller(this._onMoveDownDone);
      }
    });
  }
}
