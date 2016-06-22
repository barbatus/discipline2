'use strict';

import AppIconsStore from './AppIconsStore';

import UserIconsStore from './UserIconsStore';

export default function getIcon(iconId) {
  let icon = AppIconsStore.get(iconId);
  if (icon) return icon;

  return UserIconsStore.get(iconId);
};
