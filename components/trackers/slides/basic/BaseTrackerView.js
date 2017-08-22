'use strict';

import React, { PureComponent } from 'react';

import { View, Animated } from 'react-native';

import { getIcon, UserIconsStore } from '../../../../icons/icons';

export default class BaseTrackerView extends PureComponent {
  getMainIcon(iconId) {
    const userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
  }
}
