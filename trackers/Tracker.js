'use strict';

class Tracker {
  constructor(tracker) {
    this._id = tracker._id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.type = tracker.type;
  }

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
    return await Tracker.getOne(trackId);
  }

  get value() {
    return depot.trackers.getTodayValue(this._id);
  }

  get icon() {
    return getIcon(this.iconId);
  }

  get lastTick() {
    return depot.trackers.getLastTick(this._id);
  }

  async getCount() {
    return await depot.trackers.getTodayCount(this._id);
  }

  async getChecked() {
    var count = await this.getCount();
    return count != 0;
  }

  async click(opt_value, opt_onResult) {
    if (_.isFunction(opt_value)) {
      opt_onResult = opt_value;
      opt_value = null;
    }
    var tickId = await this.addTick(opt_value);
    return tickId;
  }

  async addTick(opt_value) {
    return await depot.trackers.addTick(this._id,
      time.getDateTimeMs(), opt_value);
  }

  async getTicks(startDateMs) {
    return await depot.trackers.getTicks(this._id, startDateMs);
  }

  async getDayTicks(dayMs) {
    return await depot.trackers.getDayTicks(this._id, dayMs);
  }

  async getTodayTicks() {
    return await depot.trackers.getTodayTicks(this._id);
  }
};

module.exports = Tracker;
