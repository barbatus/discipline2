 /* @flow */

'use strict';

import trackers from './realm/trackers';

import ticks from './realm/ticks';

import {TrackerType} from './consts';

class Depot {
  trackers: ITrackersDepot = trackers;
  ticks: ITicksDepot = ticks;

  initTestData() {
    this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.COUNTER.valueOf(),
      iconId: 'trainers'
    });
    this.trackers.add({
      title: 'Cup of Coffee',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'coffee'
    });
    this.trackers.add({
      title: 'Spent on Food',
      typeId: TrackerType.GOAL.valueOf(),
      iconId: 'pizza'
    });
    this.trackers.add({
      title: 'Books read',
      typeId: TrackerType.COUNTER.valueOf(), 
      iconId: 'book_shelf'
    });
    this.trackers.add({
      title: 'Spent on Lunch',
      typeId: TrackerType.SUM.valueOf(), 
      iconId: 'pizza'
    });
    this.trackers.add({
      title: 'Reading time',
      typeId: TrackerType.STOPWATCH.valueOf(), 
      iconId: 'reading'
    });
    this.trackers.add({
      title: 'Morning Run',
      typeId: TrackerType.DISTANCE.valueOf(), 
      iconId: 'trainers'
    });
  }

  hasTestData() {
    return this.trackers.count();
  }
};

module.exports = new Depot();
