import { TrackerType } from '../depot/consts';
import { DBTracker } from '../depot/interfaces';
import depot from '../depot/depot';

import Tracker, { DistanceTracker } from './Tracker';

export default class Trackers {
  static getAll() {
    const trackers = depot.loadTrackers();
    return trackers.map((trackDoc) => this.create(trackDoc));
  }

  static getOne(trackId: number) {
    const trackDoc = depot.getTracker(trackId);
    return this.create(trackDoc);
  }

  static add(tracker: DBTracker) {
    const trackDoc = depot.addTracker(tracker);
    return this.create(trackDoc);
  }

  static addAt(tracker: DBTracker, index) {
    const trackDoc = depot.addTrackerAt(tracker, index);
    return this.create(trackDoc);
  }

  static remove(tracker: DBTracker) {
    return depot.removeTracker(tracker.id);
  }

  static create(tracker: DBTracker) {
    const type = tracker.typeId;
    switch (type) {
      case TrackerType.DISTANCE.valueOf():
        return new DistanceTracker(tracker);
      default:
        return new Tracker(tracker);
    }
  }

  static clone(tracker: Tracker) {
    return tracker.clone();
  }
}
