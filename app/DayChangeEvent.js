import EventEmitter from 'eventemitter3';
import { AppState, InteractionManager } from 'react-native';

import time from 'app/time/utils';
import Timeout from 'app/time/Timeout';

export class DayChangeEvent extends EventEmitter {
  downDateMs: number;

  dayTimeout: Timeout;

  constructor() {
    super();
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
}

export default new DayChangeEvent();
