'use strict';

import React, {Component} from 'react';

import {
  View,
  ListView,
  StyleSheet,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import Scroll from '../scrolls/Scroll';

import BaseScroll from '../scrolls/BaseScroll';

import {commonStyles, screenWidth} from '../styles/common';

import {slideHeight} from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import {caller} from '../../utils/lang';

export default class TrackerScroll extends TrackerRenderer {
  hide(callback) {
    Animated.timing(this._opacity, {
      duration: 500,
      toValue: 0
    }).start(callback);
  }

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  }

  onTap(trackId: string) {
    let index = this.state.trackers.findIndex(
      tracker => tracker.id === trackId);
    this.scrollTo(index, () => {
      caller(this.props.onSlideTap, index);
    });
  }

  render() {
    let { style, editable, scale, padding, index } = this.props;

    let slideStyle = { width: screenWidth * scale, height: slideHeight * scale};
    let slides = this.state.trackers.map(
      (tracker, index) => {
        return (
          <View key={tracker.id} style={[commonStyles.centered, slideStyle]}>
            { this.renderTracker(tracker, editable, scale) }
          </View>
        );
      });

    return (
      <Animated.View style={[style, {
          opacity: this._opacity
        }
      ]}>
        <Scroll
          ref='scroll'
          style={commonStyles.flexFilled}
          slideWidth={screenWidth * scale}
          padding={0}
          index={index}
          slides={slides}>
        </Scroll>
      </Animated.View>
    );
  }
};

TrackerScroll.defaultProps = {
  index: 0,
  editable: true
};
