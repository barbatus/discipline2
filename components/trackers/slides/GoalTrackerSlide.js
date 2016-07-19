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

import {trackerStyles} from '../styles/trackerStyles';

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

  onTick() {
    let { tracker } = this.props;
    this.setState({
      checked: tracker.checked
    });
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <TouchableOpacity
          disabled={!editable}
          onPress={::this._onCheck}>
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

  get _checkStyle() {
    return this.state.checked ?
      [trackerStyles.checkBtn, trackerStyles.filledBtn] :
        trackerStyles.checkBtn;
  }

  _onCheck() {
    let { tracker } = this.props;
    tracker.tick();
  }
};
