'use strict';

import React, { Component } from 'react';

import {
  View,
  ListView,
  StyleSheet,
  Text,
  Animated
} from 'react-native';

import Scroll from '../scrolls/Scroll';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');
const screenWidth = window.width;

import Trackers from '../../trackers/Trackers';

import { commonStyles } from '../styles/common';

import TrackerRenderer from './TrackerRenderer';

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

  render() {
    let slides = this.props.trackers.map(
      tracker => {
        return this.renderTracker(tracker, 0.5);
      });

    return (
      <Animated.View style={[
          commonStyles.flexFilled,
          this.props.style, {
          opacity: this._opacity
        }]}>
        <Scroll
          ref='scroll'
          slideWidth={screenWidth / 2}
          padding={screenWidth / 4}
          index={this.props.index}
          slides={slides}
          onSlideClick={this.props.onSlideClick}>
        </Scroll>
      </Animated.View>
    );
  }
};

TrackerScroll.defaultProps = {
  index: 0,
  trackers: []
};
