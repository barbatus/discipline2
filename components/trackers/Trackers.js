'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Animated
} from 'react-native';

import reactMixin from 'react-mixin';

import TimerMixin from 'react-timer-mixin';

import {List} from 'immutable';

import TrackerSwiper from './TrackerSwiper';

import TrackerScroll from './TrackerScroll';

import TrackerCal from './TrackerCal';

import TrackerStore from '../../model/Trackers';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

const absFilled = commonStyles.absoluteFilled;

const newList = (trackers) => {
  return new List(trackers || []);
};

export default class Trackers extends Component {
  _trackers = null;

  _opacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      swiper: newList(),
      scroll: newList()
    };
  }

  componentDidMount() {
    let trackers = newList(
      this._loadTrackers());
    this._setTrackers(trackers);

    if (trackers.size) {
      this._renderOne(trackers.first(), () => {
        this._renderAll(trackers);
      });
    }
  }

  addTracker(tracker, callback) {
    check.assert.not.null(tracker.typeId);

    let nextInd = this.swiper.nextIndex;
    tracker = TrackerStore.addAt(tracker, nextInd);

    this.swiper.addTracker(tracker, () => { 
      let trackers = this.trackers.insert(nextInd, tracker);
      this._setTrackers(trackers);
      this._renderScrolls(trackers);
      caller(callback, tracker);
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
    depot.initData();

    return TrackerStore.getAll();
  }

  _setTrackers(trackers) {
    this._trackers = trackers;
  }

  _renderOne(tracker, callback) {
    this.setState({
      swiper: newList([tracker])
    }, () => {
      Animated.timing(this._opacity, {
        duration: 500,
        toValue: 1
      }).start(callback);
    });
  }

  _renderAll(trackers, callback) {
    this.setState({
      swiper: trackers
    });

    this.setTimeout(() => {
      this.setState({
        scroll: trackers
      }, callback);
    });
  }

  _renderScrolls(trackers, callback) {
    this.setState({
      scroll: trackers
    }, callback);
  }

  _onEdit() {
    this.swiper.showEdit();
    caller(this.props.onEdit);
  }

  _onRemove() {
    let tracker = this.swiper.current;
    let removed = tracker.remove();

    if (removed) {
      this.swiper.removeTracker(index => {
        let trackers = this.trackers.delete(index);
        this._setTrackers(trackers);
        this._renderScrolls(trackers);
        caller(this.props.onRemove);
      });
    }
  }

  _onScaleStart() {
    let { index } = this.swiper;
    this.bscroll.hide();
    this.bscroll.scrollTo(index, false);
    this.sscroll.scrollTo(index, false);
  }

  _onScaleMove(dv) {
    this.bscroll.opacity = 1 - dv;
    this.sscroll.opacity = 1 - dv;
    caller(this.props.onSwiperScaleMove, dv);
  }

  _onScaleDone() {
    this.bscroll.show();
    this.sscroll.show();
    this.swiper.hide();
  }

  _onMoveDown(dv: number) {
    this.refs.calendar.setShown(dv);
    caller(this.props.onSwiperMoveDown, dv);
  }

  _onCenterSlideTap(index) {
    this.bscroll.hide();
    this.sscroll.hide();

    this.swiper.scrollTo(index, () => {
      this.swiper.show();
    }, false);
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
          trackers={this.state.scroll}
          style={styles.bigScroll}
          scale={1 / 1.6}
          onCenterSlideTap={::this._onCenterSlideTap}
        />
        <TrackerScroll
          ref='sscroll'
          trackers={this.state.scroll}
          style={styles.smallScroll}
          scale={1 / 4}
          editable={false}
          onSlideTap={::this._onSmallSlideTap}
        />
        <TrackerCal
          ref='calendar'
          style={absFilled}
        />
        <TrackerSwiper
          ref='swiper'
          trackers={this.state.swiper}
          style={absFilled}
          onScroll={this.props.onScroll}
          onSlideChange={this.props.onSlideChange}
          onSlideNoChange={this.props.onSlideNoChange}
          onScaleStart={::this._onScaleStart}
          onScaleMove={::this._onScaleMove}
          onScaleDone={::this._onScaleDone}
          onMoveDown={::this._onMoveDown}
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
