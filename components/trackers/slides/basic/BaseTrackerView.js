'use strict';

import React, {Component} from 'react';

import {
  View,
  Animated,
} from 'react-native';

import UserIconsStore from '../../../../icons/UserIconsStore';

export default class BaseTrackerView extends Component {
  getMainIcon(iconId) {
    const userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
  }
};
