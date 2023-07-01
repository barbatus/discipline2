import { Keyboard as KeyboardRN, TextInput } from 'react-native';

import EventEmitter from 'eventemitter3';

const { State: TextInputState } = TextInput;

export class Keyboard {
  events: EventEmitter = new EventEmitter();

  constructor() {
    this.keyboardWillHide = ::this.keyboardWillHide;
    KeyboardRN.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  dispose() {
    KeyboardRN.removeListener('keyboardWillHide', this.keyboardWillHide);
  }

  dismiss() {
    KeyboardRN.dismiss();
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
