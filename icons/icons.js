'use strict';

import AppIconsStore from './AppIconsStore';

import UserIconsStore from './UserIconsStore';

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
