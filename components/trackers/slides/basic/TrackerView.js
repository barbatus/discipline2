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

import {trackerStyles} from '../../styles/trackerStyles';

import BaseTrackerView from './BaseTrackerView';

export default class TrackerView extends BaseTrackerView {
  render() {
    return (
      <Animated.View style={[
          trackerStyles.innerView,
          this.props.style
        ]}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={this.props.onTap}>
          <View style={{flex: 1}}>
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
            <View style={trackerStyles.bodyContainer}>
              <View style={trackerStyles.controlsContainer}>
                {this.props.controls}
              </View>
            </View>
            <View style={trackerStyles.footerContainer}>
              {this.props.footer}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
};
