/* @flow */

import check from 'check-types';
import EventEmitter from 'eventemitter3';
import DeviceInfo from 'react-native-device-info';

import time from 'app/time/utils';

import { type PlainTick, Tracker, NewTracker, type AppProps } from '../interfaces';
import trackersDB from './trackers';
import ticksDB from './ticks';
import appDB from './app';

import { DepotEvent } from '../consts';

export default class Depot {
  event = new EventEmitter();

  async initApp() {
    const app = await appDB.get();
    if (!app) {
      const appVer = DeviceInfo.getVersion();
      return appDB.create(appVer, { alerts: false, metric: true, copilot: {} });
    }
    const trackers = await this.loadTrackers(app.trackers);
    return { ...app, trackers };
  }

  async loadApp() {
    return this.initApp();
  }

  async updateAppProps(props: AppProps) {
    const app = await appDB.getRaw();
    const newProps = { ...app.props, ...props };
    return appDB.update({ ...app, props: newProps });
  }

  async addTracker(tracker: NewTracker) {
    const newTracker = await appDB.addTracker(tracker);
    this.event.emit(DepotEvent.TRACK_ADDED, {
      trackId: newTracker.id,
    });
    return newTracker;
  }

  async addTrackerAt(tracker: NewTracker, index: number) {
    const newTracker = await appDB.addTracker(tracker, index);
    this.event.emit(DepotEvent.TRACK_ADDED, {
      trackId: newTracker.id,
    });
    return newTracker;
  }

  async loadTrackers(trackers: Tracker[]): Promise<Tracker[]> {
    const allTicks = await Promise.all(trackers.map((tracker) => (
      this.getTrackerTicks(tracker.id, time.getDateMs())
    )));
    return trackers.map((tracker, index) => Object.assign(tracker, {
      ticks: allTicks[index],
      active: false,
    }));
  }

  async getTracker(trackId: string) {
    check.assert.string(trackId);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const ticks = await this.getTrackerTicks(tracker.id, time.getDateMs());
    return { ...tracker, ticks };
  }

  async getRawTracker(trackId: string) {
    check.assert.string(trackId);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    return tracker;
  }

  async updateTracker(tracker: Tracker) {
    const updTracker = await trackersDB.update(tracker);
    if (!updTracker) throw new Error('No tracker found');

    this.event.emit(DepotEvent.TRACK_UPDATED, {
      trackId: updTracker.id,
    });
    return updTracker;
  }

  async removeTracker(trackId: string) {
    check.assert.string(trackId);

    const removed = appDB.removeTracker(trackId);
    if (!removed) throw new Error('Tracker no found');

    this.event.emit(DepotEvent.TRACK_REMOVED, { trackId });
    const ids = await ticksDB.removeForTracker(trackId);
    if (ids.length) {
      this.event.emit(DepotEvent.TICKS_REMOVED, { ids, trackId });
    }
  }

  async getTicks(trackId: string, minDateMs: number, maxDateMs?: number) {
    check.assert.string(trackId);
    check.assert.number(minDateMs);

    return this.getTrackerTicks(trackId, minDateMs, maxDateMs);
  }

  async addTick(
    trackId: string, dateTimeMs: number,
    value?: number, data?: Object,
  ) {
    check.assert.string(trackId);
    check.assert.number(dateTimeMs);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const newTick = await ticksDB.add({ tracker, dateTimeMs, value }, data);
    this.event.emit(DepotEvent.TICK_ADDED, { tickId: newTick.id, trackId: tracker.id });
    return ticksDB.plainTick(newTick);
  }

  async undoLastTick(trackId: string) {
    check.assert.string(trackId);

    const tick = await ticksDB.getLast(trackId);
    if (!tick) throw new Error('Last tick not found');

    await ticksDB.remove(tick.id);
    this.event.emit(DepotEvent.TICKS_REMOVED, { tickIds: [tick.id], trackId });
  }

  async updateLastTick(trackId: string, value: number, data?: Object) {
    check.assert.string(trackId);

    let tick = await ticksDB.getLast(trackId);
    if (!tick) throw new Error('Last tick not found');

    const tracker = await trackersDB.getOne(trackId);
    const updTick = { ...tick, tracker };
    tick = await ticksDB.update(updTick, value, data);
    this.event.emit(DepotEvent.TICK_UPDATED, { tickId: tick.id, trackId });
    return ticksDB.plainTick(tick);
  }

  async updateLastTickData(trackId: string, data: Object) {
    check.assert.string(trackId);

    const tick = await ticksDB.getLast(trackId);
    if (!tick) throw new Error('Last tick not found');

    return this.updateLastTick(trackId, tick.value, data);
  }

  async getLastTick(trackId: string) {
    check.assert.number(trackId);

    const tick = await ticksDB.getLast(trackId);
    return ticksDB.plainTick(tick);
  }

  async getTrackerTicks(trackId: string, minDateMs: number, maxDateMs?: number) {
    const ticks = await ticksDB.getForPeriod(trackId, minDateMs, maxDateMs);
    return ticks.map<PlainTick>((tick) => ticksDB.plainTick(tick));
  }

  async resetTestData() {
    const app = await appDB.getRaw();
    const appVer = DeviceInfo.getVersion();
    if (app.ver !== appVer) {
      const promises = app.trackers.map((tracker) => appDB.removeTracker(tracker));
      await Promise.all(promises);
      await appDB.setVer(appVer);
      return true;
    }
    return false;
  }

  async loadTestApp(testTrackers: NewTracker[]) {
    const app = await this.initApp();
    await this.resetTestData();

    if (await this.hasTestData()) { return app; }

    // TODO: check out why Promise.all not working
    const trackers = await Promise.all(
      testTrackers.map((tracker) => this.addTracker(tracker)),
    );
    await appDB.setTestTrackers(trackers);

    return appDB.get();
  }

  hasTestData() {
    return appDB.hasTestTrackers();
  }

  setTestTrackers(trackers: Tracker[]) {
    return appDB.setTestTrackers(trackers);
  }

  getTestTrackers() {
    return appDB.getTestTrackers();
  }
}
