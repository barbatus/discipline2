'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import { trackerStyles } from '../../styles/trackerStyles';

import BaseTrackerView from './BaseTrackerView';

class TrackerView extends BaseTrackerView {
  render() {
    return (
      <Animated.View style={[
          trackerStyles.innerView,
          {opacity: this.opacity},
          this.props.style
        ]}>
        <TouchableWithoutFeedback onPress={this.props.onClick}>
          <View style={trackerStyles.headerContainer}>
            <View style={trackerStyles.barContainer}>
              <TouchableOpacity onPress={this.props.onEdit}>
                <Image
                  source={getIcon('info')}
                  style={trackerStyles.infoIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={trackerStyles.iconContainer}>
              <Image
                source={this.getMainIcon(this.props.iconId)}
                style={trackerStyles.mainIcon}
              />
            </View>
            <View style={trackerStyles.titleContainer}>
              <Text style={trackerStyles.titleText}>
                {this.props.title}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={trackerStyles.bodyContainer}>
          <View style={trackerStyles.controlsContainer}>
            {this.props.controls}
          </View>
        </View>
        <View style={trackerStyles.footerContainer}>
          {this.props.footer}
        </View>
      </Animated.View>
    );
  }
};

module.exports = TrackerView;
