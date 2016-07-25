'use strict';

import React, {Component} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import TrackerSwiper from './TrackerSwiper';

import TrackerScroll from './TrackerScroll';

import TrackerStore from '../../model/Trackers';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

export default class Trackers extends Component {
  _trackers = [];

  _opacity = new Animated.Value(0);

  componentWillMount() {
    this._trackers = this._loadTrackers();
  }

  componentDidMount() {
    if (this.trackers.length) {
      this._renderInit(this.trackers);
    }
  }

  addTracker(tracker, callback) {
    if (!tracker.typeId) return null;

    let nextInd = this.swiper.nextIndex;
    tracker = TrackerStore.addAt(tracker, nextInd);

    caller(callback);

    let trackers = this.trackers;
    trackers.splice(nextInd, 0, tracker);
    this._renderAll(trackers, () => {
      this.swiper.scrollTo(nextInd);
    });

    return tracker;
  }

  get swiper() {
    return this.refs.swiper;
  }

  get bscroll() {
    return this.refs.bscroll;
  }

  get sscroll() {
    return this.refs.sscroll;
  }

  get trackers() {
    return this._trackers;
  }

  cancelEdit() {
    this.swiper.cancelEdit();
    caller(this.props.onCancel);
  }

  saveEdit() {
    this.swiper.saveEdit();
    caller(this.props.onSave);
  }

  _loadTrackers() {
    let hasTestData = depot.hasTestData();
    if (!hasTestData) {
      depot.initTestData();
    }

    return TrackerStore.getAll();
  }

  _renderInit(trackers, callback) {
    this.swiper.setTrackers(trackers.slice(0, 1), () => {
      Animated.timing(this._opacity, {
        duration: 500,
        toValue: 1
      }).start(() => {
        this._renderAll(trackers);
      });
    });
  }

  _renderAll(trackers, callback) {
    this.swiper.setTrackers(trackers, callback);

    this.setTimeout(() => {
      this.bscroll.setTrackers(trackers);
      this.sscroll.setTrackers(trackers);
    });
  }

  _onEdit() {
    this.swiper.showEdit();
    caller(this.props.onEdit);
  }

  _onRemove() {
    let tracker = this.swiper.current;
    let removed = tracker.remove();

    if (removed) {
      caller(this.props.onRemove, removed);

      this.swiper.removeTracker(index => {
        let trackers = this.trackers;
        trackers.splice(index, 1);
        this._renderAll(trackers);
      });
    }
  }

  _onMoveUpStart() {
    let index = this.swiper.index;
    this.bscroll.hide();
    this.bscroll.scrollTo(index, false);
    this.sscroll.scrollTo(index, false);
  }

  _onMoveUp(dv) {
    this.bscroll.opacity = 1 - dv;
    this.sscroll.opacity = 1 - dv;
    caller(this.props.onSwiperHide, dv);
  }

  _onMoveUpDone() {
    this.bscroll.show();
    this.sscroll.show();
    this.swiper.hide();
  }

  _onBigSlideTap(index) {
    this.bscroll.hide();
    this.sscroll.hide();

    this.swiper.scrollTo(index, () => {
      this.swiper.show();
    }, false);
    caller(this.props.onSwiperShow, 1);
  }

  _onSmallSlideTap(index) {
    this.bscroll.scrollTo(index, true);
    this.sscroll.scrollTo(index, true);
  }

  render() {
    return (
      <Animated.View style={[
        commonStyles.flexFilled,
        {opacity: this._opacity}
      ]}> 
        <TrackerScroll
          ref='bscroll'
          style={styles.bigScroll}
          scale={1 / 1.6}
          onSlideTap={::this._onBigSlideTap}
        />
        <TrackerScroll
          ref='sscroll'
          style={styles.smallScroll}
          scale={1 / 4}
          editable={false}
          onSlideTap={::this._onSmallSlideTap}
        />
        <TrackerSwiper
          ref='swiper'
          style={commonStyles.absoluteFilled}
          onScroll={this.props.onScroll}
          onSlideChange={this.props.onSlideChange}
          onSlideNoChange={this.props.onSlideNoChange}
          onMoveUpStart={::this._onMoveUpStart}
          onMoveUp={::this._onMoveUp}
          onMoveUpDone={::this._onMoveUpDone}
          onRemove={::this._onRemove}
          onEdit={::this._onEdit} />
      </Animated.View>
    )
  }
};

reactMixin(Trackers.prototype, TimerMixin);

const styles = StyleSheet.create({
  bigScroll: {
    flex: 0.65
  },
  smallScroll: {
    flex: 0.35
  }
});
