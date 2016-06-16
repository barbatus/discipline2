'use strict';

import TrackerDAO from './Tracker';

export default class Trackers {
  static getAll() {
    let trackers = depot.trackers.getAll();
    return trackers.map(trackDoc => {
      return new TrackerDAO(trackDoc);
    });
  }

  static getOne(trackId) {
    let trackDoc = depot.trackers.getOne(trackId);
    return new TrackerDAO(trackDoc);
  }

  static add(tracker) {
    let trackDoc = depot.trackers.add(tracker);
    return new TrackerDAO(trackDoc);
  }

  static addAt(tracker, index) {
    let trackDoc = depot.trackers.addAt(tracker, index);
    return new TrackerDAO(trackDoc);
  }

  static remove(tracker) {
    return depot.trackers.remove(tracker.id);
  }
}
