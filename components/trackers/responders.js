'use strict';

import React from 'react';

import {PanResponder} from 'react-native';

export class ScaleResponder {
  constructor(height) {
    this._height = height;
    this._panHandlers =
      this._createResponder().panHandlers;
  }

  get panHandlers() {
    return this._panHandlers;
  }

  subscribe(onMove, onStart, onDone) {
    this._onMove = onMove;
    this._onStart = onStart;
    this._onDone = onDone;
  }

  _createResponder() {
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (e: Object, state: Object) => {
        let dy = Math.abs(state.dy);
        let dx = Math.abs(state.dx);
        let cos = dx / dy;
        return cos <= 0.20 && dy >= 20;
      },
      onPanResponderMove: (e: Object, state: Object) => {
        if (state.vy > 0) return;

        let dy = Math.abs(state.dy) * 2;
        let scale = (this._height - dy) / this._height;
        scale = Math.max(0.5, scale);

        if (this._onMove) {
          this._onMove(scale);
        }
      },
      onPanResponderGrant: (e: Object, state: Object) => {
        if (this._onStart) {
          this._onStart();
        }
      },
      onPanResponderRelease: (e: Object, state: Object) => {
        if (this._onDone) {
          this._onDone();
        }
      }
    });
  }
}
