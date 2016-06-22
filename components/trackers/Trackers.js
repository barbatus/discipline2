'use strict';

import React, { Component } from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';

import TrackerSwiper from './TrackerSwiper';

import TrackerScroll from './TrackerScroll';

import TrackerStore from '../../trackers/Trackers';

import { commonStyles } from '../styles/common';

import { caller } from '../../utils/lang';

export default class Trackers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trackers: []
    };
  }

  componentWillMount() {
    this._loadInitialState();
  }

  addTracker(tracker, callback) {
    if (!tracker.typeId) return null;

    let nextInd = this.swiper.nextIndex;
    tracker = TrackerStore.addAt(tracker, nextInd);

    caller(callback);

    let trackers = this.state.trackers;
    trackers.splice(nextInd, 0, tracker);
    this.setState({
      trackers: trackers
    }, () => {
      if (this.swiper.shown) {
        this.swiper.scrollTo(nextInd);
        return;
      }
      this.scroll.scrollTo(nextInd);
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

  cancelEdit() {
    this.swiper.cancelEdit();
    caller(this.props.onCancel);
  }

  saveEdit() {
    this.swiper.saveEdit();
    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  _loadInitialState() {
    let hasTestData = depot.hasTestData();
    if (!hasTestData) {
      depot.initTestData();
    }
    let trackers = TrackerStore.getAll();

    if (trackers.length) {
      this.setState({
        trackers: [trackers[0]]
      }, () => {
        setTimeout(() => {
          this.setState({
            trackers: trackers
          });
        });
      });
    }
  }

  _onEdit() {
    this.swiper.showEdit();
    caller(this.props.onEdit);
  }

  _onRemove() {
    let tracker = this.swiper.currentTracker;
    let removed = tracker.remove();

    if (removed) {
      caller(this.props.onRemove, removed);

      let index = this.swiper.index;
      this.swiper.removeTracker(() => {
        let trackers = this.state.trackers;
        trackers.splice(index, 1);
        this.setState({
          trackers: trackers
        });
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
  }

  _onMoveUpDone() {
    this.bscroll.show();
    this.sscroll.show();
    this.swiper.hide();
  }

  _onBigSlideTap(index) {
    this.bscroll.hide();
    this.sscroll.hide();
    this.swiper.show(index);
  }

  _onSmallSlideTap(index) {
    this.bscroll.scrollTo(index, true);
    this.sscroll.scrollTo(index, true);
  }

  render() {
    return (
      <View style={commonStyles.flexFilled}>
        <TrackerScroll
          ref='bscroll'
          style={styles.bigScroll}
          trackers={this.state.trackers}
          scale={1.6}
          onSlideTap={this._onBigSlideTap.bind(this)}
        />
        <TrackerScroll
          ref='sscroll'
          style={styles.smallScroll}
          trackers={this.state.trackers}
          scale={4}
          onSlideTap={this._onSmallSlideTap.bind(this)}
        />
        <TrackerSwiper
          ref='swiper'
          trackers={this.state.trackers}
          style={commonStyles.absoluteFilled}
          onMoveUpStart={this._onMoveUpStart.bind(this)}
          onMoveUp={this._onMoveUp.bind(this)}
          onMoveUpDone={this._onMoveUpDone.bind(this)}
          onScroll={this.props.onScroll}
          onSlideChange={this.props.onSlideChange}
          onSlideNoChange={this.props.onSlideNoChange}
          onRemove={this._onRemove.bind(this)}
          onEdit={this._onEdit.bind(this)} />
      </View>
    )
  }
};

const styles = StyleSheet.create({
  bigScroll: {
    flex: 0.65
  },
  smallScroll: {
    flex: 0.35
  }
});

