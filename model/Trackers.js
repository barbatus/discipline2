import { TrackerType } from '../depot/consts';
import { NewTracker } from '../depot/interfaces';
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

  static add(tracker: Tracker) {
    const trackDoc = depot.addTracker(tracker);
    return this.create(trackDoc);
  }

  static addAt(tracker: Tracker, index) {
    const trackDoc = depot.addTrackerAt(tracker, index);
    return this.create(trackDoc);
  }

  static remove(tracker: Tracker) {
    return depot.removeTracker(tracker.id);
  }

  static create(tracker: NewTracker) {
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
