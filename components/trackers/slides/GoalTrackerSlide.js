import React from 'react';

import { View, TouchableOpacity, Image, Text, Vibration } from 'react-native';

import { getIcon } from 'app/icons/icons';
import { caller } from 'app/utils/lang';

import { trackerStyles } from '../styles/trackerStyles';
import TrackerSlide from './TrackerSlide';

export default class GoalTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);
    this.onTick = ::this.onTick;
    this.onUndo = ::this.onUndo;
  }

  get bodyControls() {
    const { responsive } = this.props;
    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity
          disabled={!responsive}
          onLongPress={this.onUndo}
          onPress={this.onTick}
        >
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

  onUndo() {
    const { tracker } = this.props;
    if (!tracker.checked) {
      return;
    }
    caller(this.props.onUndo);
  }

  onTick() {
    const { tracker } = this.props;
    if (tracker.checked) {
      return;
    }
    Vibration.vibrate();
    caller(this.props.onTick);
  }
}
