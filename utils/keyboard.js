'use strict';

import React from 'react';

import {TextInput} from 'react-native';

const {State: TextInputState} = TextInput;

import {DeviceEventEmitter} from 'react-native';

import EventEmitter from 'eventemitter3';

class Keyboard {
  _events: EventEmitter = new EventEmitter();

  constructor() {
    DeviceEventEmitter.addListener(
      'keyboardWillHide', this._keyboardWillHide.bind(this));
  }

  dismiss() {
    TextInputState.blurTextInput(TextInputState.currentlyFocusedField());
  }

  shown() {
    return !!TextInputState.currentlyFocusedField();
  }

  addHideListener(cb: Function) {
    this._events.on('willHide', cb);
  }

  removeHideListener(cb: Function) {
    this._events.removeListener('willHide', cb);
  }

  _keyboardWillHide() {
    this._events.emit('willHide');
  }
}

let keyboard = new Keyboard();

export default keyboard;
