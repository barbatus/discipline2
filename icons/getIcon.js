import AppIconsStore from './AppIconsStore';

import UserIconsStore from './UserIconsStore';

export default function getIcon(iconId) {
  const icon = AppIconsStore.get(iconId);
  if (icon) return icon;

  return UserIconsStore.get(iconId);
}
