import depot from 'app/depot/depot';
import Interval from 'app/time/Interval';

import Trackers from './Trackers';

export class Timers {
  timers = {};

  async getOrCreate(trackerId: number, intervalMs?: number) {
    if (!this.timers[trackerId]) {
      const tracker = await Trackers.getOne(trackerId);
      this.timers[trackerId] = new Timer(trackerId, tracker.value, intervalMs);
    }
    return this.timers[trackerId];
  }

  dispose(trackerId: number) {
    if (this.timers[trackerId]) {
      this.timers[trackerId].dispose();
      delete this.timers[trackerId];
    }
  }
}

const timers = new Timers();
export default timers;

const TIME_LIMIT_MS = 24 * 60 * 60 * 1000; // 24h

export class Timer extends Interval {
  trackerId: string;

  tickTimeGetter = (tick) => tick.value;

  constructor(trackerId: string, initValueMs?: number, intervalMs?: number) {
    super(initValueMs, intervalMs);
    this.trackerId = trackerId;
  }

  start(baseTimeMs: number, lastTickMs: number): boolean {
    if (this.active || this.allTimeMs >= TIME_LIMIT_MS) return;

    super.start(baseTimeMs, lastTickMs);
    super.on(this.onTimeChange, this);
    return true;
  }

  async restart(baseTimeMs: number) {
    if (this.active) return;

    const lastTick = await depot.getLastTick(this.trackerId);
    const lastTickTimeMs = this.tickTimeGetter(lastTick);
    const diff = Date.now() - lastTick.createdAt;
    // New last tick value
    const newLastTickMs = Math.min(Math.max(lastTickTimeMs, diff), TIME_LIMIT_MS);
    this.saveTimerUpdate(newLastTickMs);
    const allTimePassed = baseTimeMs - lastTickTimeMs + newLastTickMs;
    if (allTimePassed < TIME_LIMIT_MS) {
      this.start(allTimePassed, newLastTickMs);
    }
  }

  stop() {
    if (!this.active) return;

    super.stop();
    super.off(this.onTimeChange, this);
  }

  on(cb: Function, onLimit: Function, context: any) {
    super.on(cb, context);
    super.addListener('stop', onLimit, context);
  }

  off(cb: Function, onLimit: Function, context: any) {
    super.off(cb, context);
    super.removeListener('stop', onLimit, context);
  }

  async onTimeChange(allTimeMs: number, lastTickMs: number) {
    await this.saveTimerUpdate(lastTickMs);
    if (allTimeMs >= TIME_LIMIT_MS) {
      this.stop();
      this.emit('stop');
    }
  }

  async saveTimerUpdate(lastTickMs: number) {
    try {
      await depot.updateLastTick(this.trackerId, lastTickMs);
    } catch (ex) {
      Logger.log(`Try to save Timer: ${ex.message}`);
    }
  }
}
