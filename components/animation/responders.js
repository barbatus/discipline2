'use strict';

import React from 'react';

import {PanResponder} from 'react-native';

import {caller} from '../../utils/lang';

export class MoveUpDownResponder {
  _stopped = false;

  constructor() {
    this._panHandlers =
      this._createResponder().panHandlers;
  }

  get panHandlers() {
    return this._panHandlers;
  }

  get stopped() {
    return this._stopped;
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

  stop() {
    this._stopped = true;
  }

  resume() {
    this._stopped = false;
  }

  _createResponder() {
    let isUp = false;

    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e: Object, state: Object) => {
        let dy = Math.abs(state.dy);
        let dx = Math.abs(state.dx);
        let cos = dx / dy;
        let captured = cos <= 0.20 && dy >= 20;
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
