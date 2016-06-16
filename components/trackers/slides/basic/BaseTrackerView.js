'use strict';

import React, { Component } from 'react';

import {
  View,
  Animated
} from 'react-native';

import UserIconsStore from '../../../../icons/UserIconsStore';

class BaseTrackerView extends Component {
  constructor(props) {
    super(props);

    let { shown } = props;
    this._opacity = new Animated.Value(shown);
  }

  getMainIcon(iconId) {
    let userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
  }

  set opacity(opacity: Number) {
    this._opacity.setValue(opacity);
  }

  get opacity() {
    return this._opacity;
  }
}

module.exports = BaseTrackerView;
