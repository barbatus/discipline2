'use strict';

import React, { Component } from 'react';

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

import { MoveUpDownResponder } from '../animation/responders';

import { commonStyles, screenWidth } from '../styles/common';

import { slideHeight } from './styles/slideStyles';

import TrackerRenderer from './TrackerRenderer';

import { caller } from '../../utils/lang';

export default class TrackerSwiper extends TrackerRenderer {
  _upDown = new ScreenSlideUpDownAnim(minScale);

  _moveScale = new MoveUpScaleResponderAnim(slideHeight);

  _responder = new MoveUpDownResponder();

  get current() {
    return this.state.trackers.get(this.index);
  }

  get index() {
    return this.refs.swiper.index;
  }

  get responder() {
    return this._responder;
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
    this._moveScale.subscribe(
      this._responder,
      onScaleMove,
      onScaleStart,
      onScaleDone,
    );
  }

  componentWillReceiveProps(props, state) {
    super.componentWillReceiveProps(props, state);

    const { enabled, trackers, removeIndex, addIndex, updateIndex } = props;
    if (this.props.enabled !== enabled) {
      this.setState({ enabled });
    }

    const prevTrackers = this.props.trackers;
    if (prevTrackers === trackers) return;

    if (removeIndex != null) {
      this.setState({ trackers: prevTrackers });
      caller(this.props.onRemoveCompleted, removeIndex);
      this._animateRemove(prevTrackers, removeIndex, () => {
        this.setState({ trackers, enabled: true });
      });
    }

    if (addIndex != null) {
      caller(this.props.onAddCompleted, addIndex);
      this.setState({ trackers, enabled: true }, () => {
        this.scrollTo(addIndex);
      });
    }

    if (updateIndex != null) {
      caller(this.props.onSaveCompleted, updateIndex);
      this.cancelEdit();
    }
  }

  shakeCurrent() {
    const trackerId = this.current.id;
    this.refs[trackerId].shake();
  }

  showEdit(callback) {
    this.setState({ enabled: false }, () => {
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
          this.scrollTo(index ? prevInd : 0, null, false);
          caller(callback);
        });
      });
    });
  }

  _onCancelEdit(callback) {
    this.setState({ enabled: true }, callback);
  }

  render() {
    const { trackers } = this.state;

    const slideStyle = {
      width: screenWidth,
      height: slideHeight,
    };
    const slides = trackers
      .map(tracker => {
        return (
          <View key={tracker.id} style={[commonStyles.centered, slideStyle]}>
            {this.renderTracker(tracker)}
          </View>
        );
      })
      .toArray();

    const { style, onScroll } = this.props;
    const { enabled } = this.state;
    const swiperView = (
      <Swiper
        ref="swiper"
        {...this.props}
        style={commonStyles.flexFilled}
        slides={slides}
        scrollEnabled={enabled}
        onTouchMove={onScroll}
      />
    );

    const transform = Animation.combineStyles(this._moveScale, this._upDown);
    const swiperStyle = [style, transform];

    return (
      <Animated.View style={swiperStyle} {...this._responder.panHandlers}>
        {swiperView}
      </Animated.View>
    );
  }
}
