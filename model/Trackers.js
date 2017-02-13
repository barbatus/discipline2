'use strict';

import Tracker, {DistanceTracker} from './Tracker';

import {TrackerType} from '../depot/consts';

export default class Trackers {
  static getAll() {
    const trackers = depot.loadTrackers();
    return trackers.map(trackDoc => {
      return this.create(trackDoc);
    });
  }

  static getOne(trackId: number) {
    const trackDoc = depot.getTracker(trackId);
    return this.create(trackDoc);
  }

  static add(tracker) {
    const trackDoc = depot.addTracker(tracker);
    return this.create(trackDoc);
  }

  static addAt(tracker, index) {
    const trackDoc = depot.addTrackerAt(tracker, index);
    return this.create(trackDoc);
  }

  static remove(tracker) {
    return depot.removeTracker(tracker.id);
  }

  static create(tracker) {
    const type = tracker.typeId;
    switch (type) {
      case TrackerType.DISTANCE.valueOf():
        return new DistanceTracker(tracker);
      default:
        return new Tracker(tracker);
    }
  }
}
