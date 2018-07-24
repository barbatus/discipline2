import { TrackerType } from '../depot/consts';
import { Tracker as DBTracker } from '../depot/interfaces';
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

  static create(tracker: DBTracker) {
    const type = tracker.typeId;
    switch (type) {
      case TrackerType.DISTANCE.valueOf():
        return new DistanceTracker(tracker);
      default:
        return new Tracker(tracker);
    }
  }

  static clone(tracker: Tracker, data?: any) {
    return Object.assign(Trackers.create(tracker), data);
  }

  static genTestTrackers() {
    const trackers = [];
    trackers.push(
      Tracker.defaultValues({
        title: 'Morning Run',
        typeId: TrackerType.COUNTER.valueOf(),
        iconId: 'trainers',
      }),
    );

    trackers.push(
      Tracker.defaultValues({
        title: 'Cup of Coffee',
        typeId: TrackerType.GOAL.valueOf(),
        iconId: 'coffee',
      }),
    );

    trackers.push(
      Tracker.defaultValues({
        title: 'Spent on Food',
        typeId: TrackerType.GOAL.valueOf(),
        iconId: 'pizza',
      }),
    );

    trackers.push(
      Tracker.defaultValues({
        title: 'Books read',
        typeId: TrackerType.COUNTER.valueOf(),
        iconId: 'book_shelf',
      }),
    );

    trackers.push(
      Tracker.defaultValues({
        title: 'Spent on Lunch',
        typeId: TrackerType.SUM.valueOf(),
        iconId: 'pizza',
      }),
    );

    trackers.push(
      Tracker.defaultValues({
        title: 'Reading time',
        typeId: TrackerType.STOPWATCH.valueOf(),
        iconId: 'reading',
      })
    );

    trackers.push(
      DistanceTracker.defaultValues({
        title: 'Morning Run',
        typeId: TrackerType.DISTANCE.valueOf(),
        iconId: 'trainers',
      }),
    );

    return trackers;
  }
}
