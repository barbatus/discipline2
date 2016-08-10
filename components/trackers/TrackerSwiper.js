'use strict';

import React, {Component} from 'react';

import {
  View,
  ListView,
  StyleSheet,
  Text,
  Animated,
  PanResponder
} from 'react-native';

import RNShakeEventIOS from 'react-native-shake-event-ios';

import Swiper from '../scrolls/Swiper';

import {minScale, ScaleResponderAnimation} from '../animation/ScaleResponderAnimation';

import Animation from '../animation/Animation';

import ScreenUpDownAnimation from '../animation/ScreenUpDownAnimation';

import {commonStyles, screenWidth} from '../styles/common';

import {slideHeight} from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import {caller} from '../../utils/lang';

export default class TrackerSwiper extends TrackerRenderer {
  _index = 0;

  _inOut = new ScreenUpDownAnimation(minScale);

  constructor(props) {
    super(props);

    let { onMoveUp, onMoveUpDone, onMoveUpStart } = props;
    this._scale = new ScaleResponderAnimation(slideHeight,
      onMoveUp, onMoveUpStart, onMoveUpDone);
  }

  componentWillMount() {
    RNShakeEventIOS.addEventListener('shake', ::this.shakeCurrent);
  }

  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake');
  }

  get current() {
    return this.state.trackers[this.index];
  }

  shakeCurrent() {
    this.current.shake();
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

  get size() {
    return this.refs.swiper.getSize();
  }

  get index() {
    return this._index;
  }

  get nextIndex() {
    return this.size ? this.index + 1 : 0;
  }

  get prevIndex() {
    let diff = this.index >= 1 ? -1 : 1;
    return this.index + diff;
  }

  hide(callback) {
    this._inOut.setOut();
    caller(callback);
  }

  show(index, callback) {
    this._inOut.setIn();
    this._scale.animateIn(callback);
  }

  get shown() {
    return this._inOut.value === 0;
  }

  scrollTo(index, callback, animated) {
    this.refs.swiper.scrollTo(index, callback, animated);
  }

  addTracker(callback) {}

  removeTracker(callback) {
    let trackerId = this.current.id;

    let index = this.index;
    let prevInd = this.prevIndex;
    this.refs[trackerId].collapse(() => {
      // When removing we always move to the prev index.
       this.scrollTo(prevInd, () => {
        this._endEdit(() => {
          // In case of removing the first tracker,
          // we move to the next, so adjust the index accordingly.
          this._index = index ? prevInd : 0;
          caller(callback, index);
        })
      });
    });
  }

  _onSlideChange(index, previ) {
    this._index = index;
    caller(this.props.onSlideChange, index, previ);
  }

  _startEdit(callback) {
    this.refs.swiper.setEnabled(false, callback);
  }

  _endEdit(callback) {
    this.refs.swiper.setEnabled(true, callback);
  }

  _onCancelEdit(callback) {
    this.refs.swiper.setEnabled(true);
    caller(callback);
  }

  render() {
    let { style, onScroll, onSlideNoChange } = this.props;

    let slideStyle = { width: screenWidth, height: slideHeight };
    let slides = this.state.trackers.map(
      tracker => {
        return (
          <View key={tracker.id} style={[commonStyles.centered, slideStyle]} >
            { this.renderTracker(tracker, true) }
          </View>
        )
      });

    let swiperView = (
      <Swiper
        ref='swiper'
        style={commonStyles.flexFilled}
        slides={slides}
        scrollEnabled={this.state.scrollEnabled}
        onTouchMove={onScroll}
        onSlideChange={::this._onSlideChange}
        onSlideNoChange={onSlideNoChange}>
      </Swiper>
    );

    let swiperStyle = [style, Animation.combineStyles(this._scale, this._inOut)];

    return (
      <Animated.View style={swiperStyle} {...this._scale.panHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
};
