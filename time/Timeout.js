import { AppState } from 'react-native';

import assert from 'assert';
import EventEmitter from 'eventemitter3';

import time from './utils';

class Timeout extends EventEmitter {
  waitMs: number;

  timeout: number;

  startTimeMs: number;

  paused = false;

  constructor(waitMs: number = 0) {
    super();
    this.waitMs = waitMs;
    this.onAppStateChange = ::this.onAppStateChange;
    AppState.addEventListener('change', this.onAppStateChange);
    this.start();
  }

  get active() {
    return !!this.timeout;
  }

  restart(leftMs: number) {
    this.stop();

    this.waitMs = leftMs;
    this.start();
  }

  start(): boolean {
    if (this.active) {return false;}

    this.startTimeMs = Date.now();
    this.timeout = setTimeout(() => {
      this.emit('tick');
      this.stop();
    }, this.waitMs);
    return true;
  }

  stop() {
    if (!this.active) {return;}

    clearTimeout(this.timeout);
    this.timeout = null;
  }

  on(cb: Function, context: any) {
    super.on('tick', cb, context);
  }

  off(cb: Function, context: any) {
    super.off('tick', cb, context);
  }

  onAppStateChange(appState: 'inactive' | 'active') {
    if (appState === 'inactive' && this.active) {
      this.stop();
      this.paused = true;
    }

    if (appState === 'active' && this.paused) {
      this.paused = false;

      if (Date.now() >= this.startTimeMs + this.waitMs) {
        this.emit('tick');
      } else {
        this.restart(this.startTimeMs + this.waitMs - Date.now());
      }
    }
  }

  dispose() {
    this.stop();
    this.removeAllListeners('tick');
    AppState.removeEventListener('change', this.onAppStateChange);
  }
}

export default Timeout;
