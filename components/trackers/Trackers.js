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

    if (callback) {
      callback();
    }

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

  get scroll() {
    return this.refs.scroll;
  }

  cancelEdit() {
    this.swiper.cancelEdit();
    if (this.props.onCancel) {
      this.props.onCancel();
    }
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
    if (this.props.onEdit) {
      this.props.onEdit();
    }
  }

  _onRemove() {
    let tracker = this.swiper.currentTracker;
    let removed = tracker.remove();

    if (this.props.onRemove) {
      this.props.onRemove(removed);
    }

    if (removed) {
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
    this.scroll.hide();
    this.scroll.scrollTo(index, false);
  }

  _onMoveUp(dv) {
    this.scroll.opacity = 1 - dv;
  }

  _onMoveUpDone() {
    this.scroll.show();
    this.swiper.hide();
  }

  _onSlideClick(index) {
    this.scroll.hide();
    this.swiper.show(index);
  }

  render() {
    return (
      <View style={commonStyles.flexFilled}>
        <TrackerScroll
          ref='scroll'
          trackers={this.state.trackers}
          onSlideClick={this._onSlideClick.bind(this)}
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
