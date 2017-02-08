 /* @flow */

'use strict';

import trackers from './realm/trackers';

import ticks from './realm/ticks';

import appInfo from './realm/appInfo';

import {TrackerType} from './consts';

import DeviceInfo from 'react-native-device-info';

class Depot {
  trackers: ITrackersDepot = trackers;
  ticks: ITicksDepot = ticks;
  appInfo = appInfo;

  addTracker(tracker: Tracker): Tracker {
    return this.trackers.add(tracker);
  }

  addTrackerAt(tracker: Tracker, index: number): Tracker {
    return this.trackers.addAt(tracker, index);
  }

  addTick(trackId: number,
          dateTimeMs: number,
          value?: number): Tick {
    check.assert.number(trackId);
    check.assert.number(dateTimeMs);

    return this.ticks.add({
      trackId: trackId,
      dateTimeMs: dateTimeMs,
      value: value
    });
  }

  updateTracker(tracker: Tracker): boolean {
    return this.trackers.update(tracker);
  }

  removeTracker(trackId: number): boolean {
    this.trackers.remove(trackId);
    this.ticks.removeForTracker(trackId);
    return true;
  }

  undoLastTick(trackId: number) {
    let tick = depot.ticks.getLast(trackId);
    if (tick) {
      return depot.ticks.remove(tick.id);
    }
    return false;
  }

  updLastTick(trackId: number, value?: number) {
    let tick = depot.ticks.getLast(trackId);
    this.ticks.update(tick.id, value);
    return tick;
  }

  loadTestData() {
    this._resetTestData();

    if (this._hasTestData()) {
      return this.trackers.getAll();
    };

    let trackers = this._genTestTrackers();
    this._setTestTrackers(trackers);

    return trackers;
  }

  _genTestTrackers() {
    let trackers = [];
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
    let savedVer = this.appInfo.getVer();
    let appVer = DeviceInfo.getVersion();
    if (savedVer != appVer) {
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
    let trackers = this._getTestTrackers();
    return !!trackers.length;
  }

  _setTestTrackers(trackers) {
    this.appInfo.setTestTrackers(trackers);
  }

  _getTestTrackers() {
    return this.appInfo.getTestTrackers();
  }
};

module.exports = new Depot();
