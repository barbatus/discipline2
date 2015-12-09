'use strict';

const Tracker = require('./Tracker');

class Trackers {
  static async getAll() {
    let trackers = await depot.trackers.getAll();
    return trackers.map(trackDoc => {
      return new Tracker(trackDoc);
    });
  }

  static async getOne(trackId) {
    let trackDoc = await depot.trackers.getOne(trackId);
    return new Tracker(trackDoc);
  }

  static async addAt(tracker, index) {
    let trackId = await depot.trackers.addAt(tracker, index);
    return await Trackers.getOne(trackId);
  }

  static async remove(tracker) {
    return await depot.trackers.remove(tracker._id);
  }

  static create({ title, typeId, iconId }) {
    
  }
}

module.exports = Trackers;
