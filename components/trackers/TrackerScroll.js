'use strict';

import React, { Component } from 'react';

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

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');
const screenWidth = window.width;

import Trackers from '../../trackers/Trackers';

import { commonStyles } from '../styles/common';

import TrackerRenderer from './TrackerRenderer';

import { caller } from '../../utils/lang';

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
    let index = this.props.trackers.findIndex(
      tracker => tracker.id === trackId);
    this.scrollTo(index, () => {
      caller(this.props.onSlideTap, index);
    });
  }

  render() {
    let { style, scale, padding, index } = this.props;

    let slides = this.props.trackers.map(
      (tracker, index) => {
        return this._scaleSlide(this.renderTracker(tracker), scale);
      });

    return (
      <Animated.View style={[style, {
          opacity: this._opacity
        }
      ]}>
        <Scroll
          ref='scroll'
          slideWidth={screenWidth / scale}
          padding={0}
          index={index}
          slides={slides}>
        </Scroll>
      </Animated.View>
    );
  }

  _scaleSlide(slide, scale) {
    return (
      <Animated.View style={{
          transform: [{
            scale: new Animated.Value(1 / scale)
          }]
        }}>
        {slide}
      </Animated.View>
    );
  }
};

TrackerScroll.defaultProps = {
  index: 0,
  trackers: []
};
