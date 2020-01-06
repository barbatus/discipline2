import EventEmitter from 'eventemitter3';
import { AppState } from 'react-native';

import time from 'app/time/utils';
import Timeout from 'app/time/Timeout';

export class DayChangeEvent extends EventEmitter {
  downDateMs: number;

  dayTimeout: Timeout;

  constructor() {
    super();
    this.onAppStateChange = this.onAppStateChange.bind(this);
    AppState.addEventListener('change', this.onAppStateChange);
    this.setDayTimeout();
  }

  on(callback) {
    super.on('change', callback);
  }

  off(callback) {
    super.off('change', callback);
  }

  dispose() {
    this.dayTimeout.dispose();
    this.dayTimeout = null;
    AppState.removeEventListener('change', this.onAppStateChange);
    this.removeAllListeners('change');
  }

  setDayTimeout() {
    const left = time.getToEndDayMs();

    if (this.dayTimeout) {
      this.dayTimeout.restart(left);
      return;
    }

    this.dayTimeout = new Timeout(left);
    this.dayTimeout.on(() => {
      this.emit('change');
      this.setDayTimeout();
    });
  }

  unsetDayTimer() {
    if (this.dayTimeout) {
      this.dayTimeout.stop();
    }
  }

  onAppStateChange(state) {
    if (state === 'background') {
      this.onAppBackground();
    }

    if (state === 'active') {
      this.onAppActive();
    }
  }

  onAppBackground() {
    this.downDateMs = Date.now();
  }

  onAppActive() {
    if (!this.downDateMs) return;

    const dateChanged = !time.isSameDate(Date.now(), this.downDateMs);
    if (dateChanged) {
      this.emit('change');
    }
    this.setDayTimeout();
  }
}

export default new DayChangeEvent();
