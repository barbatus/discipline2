import depot from 'app/depot/depot';
import Timer from 'app/time/Timer';

export class Timers {
  timers = {};

  getOrCreate(trackerId: number, initValueMs?: number, intervalMs?: number) {
    if (!this.timers[trackerId]) {
      this.timers[trackerId] = new Timer(initValueMs, intervalMs);
      this.timers[trackerId].events.on('onTimer', (timeMs: number, lastStartMs: number) =>
        this.onTimer(trackerId, lastStartMs));
    }
    return this.timers[trackerId];
  }

  onTimer(trackerId: number, lastStartMs: number) {
    depot.updateLastTick(trackerId, lastStartMs);
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
