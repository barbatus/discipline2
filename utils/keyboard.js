import { TextInput, DeviceEventEmitter } from 'react-native';

import EventEmitter from 'eventemitter3';

const { State: TextInputState } = TextInput;

export class Keyboard {
  events: EventEmitter = new EventEmitter();

  constructor() {
    DeviceEventEmitter.addListener(
      'keyboardWillHide',
      this.keyboardWillHide.bind(this),
    );
  }

  dismiss() {
    TextInputState.blurTextInput(
      TextInputState.currentlyFocusedField());
  }

  shown() {
    return !!TextInputState.currentlyFocusedField();
  }

  addHideListener(cb: Function) {
    this.events.on('willHide', cb);
  }

  removeHideListener(cb: Function) {
    this.events.removeListener('willHide', cb);
  }

  keyboardWillHide() {
    this.events.emit('willHide');
  }
}

export default new Keyboard();
