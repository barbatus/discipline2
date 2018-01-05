/* @flow */

import DeviceInfo from 'react-native-device-info';

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

    const schema = tickSchemas[tracker.typeId];
    if (schema) {
      const ticks = this.getTicksWithData(
        schema, trackId, time.getDateMs());
      return { ...tracker, ticks };
    }

    const ticks = this.getTicksFromTo(trackId, time.getDateMs());
    return { ...tracker, ticks };
  }

  async loadTrackers() {
    const trackers = this.trackers.getAll();
    return trackers.map((tracker) => {
      const trackId = tracker.id;
      const schema = tickSchemas[tracker.typeId];
      const ticks = schema
        ? this.getTicksWithData(schema, trackId, time.getDateMs())
        : this.getTicksFromTo(trackId, time.getDateMs());
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

    if (data) {
      const tracker = this.trackers.getOne(trackId);
      const schema = tickSchemas[tracker.typeId];
      this.ticks.addData(schema, data);
    }

    return this.ticks.add({
      trackId,
      dateTimeMs,
      value,
    });
  }

  async undoLastTick(trackId: number) {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);
    return tick ? this.ticks.remove(tick.id) : false;
  }

  async updateLastTick(trackId: number, value?: number, data?: Object) {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);

    if (data) {
      const tracker = this.trackers.getOne(trackId);
      const schema = tickSchemas[tracker.typeId];
      this.ticks.updateData(schema, tick.id, data);
    }

    return this.ticks.update(tick.id, value);
  }

  async getTicks(trackId: number, minDateMs: number, maxDateMs?: number) {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    const tracker = this.trackers.getOne(trackId);
    const schema = tickSchemas[tracker.typeId];

    return schema
      ? this.getTicksWithData(schema, trackId, minDateMs, maxDateMs)
      : this.getTicksFromTo(trackId, minDateMs, maxDateMs);
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
}

export default new Depot();
