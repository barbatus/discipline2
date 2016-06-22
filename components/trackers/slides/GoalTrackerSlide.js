'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';

import { trackerStyles } from '../styles/trackerStyles';
import TrackerSlide from './TrackerSlide';

export default class GoalTrackerSlide extends TrackerSlide {
  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      checked: tracker.checked
    });
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity
          disabled={editable}
          onPress={this._onCheck.bind(this)}>
          <Image
            source={getIcon('check')}
            style={this._getCheckStyle()}
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

  _onCheck() {
    let { tracker } = this.props;
    tracker.click();
  }

  _getCheckStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  }
};
