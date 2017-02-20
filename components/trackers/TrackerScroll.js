'use strict';

import React, {Component} from 'react';

import {
  View,
  ListView,
  StyleSheet,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
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
      toValue: 0,
    }).start(callback);
  }

  scrollTo(index, callback, animated) {
    this.refs.scroll.scrollTo(index, callback, animated);
  }

  onTap(tracker: Tracker) {
    const index = this.state.trackers.findIndex(
      _ => _ === tracker);

    const scroll = this.refs.scroll.getIndex();
     if (index === scroll) {
      caller(this.props.onCenterSlideTap, index);
    }

    this.scrollTo(index, () => {
      caller(this.props.onSlideTap, index);
    });
  }

  render() {
    const { style, editable, scale } = this.props;

    const slideStyle = {
      width: screenWidth * scale,
      height: slideHeight * scale,
    };
    const slides = this.state.trackers.map(
      tracker => {
        return (
          <View
            key={tracker.id}
            style={[commonStyles.centered, slideStyle]}>
            { this.renderTracker(tracker, editable, scale) }
          </View>
        );
      }).toArray();

    return (
      <Animated.View style={[style, {
          opacity: this._opacity,
        },
      ]}>
        <Scroll
          ref='scroll'
          centered={true}
          style={commonStyles.flexFilled}
          slideWidth={screenWidth * scale}
          slides={slides}>
        </Scroll>
      </Animated.View>
    );
  }
};

TrackerScroll.defaultProps = {
  editable: true,
};
