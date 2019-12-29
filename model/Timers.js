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

  constructor(trackerId: string, initValueMs?: number, intervalMs?: number) {
    super(initValueMs, intervalMs);
    this.trackerId = trackerId;
  }

  start(startFromMs: number): boolean {
    if (this.active || this.timeMs >= TIME_LIMIT_MS) return;

    super.start(startFromMs);
    this.on(this.onTimeChange, this);
    return true;
  }

  async restart() {
    if (this.active) return;

    const lastTick = await depot.getLastTick(this.trackerId);
    const diff = Date.now() - lastTick.createdAt;
    // New last tick value
    const newLastTickMs = Math.min(Math.max(lastTick.value, diff), TIME_LIMIT_MS);
    this.saveTimerUpdate(newLastTickMs);
    const allTimePassed = this.timeMs - lastTick.value + newLastTickMs;
    if (allTimePassed < TIME_LIMIT_MS) {
      this.timeMs = this.timeMs - lastTick.value;
      this.start(newLastTickMs);
    }
  }

  stop() {
    if (!this.active) return;

    super.stop();
    this.off(this.onTimeChange, this);
  }

  async onTimeChange(timeMs: number, lastTickMs: number) {
    await this.saveTimerUpdate(lastTickMs);
    if (timeMs >= TIME_LIMIT_MS) {
      this.stop();
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
