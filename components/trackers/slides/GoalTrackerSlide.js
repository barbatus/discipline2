'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration
} from 'react-native';

import {trackerStyles} from '../styles/trackerStyles';

import TrackerSlide from './TrackerSlide';

import {caller} from '../../../utils/lang';

export default class GoalTrackerSlide extends TrackerSlide {
  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity
          disabled={!editable}
          onPress={::this.onTick}>
          <Image
            source={getIcon('check')}
            style={this._checkStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }

  get footer() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap when you've reached the goal
      </Text>
    );
  }

  onTick() {
    Vibration.vibrate();
    caller(this.props.onTick);
  }

  get _checkStyle() {
    let { tracker } = this.props;
    return tracker.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  }
};
