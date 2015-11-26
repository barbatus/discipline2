'use strict';

class Tracker {
  constructor(tracker) {
    this._id = tracker._id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.type = tracker.type;
  }

  static async getAll() {
    var trackers = await depot.trackers.get_all(
      trackDoc => {
        return new Tracker(trackDoc);
      });
    return trackers;
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
