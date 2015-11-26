'use strict';

var BasicTracker = require('./BasicTracker');

class Trackers {
  static async getAll() {
    var trackers = await depot.trackers.get_all(function(trackDoc) {
      return new BasicTracker(trackDoc);
    });
    return trackers;
  }
}

module.exports = Trackers;
