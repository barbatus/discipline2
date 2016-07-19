'use strict';

import React from 'react';

import {PanResponder} from 'react-native';

import {caller} from '../../utils/lang';

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

import {Animated} from 'react-native';

import {slideHeight} from './styles/slideStyles';

import Animation from '../animation/Animation';

export class ScaleResponderAnimation {
  _scale = new Animated.Value(1);
  _responder = new ScaleResponder(slideHeight);

  constructor(onScale, onStart, onDone) {
    this._responder.subscribe(scale => {
      this._scale.setValue(scale);
      caller(onScale, scale - 0.5);
    }, onStart, () => {
      if (this._scale._value <= 0.5) {
        caller(onDone);
        return;
      }
      Animation.timing(this._scale, 200, 0.5, onDone);
    });
  }

  get style(): Object {
    return {
      transform: [{
        scale: this._scale
      }]
    }
  }

  get panHandlers() {
    return this._responder.panHandlers;
  }

  animateIn(callback) {
    Animation.timing(this._scale, 500, 1, callback);
  }

  animateOut(callback) {
    Animation.timing(this._scale, 500, 0, callback);
  }
}
