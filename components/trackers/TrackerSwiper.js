'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  InteractionManager
} from 'react-native';

import RNShakeEventIOS from 'react-native-shake-event-ios';

import Swiper from '../scrolls/Swiper';

import Animation from '../animation/Animation';

import {minScale, MoveUpScaleResponderAnim} from '../animation/MoveUpScaleResponderAnim';

import {MoveDownResponderAnim} from '../animation/MoveDownResponderAnim';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

import {MoveUpDownResponder} from '../animation/responders';

import {commonStyles, screenWidth} from '../styles/common';

import {slideHeight} from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import {caller} from '../../utils/lang';

export default class TrackerSwiper extends TrackerRenderer {
  _index = 0;

  _upDown = new ScreenSlideUpDownAnim(minScale);

  constructor(props) {
    super(props);

    let { onScaleMove, onScaleDone, onScaleStart,
          onMoveDown, onMoveDownDone, onMoveDownStart } = props;
    this._responder = new MoveUpDownResponder();

    this._moveScale = new MoveUpScaleResponderAnim(this._responder,
      slideHeight, onScaleMove, onScaleStart, onScaleDone);

    this._moveDown = new MoveDownResponderAnim(this._responder,
      slideHeight, onMoveDown, onMoveDownStart, () => {
        this._setEnabled(false);
        this._responder.stop();
        caller(onMoveDownDone);
      });
  }

  get current() {
    return this.state.trackers.get(this.index);
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

  get shown() {
    return this._upDown.value === 0;
  }

  componentWillMount() {
    RNShakeEventIOS.addEventListener('shake', ::this.shakeCurrent);
  }

  componentWillUnmount() {
    RNShakeEventIOS.removeEventListener('shake');
    this._moveScale.dispose();
    this._moveDown.dispose();
  }

  shouldComponentUpdate(props, state) {
    let should = super.shouldComponentUpdate(props, state);

    return should || this.state.enabled !== state.enabled;
  }

  onTap() {
    super.onTap();

    if (this._responder.stopped) {
      this._moveDown.animateOut(() => {
        this._responder.resume();
        this._setEnabled(true);
      });
    }
  }

  shakeCurrent() {
    let trackerId = this.current.id;
    this.refs[trackerId].shake();
  }

  showEdit(callback) {
    this.setState({ enabled: false }, () => {
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

  hide(callback) {
    this._upDown.setOut();
    caller(callback);
  }

  show(index, callback) {
    this._upDown.setIn();
    this._moveScale.animateIn(callback);
  }

  scrollTo(index, callback, animated) {
    this.refs.swiper.scrollTo(index, callback, animated);
  }

  addTracker(tracker, callback) {
    let { trackers } = this.state;
    trackers = trackers.insert(this.nextIndex, tracker);

    this.setState({ trackers }, () => {
      this.scrollTo(this.nextIndex);
      caller(callback);
    });
  }

  removeTracker(callback) {
    let trackerId = this.current.id;
    let index = this.index;
    let prevInd = this.prevIndex;

    let { trackers } = this.state;
    trackers = trackers.delete(index);

    this.refs[trackerId].collapse(() => {
      // When removing we always move to the prev index.
       this.scrollTo(prevInd, () => {
          InteractionManager.runAfterInteractions(() => {
            this.setState({ trackers, enabled: true }, () => {
              // In case of removing the first tracker,
              // we move to the next, so adjust the index accordingly.
              this._index = index ? prevInd : 0;
              caller(callback, index);
            });
          });
      });
    });
  }

  _onSlideChange(index, previ) {
    this._index = index;
    caller(this.props.onSlideChange, index, previ);
  }

  _onCancelEdit(callback) {
    this._setEnabled(true, callback);
  }

  _setEnabled(enabled, callback) {
    this.setState({ enabled }, callback);
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
      }).toArray();

    let swiperView = (
      <Swiper
        ref='swiper'
        style={commonStyles.flexFilled}
        slides={slides}
        scrollEnabled={this.state.enabled}
        onTouchMove={onScroll}
        onSlideChange={::this._onSlideChange}
        onSlideNoChange={onSlideNoChange}>
      </Swiper>
    );

    let transform = Animation.combineStyles(
      this._moveScale, this._moveDown, this._upDown);
    let swiperStyle = [style, transform];

    return (
      <Animated.View style={swiperStyle}
        {...this._responder.panHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
};
