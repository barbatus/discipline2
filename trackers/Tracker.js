'use strict';

const { TrackerType } = require('../depot/consts');

const UserIconsStore = require('../icons/UserIconsStore');

class Tracker {
  constructor(tracker) {
    this._id = tracker._id;
    this.title = tracker.title;
    this.iconId = tracker.iconId;
    this.typeId = tracker.typeId;
  }

  get type() {
    return TrackerType.fromValue(this.typeId);
  }

  set type(type) {
    this.typeId = type.valueOf();
  }

  get value() {
    return depot.trackers.getTodayValue(this._id);
  }

  get icon() {
    return UserIconsStore.get(this.iconId);
  }

  set icon(icon) {
    this.iconId = icon.id;
  }

  async getLastTick() {
    return await depot.trackers.getLastTick(this._id);
  }

  async getCount() {
    return await depot.trackers.getTodayCount(this._id);
  }

  async getChecked() {
    let count = await this.getCount();
    return count != 0;
  }

  async click(opt_value, opt_onResult) {
    if (_.isFunction(opt_value)) {
      opt_onResult = opt_value;
      opt_value = null;
    }
    let tickId = await this.addTick(opt_value);
    return tickId;
  }

  async save() {
    return await depot.trackers.update(this._id, {
      title: this.title,
      iconId: this.iconId
    });
  }

  async addTick(opt_value) {
    return await depot.trackers.addTick(this._id,
      time.getDateTimeMs(), opt_value);
  }

  async removeLastTick() {
    let tick = await this.getLastTick();
    await depot.ticks.remove(this._id, tick._id);
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
