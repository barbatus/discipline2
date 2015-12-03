'use strict';

const appIcons = require('./appIcons');

class AppIconsStore {
  static get(iconId) {
    return appIcons[iconId];
  }
}

module.exports = AppIconsStore;
