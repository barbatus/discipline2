/* @flow */

import check from 'check-types';
import EventEmitter from 'eventemitter3';
import DeviceInfo from 'react-native-device-info';

import time from 'app/time/utils';

import { DBTracker } from '../interfaces';
import trackersDB from './trackers';
import ticksDB from './ticks';
import appDB from './app';

import { TrackerType, DepotEvent } from '../consts';

export default class Depot {
  event = new EventEmitter();

  async addTracker(tracker: DBTracker) {
    const newTracker = trackersDB.add(tracker);
    this.event.emit(DepotEvent.TRACK_ADDED, {
      trackId: newTracker.id,
    });
    return newTracker;
  }

  async addTrackerAt(tracker: DBTracker, index: number) {
    const newTracker = trackersDB.add(tracker, index);
    this.event.emit(DepotEvent.TRACK_ADDED, {
      trackId: newTracker.id,
    });
    return newTracker;
  }

  async getTrackers() {
    const trackers = await trackersDB.getAll();
    const allTicks = await Promise.all(trackers.map((tracker) =>
      this.getTrackerTicks(tracker, time.getDateMs())
    ));
    return trackers.map((tracker, index) => ({
      ...tracker,
      ticks: allTicks[index],
    }));
  }

  async getTracker(trackId: string) {
    check.assert.string(trackId);

    const tracker = await trackersDB.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const ticks = await this.getTrackerTicks(tracker, time.getDateMs());
    return { ...tracker, ticks };
  }

  async updateTracker(tracker: DBTracker) {
    const updTracker = await trackersDB.update(tracker);
    if (!updTracker) throw new Error('No tracker found');

    this.event.emit(DepotEvent.TRACK_UPDATED, {
      trackId: updTracker.id,
    });
    return updTracker;
  }

  async removeTracker(trackId: string) {
    check.assert.string(trackId);

    const removed = trackersDB.remove(trackId);
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

    return ticksDB.getForPeriod(trackId, minDateMs, maxDateMs);
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
    return newTick;
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
    tick = await ticksDB.update({ ...tick, tracker }, value, data);
    this.event.emit(DepotEvent.TICK_UPDATED, { tickId: tick.id, trackId });
    return tick;
  }

  async getTrackerTicks(tracker: DBTracker, minDateMs: number, maxDateMs?: number) {
    check.assert.number(minDateMs);
    const ticks = await ticksDB.getForPeriod(tracker.id, minDateMs, maxDateMs);
    return ticks.map((tick) => ticksDB.plainTick(tick));
  }

  async genTestTrackers() {
    const trackers = [];
    let tracker = await this.addTracker({
      title: 'Morning Run',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'trainers',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Cup of Coffee',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'coffee',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Spent on Food',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'pizza',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Books read',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'book_shelf',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Spent on Lunch',
      typeId: TrackerType.SUM.valueOf(),
      iconId: 'pizza',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Reading time',
      typeId: TrackerType.STOPWATCH.valueOf(),
      iconId: 'reading',
    });
    trackers.push(tracker);

    tracker = await this.addTracker({
      title: 'Morning Run',
      typeId: TrackerType.DISTANCE.valueOf(),
      iconId: 'trainers',
    });
    trackers.push(tracker);

    return trackers;
  }

  async resetTestData() {
    const savedVer = await appDB.getVer();
    const appVer = DeviceInfo.getVersion();
    if (savedVer !== appVer) {
      const trackers = await trackersDB.getAll();
      const promises = trackers.map((tracker) =>
        trackersDB.remove(tracker));
      await Promise.all(promises);
      await appDB.setVer(appVer);
    }
  }

  async loadTestData() {
    await this.resetTestData();

    if (await this.hasTestData()) {
      return this.getTrackers();
    }

    const trackers = await this.genTestTrackers();
    await appDB.setTestTrackers(trackers);

    return trackers;
  }

  hasTestData() {
    return appDB.hasTestTrackers();
  }

  setTestTrackers(trackers) {
    return appDB.setTestTrackers(trackers);
  }

  getTestTrackers() {
    return appDB.getTestTrackers();
  }
}
