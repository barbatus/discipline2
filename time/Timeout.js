import assert from 'assert';
import EventEmitter from 'eventemitter3';

import time from './utils';

class Timeout extends EventEmitter {
  waitMs = 0;

  timeout: number;

  constructor(waitMs: number = 0) {
    super();
    this.waitMs = waitMs;
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
    if (this.active) return false;

    this.timeout = setTimeout(() => this.emit('tick'), this.waitMs);
    return true;
  }
  
  stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  on(cb: Function, context: any) {
    super.on('tick', cb, context);
  }

  off(cb: Function, context: any) {
    super.off('tick', cb, context);
  }

  dispose() {
    this.stop();
    this.removeAllListeners('tick');
  }
}

export default Timeout;

