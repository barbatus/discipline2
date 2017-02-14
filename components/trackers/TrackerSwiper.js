'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  InteractionManager,
} from 'react-native';

import RNShakeEvent from 'react-native-shake-event';

import Swiper from '../scrolls/Swiper';

import Animation from '../animation/Animation';
import {
  minScale,
  MoveUpScaleResponderAnim,
} from '../animation/MoveUpScaleResponderAnim';
import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';
import {MoveUpDownResponder} from '../animation/responders';

import {commonStyles, screenWidth} from '../styles/common';
import {slideHeight} from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import {caller} from '../../utils/lang';

export default class TrackerSwiper extends TrackerRenderer {
  _index = 0;

  _upDown = new ScreenSlideUpDownAnim(minScale);

  _moveScale = new MoveUpScaleResponderAnim(slideHeight);

  _responder = new MoveUpDownResponder();

  get current() {
    return this.state.trackers.get(this.index);
  }

  get responder() {
    return this._responder;
  }

  get editedTracker() {
    const trackerId = this.current.id;
    return this.refs[trackerId].editedTracker;
  }

  get size() {
    return this.refs.swiper.getSize();
  }

  get index() {
    return this._index;
  }

  get shown() {
    return this._upDown.value === 0;
  }

  componentWillMount() {
    RNShakeEvent.addEventListener('shake', ::this.shakeCurrent);
  }

  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
    this._moveScale.dispose();
    this._responder.dispose();
  }

  componentDidMount() {
    const { onScaleMove, onScaleDone, onScaleStart } = this.props;
    this._moveScale.subscribe(this._responder,
      onScaleMove, onScaleStart, onScaleDone);
  }

  shouldComponentUpdate(props, state) {
    const should = super.shouldComponentUpdate(props, state);
    return should || this.state.enabled !== state.enabled;
  }

  componentWillReceiveProps({ enabled, trackers, removeIndex, addIndex, updateIndex }) {
    const prevEnabled = this.props.enabled;
    if (prevEnabled !== enabled) {
      this.setState({ enabled });
    }

    const prevTrackers = this.props.trackers;
    if (prevTrackers === trackers) return;

    if (removeIndex !== undefined) {
      this.setState({trackers: prevTrackers});
      caller(this.props.onRemoveCompleted);
      this._animateRemove(prevTrackers, removeIndex, () => {
        this.setState({ trackers, enabled: true });
      });
    }

    if (addIndex !== undefined) {
      caller(this.props.onAddCompleted);
      this.setState({ trackers, enabled: true }, () => {
        this.scrollTo(addIndex);
      });
    }

    if (updateIndex !== undefined) {
      caller(this.props.onSaveCompleted);
      this.cancelEdit();
    }
  }

  shakeCurrent() {
    const trackerId = this.current.id;
    this.refs[trackerId].shake();
  }

  showEdit(callback) {
    this.setState({enabled: false}, () => {
      const trackerId = this.current.id;
      this.refs[trackerId].showEdit(callback);
    });
  }

  cancelEdit(callback) {
    const trackerId = this.current.id;
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

  // When animating the removal we always scroll to the prev index.
  _animateRemove(trackers, index, callback) {
    const tracker = trackers.get(index);
    const trackerId = tracker.id;
    const prevInd = index + (index >= 1 ? -1 : 1);

    this.refs[trackerId].collapse(() => {
       this.scrollTo(prevInd, () => {
          InteractionManager.runAfterInteractions(() => {
            // In case of removing the first tracker,
            // we move to the next, so adjust the index accordingly.
            this._index = index ? prevInd : 0;
            caller(callback);
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
    const { style, onScroll, onSlideNoChange } = this.props;
    const { trackers, enabled } = this.state;

    const slideStyle = {width: screenWidth, height: slideHeight};
    const slides = trackers.map(
      tracker => {
        return (
          <View key={tracker.id} style={[commonStyles.centered, slideStyle]}>
            { this.renderTracker(tracker, true) }
          </View>
        )
      }).toArray();

    const swiperView = (
      <Swiper
        ref='swiper'
        style={commonStyles.flexFilled}
        slides={slides}
        scrollEnabled={enabled}
        onTouchMove={onScroll}
        onSlideChange={::this._onSlideChange}
        onSlideNoChange={onSlideNoChange}>
      </Swiper>
    );

    const transform = Animation.combineStyles(this._moveScale, this._upDown);
    const swiperStyle = [style, transform];

    return (
      <Animated.View style={swiperStyle}
        {...this._responder.panHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
};
