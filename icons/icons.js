import AppIconsStore from './AppIconsStore';

import UserIconsStore from './UserIconsStore';

export { IconSize } from './consts';

export function getIcon(iconId) {
  const icon = AppIconsStore.get(iconId);
  if (icon) return icon;

  return UserIconsStore.get(iconId);
}

export { default as UserIconsStore } from './UserIconsStore';
