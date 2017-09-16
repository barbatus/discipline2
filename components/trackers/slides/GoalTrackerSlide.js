import React from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Vibration,
} from 'react-native';

import { getIcon } from '../../../icons/icons';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerSlide from './TrackerSlide';

import { caller } from '../../../utils/lang';

export default class GoalTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);
    this.onTick = ::this.onTick;
  }

  get bodyControls() {
    const { responsive } = this.props;
    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity disabled={!responsive} onPress={this.onTick}>
          <Image source={getIcon('check')} style={this.checkStyle} />
        </TouchableOpacity>
      </View>
    );
  }

  get footerControls() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap when you&#39;ve reached the goal
      </Text>
    );
  }

  get checkStyle() {
    const { tracker } = this.props;
    return tracker.checked
      ? [trackerStyles.checkBtn, trackerStyles.filledBtn]
      : trackerStyles.checkBtn;
  }

  onTick() {
    Vibration.vibrate();
    caller(this.props.onTick);
  }
}
