'use strict';

import React, { Component } from 'react';

import {
  View,
  ListView,
  StyleSheet,
  Text,
  Animated,
  PanResponder
} from 'react-native';

import Swiper from '../scrolls/Swiper';

import Trackers from '../../trackers/Trackers';

import { ScaleResponder } from './responders';

import { commonStyles } from '../styles/common';

import TrackerRenderer from './TrackerRenderer';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');
const screenHeight = window.height - 60;

export default class TrackerSwiper extends TrackerRenderer {
  constructor(props) {
    super(props);

    this.state = {
      scale: new Animated.Value(1),
      moveY: new Animated.Value(0),
      index: 0
    };
  }

  componentWillMount() {
    let scaleResponder = new ScaleResponder(screenHeight);
    scaleResponder.subscribe(scale => {
      this.state.scale.setValue(scale);
      if (this.props.onMoveUp) {
        this.props.onMoveUp(scale - 0.5);
      }
    },
    this.props.onMoveUpStart,
    () => {
      if (this.state.scale._value <= 0.5) {
        if (this.props.onMoveUpDone) {
          this.props.onMoveUpDone();
        }
        return;
      }

      Animated.timing(this.state.scale, {
        duration: 200,
        toValue: 0.5
      }).start(this.props.onMoveUpDone);
    });

    this._scaleHandlers = scaleResponder.panHandlers;
  }

  get current() {
    return this.props.trackers[this.index];
  }

  showEdit(callback) {
    this._startEdit(() => {
      let trackerId = this.current.id;
      this.refs[trackerId].showEdit(callback);
    });
  }

  saveEdit(callback) {
    let trackerId = this.current.id;
    return this.refs[trackerId].saveEdit(() => {
      this._onCancelEdit(callback);
    });
  }

  cancelEdit(callback) {
    let trackerId = this.current.id;
    return this.refs[trackerId].cancelEdit(() => {
      this._onCancelEdit(callback);
    });
  }

  get index() {
    return this.refs.swiper.getIndex();
  }

  get nextIndex() {
    return this.refs.swiper.getNextIndex();
  }

  get prevIndex() {
    return this.refs.swiper.getPrevIndex();
  }

  hide(callback) {
    this.state.moveY.setValue(1);
  }

  show(index, callback) {
    this.state.moveY.setValue(0);
    this.scrollTo(index, () => {
      Animated.timing(this.state.scale, {
        duration: 500,
        toValue: 1
      }).start(callback);
    }, false);
  }

  get shown() {
    return this.state.moveY._value === 0;
  }

  scrollTo(index, callback, animated) {
    this.refs.swiper.scrollTo(index, callback, animated);
  }

  addTracker(callback) {}

  removeTracker(callback) {
    let trackerId = this.current.id;

    this.refs[trackerId].collapse(() => {
      if (this.index) {
        this.scrollTo(this.prevIndex,
          this._endEdit.bind(this, callback));
        return;
      }
      this._endEdit(callback);
    });
  }

  _startEdit(callback) {
    this.refs.swiper.setEnabled(false, callback);
  }

  _endEdit(callback) {
    this.refs.swiper.setEnabled(true, callback);
  }

  _onCancelEdit(callback) {
    this.refs.swiper.setEnabled(true);
    if (callback) {
      callback();
    }
  }

  render() {
    let slides = this.props.trackers.map(
      tracker => {
        return this.renderTracker(tracker, 1);
      });

    let swiperView = (
      <Swiper
        ref='swiper'
        slides={slides}
        onTouchMove={this.props.onScroll}
        scrollEnabled={this.state.scrollEnabled}
        onSlideChange={this.props.onSlideChange}
        onSlideNoChange={this.props.onSlideNoChange}>
      </Swiper>
    );

    return (
      <Animated.View style={[
        commonStyles.flexFilled,
        this.props.style, {
          transform: [
            {
              scale: this.state.scale
            },
            {
              translateY: this.state.moveY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1000]
              })
            }
          ]
        }]} {...this._scaleHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
};

TrackerSwiper.defaultProps = {
  trackers: []
};
