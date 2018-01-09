/* @flow */
import check from 'check-types';

import { Results, List } from 'realm';

import DeviceInfo from 'react-native-device-info';

import time from 'app/time/utils';

import trackersDB from './realm/trackers';

import ticksDB from './realm/ticks';

import appInfo from './realm/appInfo';

import { TrackerType } from './consts';

const tickSchemas = {
  distance: 'DistData',
};

class Depot {
  trackers = trackersDB;

  ticks = ticksDB;

  appInfo = appInfo;

  async getTracker(trackId: number) {
    check.assert.number(trackId);

    const tracker = this.trackers.getOne(trackId);
    if (!tracker) throw new Error('Tracker not found');

    const ticks = this.getTrackerTicks(tracker, time.getDateMs());
    return { ...tracker, ticks };
  }

  async loadTrackers() {
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
    return this.trackers.add(tracker);
  }

  async addTrackerAt(tracker: Tracker, index: number) {
    return this.trackers.addAt(tracker, index);
  }

  async updateTracker(tracker: Tracker) {
    return this.trackers.update(tracker);
  }

  async removeTracker(trackId: number) {
    this.ticks.removeForTracker(trackId);
    return this.trackers.remove(trackId);
  }

  async addTick(
    trackId: number, dateTimeMs: number,
    value?: number, data?: Object,
  ) {
    check.assert.number(trackId);
    check.assert.number(dateTimeMs);

    const tracker = this.trackers.getOne(trackId);
    const tick = this.ticks.add({
      trackId,
      dateTimeMs,
      value,
    });

    if (data) {
      const schema = tickSchemas[tracker.typeId];
      this.ticks.addData(schema, tick, data);
    }

    return this.convertTick(tracker, tick);
  }

  async undoLastTick(trackId: number) {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);
    return tick ? this.ticks.remove(tick.id) : false;
  }

  async updateLastTick(trackId: number, value?: number, data?: Object) {
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
      return this.loadTrackers();
    }

    const trackers = this.genTestTrackers();
    this.setTestTrackers(trackers);

    return trackers;
  }

  getTicksFromTo(trackId: number, minDateMs: number, maxDateMs?: number) {
    return this.ticks.getForPeriod(trackId, minDateMs, maxDateMs);
  }

  getTicksWithData(
    schema: string,
    trackId: number,
    minDateMs: number,
    maxDateMs?: number,
  ) {
    check.assert.string(schema);

    const ticks = this.ticks.getForPeriod(trackId, minDateMs, maxDateMs);
    return ticks.map((tick) => {
      const data = this.ticks.getData(schema, tick.id);
      return { ...tick, data };
    });
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
      for (const tracker of trackers) {
        this.trackers.remove(tracker.id);
      }
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
    if (tracker.typeId === 'distance') {
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

export default new Depot();
