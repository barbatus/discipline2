'use strict';

const AppIconsStore = require('./AppIconsStore');

const UserIconsStore = require('./UserIconsStore');

const { IconSize } = require('./consts');

function getIcon(iconId) {
  let icon = AppIconsStore.get(iconId);
  if (icon) return icon;

  return UserIconsStore.get(iconId);
}

module.exports = {
  getIcon,
  IconSize
};
