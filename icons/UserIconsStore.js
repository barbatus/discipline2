import UserIcons from './userIcons';

import { IconSize } from './consts';

export class UserIcon {
  constructor(iconEnum) {
    this.enum = iconEnum;
  }

  get id() {
    return this.enum.valueOf();
  }

  get png() {
    return this.enum[IconSize.NORMAL];
  }

  get pngLarge() {
    return this.enum[IconSize.NORMAL];
  }
}

export default class UserIconsStore {
  static get(iconId): UserIcon {
    const icon = UserIcons.fromValue(iconId);
    if (icon) {
      return new UserIcon(icon);
    }
    return null;
  }

  static getAll(): Array<UserIcon> {
    return UserIcons.symbols().map((icon) => new UserIcon(icon));
  }
}
