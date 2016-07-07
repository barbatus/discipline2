'use strict';

import UserIcons from './userIcons';

import {IconSize} from './consts';

class UserIcon {
  constructor(iconEnum) {
    this._enum = iconEnum;
  }

  get id() {
    return this._enum.valueOf();
  }

  get png() {
    return this._enum[IconSize.NORMAL];
  }

  get pngLarge() {
    return this._enum[IconSize.NORMAL];
  }
};

export default class UserIconsStore {
  static get(iconId): UserIcon {
    let icon = UserIcons.fromValue(iconId);
    if (icon) {
      return new UserIcon(icon);
    }
    return null;
  }

  static getAll(): Array<UserIcon> {
    return UserIcons.symbols().map(
      icon => new UserIcon(icon));
  }
}
