'use strict';

class BasicTracker {
  constructor(tracker) {
    this._id = tracker._id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.type = tracker.type;
  }

  async getCount() {
    return await depot.trackers.getTodayCount(this._id);
  }

  get value() {
    return depot.trackers.getTodayValue(this._id);
  }

  async getChecked() {
    var count = await this.getCount();
    return count != 0;
  }

  get icon() {
    return getIcon(this.iconId);
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

  get lastTick() {
    return depot.trackers.getLastTick(this._id);
  }
};

module.exports = Tracker;
