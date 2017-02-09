'use strict';

import Tracker from './Tracker';

import {TrackerType} from '../depot/consts';

import DistanceTracker from './DistanceTracker';

export default class Trackers {
  static getAll() {
    let trackers = depot.trackers.getAll();
    return trackers.map(trackDoc => {
      return this.create(trackDoc);
    });
  }

  static getOne(trackId) {
    let trackDoc = depot.trackers.getOne(trackId);
    return this.create(trackDoc);
  }

  static add(tracker) {
    let trackDoc = depot.trackers.add(tracker);
    return this.create(trackDoc);
  }

  static addAt(tracker, index) {
    let trackDoc = depot.trackers.addAt(tracker, index);
    return this.create(trackDoc);
  }

  static remove(tracker) {
    return depot.trackers.remove(tracker.id);
  }

  static create(tracker) {
    let type = tracker.typeId;
    switch (type) {
      case TrackerType.DISTANCE.valueOf():
        return new DistanceTracker(tracker);
      default:
        return new Tracker(tracker);
    }
  }
}
