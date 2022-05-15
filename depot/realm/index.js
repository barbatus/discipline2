/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */

import check from 'check-types';
import { List } from 'realm';
import EventEmitter from 'eventemitter3';
import DeviceInfo from 'react-native-device-info';

import time from 'app/time/utils';

import { TrackerType, DepotEvent } from '../consts';
import { Tracker, Tick } from '../interfaces';
import trackersDB from './trackers';
import ticksDB from './ticks';
import appInfo from './appInfo';

const tickSchemas = {
  distance: 'DistData',
};

export default class Depot {
  event = new EventEmitter();

  trackers = trackersDB;

  ticks = ticksDB;

  appInfo = appInfo;

  async getTracker(trackId: number) {
    check.assert.number(trackId);

    const tracker = this.trackers.getOne(trackId);
    if (!tracker) {throw new Error('Tracker not found');}

    const ticks = this.getTrackerTicks(tracker, time.getDateMs());
    return { ...tracker, ticks };
  }

  async getTrackers() {
    const trackers = this.trackers.getAll();
    return trackers.map((tracker) => {
      const ticks = this.getTrackerTicks(tracker, time.getDateMs());
      return {
        ...tracker,
        ticks,
      };
    });
  }

  async addTracker(tracker: Tracker) {
    const newTracker = this.trackers.add(tracker);
    this.event.emit(DepotEvent.TRACK_ADDED, {
      trackId: newTracker.id,
    });
    return newTracker;
  }

  async addTrackerAt(tracker: Tracker, index: number) {
    return this.trackers.addAt(tracker, index);
  }

  async updateTracker(tracker: Tracker) {
    const updTracker = this.trackers.update(tracker);
    if (!updTracker) {throw new Error('Tracker no found');}

    this.event.emit(DepotEvent.TRACK_UPDATED, {
      trackId: updTracker.id,
    });
    return updTracker;
  }

  async removeTracker(trackId: number) {
    const removed = this.trackers.remove(trackId);
    if (!removed) {throw new Error('Tracker no found');}

    this.event.emit(DepotEvent.TRACK_REMOVED, { trackId });
    const ids = this.ticks.removeForTracker(trackId);
    if (ids.length) {
      this.event.emit(DepotEvent.TICKS_REMOVED, { tickIds: ids, trackId });
    }
  }

  async addTick(
    trackId: number, createdAt: number,
    value?: number, data?: Object,
  ) {
    check.assert.number(trackId);
    check.assert.number(createdAt);

    const tracker = this.trackers.getOne(trackId);
    if (!tracker) {throw new Error('Tracker not found');}

    const tick = this.ticks.add({ trackId, createdAt, value });

    if (data) {
      const schema = tickSchemas[tracker.typeId];
      this.ticks.addData(schema, tick, data);
    }

    this.event.emit(DepotEvent.TICK_ADDED, {
      tickId: tick.id,
      trackId,
    });

    return this.convertTick(tracker, tick);
  }

  async undoLastTick(trackId: number) {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);
    if (!tick) {throw new Error('Last tick not found');}

    this.ticks.remove(tick.id);
    this.event.emit(DepotEvent.TICKS_REMOVED, { tickIds: [tick.id], trackId });
  }

  async updateLastTick(trackId: number, value: number, data?: Object) {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);
    const tracker = this.trackers.getOne(trackId);
    if (data) {
      const schema = tickSchemas[tracker.typeId];
      this.ticks.updateData(schema, tick.id, data);
    }
    return this.convertTick(tracker, this.ticks.update(tick.id, value));
  }

  async getTicks(trackId: number, minDateMs: number, maxDateMs?: number) {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    const tracker = this.trackers.getOne(trackId);
    return this.getTrackerTicks(tracker, minDateMs, maxDateMs);
  }

  async loadTestData() {
    this.resetTestData();

    if (this.hasTestData()) {
      return this.getTrackers();
    }

    const trackers = this.genTestTrackers();
    this.setTestTrackers(trackers);

    return trackers;
  }

  getTicksFromTo(trackId: number, minDateMs: number, maxDateMs?: number) {
    return this.ticks.getForPeriod(trackId, minDateMs, maxDateMs);
  }

  genTestTrackers() {
    const trackers = [];
    let tracker = this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'trainers',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Cup of Coffee',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'coffee',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Spent on Food',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'pizza',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Books read',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'book_shelf',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Spent on Lunch',
      typeId: TrackerType.SUM.valueOf(),
      iconId: 'pizza',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Reading time',
      typeId: TrackerType.STOPWATCH.valueOf(),
      iconId: 'reading',
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.DISTANCE.valueOf(),
      iconId: 'trainers',
    });
    trackers.push(tracker);

    return trackers;
  }

  resetTestData() {
    const savedVer = this.appInfo.getVer();
    const appVer = DeviceInfo.getVersion();
    if (savedVer !== appVer) {
      let trackers = this.getTestTrackers();
      if (!trackers.length) {
        trackers = this.trackers.getAll();
      }
      trackers.forEach((tracker) => this.trackers.remove(tracker.id));
      this.appInfo.setVer(appVer);
    }
  }

  hasTestData() {
    const trackers = this.getTestTrackers();
    return !!trackers.length;
  }

  setTestTrackers(trackers) {
    this.appInfo.setTestTrackers(trackers);
  }

  getTestTrackers() {
    return this.appInfo.getTestTrackers();
  }

  getTrackerTicks(tracker: Tracker, minDateMs: number, maxDateMs?: number) {
    const ticks = this.getTicksFromTo(tracker.id, minDateMs, maxDateMs);
    return ticks.map((tick) => this.convertTick(tracker, tick));
  }

  convertTick(tracker: Tracker, tick: Tick) {
    if (tracker.typeId === TrackerType.DISTANCE.valueOf()) {
      const dist = this.stripRealm(tick.dist[0]);
      return { ...tick, ...dist };
    }
    return tick;
  }

  stripRealm(obj: Object) {
    const result = {};
    Object.keys(obj).forEach((prop) => {
      if (obj[prop] instanceof List) {
        result[prop] = obj[prop].slice();
        return;
      }
      result[prop] = obj[prop];
    });
    return result;
  }
}
