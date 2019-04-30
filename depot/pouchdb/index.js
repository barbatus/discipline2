/* @flow */

import check from 'check-types';
import EventEmitter from 'eventemitter3';
import DeviceInfo from 'react-native-device-info';

import time from 'app/time/utils';

import { App, type PlainTick, Tracker, NewTracker, type AppProps } from '../interfaces';
import { DepotEvent } from '../consts';

import trackersDB from './trackers';
import ticksDB from './ticks';
import notifsDB from './notifications';
import appDB from './app';

export default class Depot {
  event = new EventEmitter();

  async initApp(): Promise<App> {
    const app = await appDB.get();
    if (!app) {
      const appVer = DeviceInfo.getVersion();
      return appDB.create(appVer, { alerts: true, metric: true, copilot: {} });
    }
    const trackers = await this.getTrackers(app.trackers);
    return { ...app, trackers };
  }

  async loadApp() {
    return this.initApp();
  }

  async getRawApp() {
    return appDB.getRaw();
  }

  async getApp() {
    return appDB.get();
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

  async getTrackers(trackers: Tracker[]): Promise<Tracker[]> {
    const allTicks = await Promise.all(trackers.map((tracker) => {
      const fromTimeMs = tracker.active ? time.getYestMs() : time.getDateMs();
      return this.getTrackerTicks(tracker.id, fromTimeMs);
    }));
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

  async addTick(trackId: string, createdAt: number, value?: number, data?: Object) {
    check.assert.string(trackId);
    check.assert.number(createdAt);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const newTick = await ticksDB.add({ tracker, createdAt, value }, data);
    this.event.emit(DepotEvent.TICK_ADDED, { tickId: newTick.id, trackId: tracker.id });
    return ticksDB.plainTick(newTick);
  }

  async undoLastTick(trackId: string) {
    check.assert.string(trackId);

    const tick = await ticksDB.getLastOne(trackId);
    if (!tick) throw new Error('Last tick not found');

    await ticksDB.remove(tick.id);
    this.event.emit(DepotEvent.TICKS_REMOVED, { tickIds: [tick.id], trackId });
  }

  async updateLastTick(trackId: string, value: number, data?: Object) {
    check.assert.string(trackId);

    let tick = await ticksDB.getLastOne(trackId);
    if (!tick) throw new Error('Last tick not found');

    const tracker = await trackersDB.getOne(trackId);
    const updTick = { ...tick, tracker };
    tick = await ticksDB.update(updTick, value, data);
    this.event.emit(DepotEvent.TICK_UPDATED, { tickId: tick.id, trackId });
    return ticksDB.plainTick(tick);
  }

  async updateLastTickData(trackId: string, data: Object) {
    check.assert.string(trackId);

    const tick = await ticksDB.getLastOne(trackId);
    if (!tick) throw new Error('Last tick not found');

    return this.updateLastTick(trackId, tick.value, data);
  }

  async getLastTick(trackId: string) {
    check.assert.string(trackId);

    const tick = await ticksDB.getLastOne(trackId);
    return ticksDB.plainTick(tick);
  }

  async getTrackerTicks(trackId: string, minDateMs: number, maxDateMs?: number) {
    const ticks = await ticksDB.getForPeriod(trackId, minDateMs, maxDateMs);
    return ticks.map<PlainTick>((tick) => ticksDB.plainTick(tick));
  }

  async getLastTrackerTicks(trackId: string, limit: number) {
    const ticks = await ticksDB.getLastWithLimit(trackId, limit);
    return ticks.map<PlainTick>((tick) => ticksDB.plainTick(tick)).reverse();
  }

  async addNotif(trackId: string, createdAt: number) {
    check.assert.string(trackId);
    check.assert.number(createdAt);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const newNotif = await notifsDB.add({ tracker, createdAt });
    this.event.emit(DepotEvent.NOTIF_ADDED, { notificationId: newNotif.id, trackId: tracker.id });
    return newNotif;
  }

  async getLastNotif(trackId: string) {
    check.assert.string(trackId);

    return notifsDB.getLastOne(trackId);
  }

  async getTrackerNotifs(trackId: string, limit: number) {
    return notifsDB.getLastWithLimit(trackId, limit);
  }

  async resetTestData() {
    const app = await appDB.get();
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
