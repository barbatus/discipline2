 /* @flow */

'use strict';

import trackers from './realm/trackers';

import ticks from './realm/ticks';

import appInfo from './realm/appInfo';

import {TrackerType} from './consts';

import DeviceInfo from 'react-native-device-info';

const tickSchemas = {
  distance: 'DistData',
};

class Depot {
  trackers: ITrackersDepot = trackers;
  ticks: ITicksDepot = ticks;
  appInfo = appInfo;

  getTracker(trackId: number): Promise<Tracker> {
    check.assert.number(trackId);

    const tracker = this.trackers.getOne(trackId);
    if (!tracker) return Promise.reject();

    const schema = tickSchemas[tracker.typeId];
    if (schema) {
      const ticks = this._getTicksWithData(
        schema, trackId, time.getDateMs());
      return Promise.resolve({
        ...tracker,
        ticks,
      });
    }

    const ticks = this._getTicks(trackId, time.getDateMs());
    return Promise.resolve({
      ...tracker,
      ticks,
    });
  }

  loadTrackers(): Promise<Array<Tracker>> {
    const trackers = this.trackers.getAll();
    return Promise.resolve(
      trackers.map(tracker => {
        const trackId = tracker.id;
        const schema = tickSchemas[tracker.typeId];
        const ticks = schema ?
          this._getTicksWithData(schema, trackId, time.getDateMs()) :
          this._getTicks(trackId, time.getDateMs());
        return {
          ...tracker,
          ticks,
        };
      })
    );
  }

  addTracker(tracker: Tracker): Promise<Tracker> {
    return Promise.resolve(this.trackers.add(tracker));
  }

  addTrackerAt(tracker: Tracker, index: number): Promise<Tracker> {
    return Promise.resolve(this.trackers.addAt(tracker, index));
  }

  updateTracker(tracker: Tracker): Promise<boolean> {
    return Promise.resolve(this.trackers.update(tracker));
  }

  removeTracker(trackId: number): Promise<boolean> {
    this.ticks.removeForTracker(trackId);
    return Promise.resolve(this.trackers.remove(trackId));
  }

  addTick(trackId: number, dateTimeMs: number,
          value?: number, data?: Object): Promise<Tick> {
    check.assert.number(trackId);
    check.assert.number(dateTimeMs);

    if (data) {
      const tracker = this.trackers.getOne(trackId);
      const schema = tickSchemas[tracker.typeId];
      this.ticks.addData(schema, data);
    }

    const tick = this.ticks.add({
      trackId: trackId,
      dateTimeMs: dateTimeMs,
      value: value,
    });
    return Promise.resolve(tick);
  }

  undoLastTick(trackId: number): Promise<boolean> {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);
    if (tick) {
      return Promise.resolve(this.ticks.remove(tick.id));
    }
    return Promise.resolve(false);
  }

  updateLastTick(trackId: number,
                 value?: number,
                 data?: Object): Promise<Tick> {
    check.assert.number(trackId);

    const tick = this.ticks.getLast(trackId);

    if (data) {
      const tracker = this.trackers.getOne(trackId);
      const schema = tickSchemas[tracker.typeId];
      this.ticks.updateData(schema, tick.id, data);
    }

    return Promise.resolve(this.ticks.update(tick.id, value));
  }

  getTicks(trackId: number,
           minDateMs: number,
           maxDateMs?: number): Promise<Array<Tick>> {
    check.assert.number(trackId);
    check.assert.number(minDateMs);

    const tracker = this.trackers.getOne(trackId);
    const schema = tickSchemas[tracker.typeId];
    if (schema) {
      const ticks = this._getTicksWithData(schema, trackId,
        minDateMs, maxDateMs);
      return Promise.resolve(ticks);
    }

    const ticks = this._getTicks(trackId, minDateMs, maxDateMs);
    return Promise.resolve(ticks);
  }

  loadTestData(): Promise<Array<Tracker>> {
    this._resetTestData();

    if (this._hasTestData()) {
      return this.loadTrackers();
    };

    const trackers = this._genTestTrackers();
    this._setTestTrackers(trackers);

    return Promise.resolve(trackers);
  }

  _getTicks(trackId: number,
            minDateMs: number,
            maxDateMs?: number): Array<Tick> {
    return this.ticks.getForPeriod(
      trackId, minDateMs, maxDateMs);
  }

  _getTicksWithData(schema: string,
                    trackId: number,
                    minDateMs: number,
                    maxDateMs?: number): Array<Tick> {
    check.assert.string(schema);

    const ticks = this.ticks.getForPeriod(
      trackId, minDateMs, maxDateMs);
    return ticks.map(tick => {
      const data = this.ticks.getData(schema, tick.id);
      return {
        ...tick,
        data,
      };
    });
  }

  _genTestTrackers() {
    const trackers = [];
    let tracker = this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'trainers'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Cup of Coffee',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'coffee'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Spent on Food',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'pizza'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Books read',
      typeId: TrackerType.COUNTER.valueOf(), 
      iconId: 'book_shelf'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Spent on Lunch',
      typeId: TrackerType.SUM.valueOf(), 
      iconId: 'pizza'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Reading time',
      typeId: TrackerType.STOPWATCH.valueOf(), 
      iconId: 'reading'
    });
    trackers.push(tracker);

    tracker = this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.DISTANCE.valueOf(), 
      iconId: 'trainers'
    });
    trackers.push(tracker);

    return trackers;
  }

  _resetTestData() {
    const savedVer = this.appInfo.getVer();
    const appVer = DeviceInfo.getVersion();
    if (savedVer !== appVer) {
      let trackers = this._getTestTrackers();
      if (!trackers.length) {
        trackers = this.trackers.getAll();
      }
      for (let tracker of trackers) {
        this.trackers.remove(tracker.id);
      }
      this.appInfo.setVer(appVer);
    }
  }

  _hasTestData() {
    const trackers = this._getTestTrackers();
    return !!trackers.length;
  }

  _setTestTrackers(trackers) {
    this.appInfo.setTestTrackers(trackers);
  }

  _getTestTrackers() {
    return this.appInfo.getTestTrackers();
  }
};

const depot = new Depot();
export default depot;

