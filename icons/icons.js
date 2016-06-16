'use strict';

const AppIconsStore = require('./AppIconsStore');

const UserIconsStore = require('./UserIconsStore');

import { IconSize } from './consts';

function getIcon(iconId) {
  let icon = AppIconsStore.get(iconId);
  if (icon) return icon;

  return UserIconsStore.get(iconId);
}

module.exports = {
  getIcon,
  IconSize
};
