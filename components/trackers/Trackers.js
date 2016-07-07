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

import TrackerStore from '../../trackers/Trackers';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

export default class Trackers extends Component {
  _opacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      swiperTrackers: [],
      scrollTrackers: []
    };
  }

  componentWillMount() {
    this._loadTrackers();
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

    // this.setState({
    //   swiperTrackers: trackers
    // }, () => {
    //   if (this.swiper.shown) {
    //     this.swiper.scrollTo(nextInd);
    //     return;
    //   }
    //   this.scroll.scrollTo(nextInd);
    // });

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
    return this.state.swiperTrackers;
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

  _loadTrackers() {
    let hasTestData = depot.hasTestData();
    if (!hasTestData) {
      depot.initTestData();
    }
    let trackers = TrackerStore.getAll();

    if (trackers.length) {
      this._renderSwiper([trackers[0]], () => {
        Animated.timing(this._opacity, {
          duration: 500,
          toValue: 1
        }).start(() => {
          this._renderAll(trackers);
        });
      });
    }
  }

  _renderSwiper(trackers, callback) {
    this.setState({
      swiperTrackers: trackers
    }, callback);
  }

  _renderScrolls(trackers, callback) {
    this.setState({
      scrollTrackers: trackers
    }, callback);
  }

  _renderAll(trackers, callback) {
    this._renderSwiper(trackers, callback);
    this.setTimeout(() => {
      this._renderScrolls(trackers);
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

      let index = this.swiper.index;
      this.swiper.removeTracker(() => {
        let trackers = this.trackers;
        trackers.splice(index, 1);
        this._renderSwiper(trackers);
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
    this.swiper.show(index);
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
          trackers={this.state.scrollTrackers}
          scale={1.6}
          onSlideTap={this._onBigSlideTap.bind(this)}
        />
        <TrackerScroll
          ref='sscroll'
          style={styles.smallScroll}
          trackers={this.state.scrollTrackers}
          scale={4}
          editable={false}
          onSlideTap={this._onSmallSlideTap.bind(this)}
        />
        <TrackerSwiper
          ref='swiper'
          trackers={this.state.swiperTrackers}
          style={commonStyles.absoluteFilled}
          onMoveUpStart={this._onMoveUpStart.bind(this)}
          onMoveUp={this._onMoveUp.bind(this)}
          onMoveUpDone={this._onMoveUpDone.bind(this)}
          onScroll={this.props.onScroll}
          onSlideChange={this.props.onSlideChange}
          onSlideNoChange={this.props.onSlideNoChange}
          onRemove={this._onRemove.bind(this)}
          onEdit={this._onEdit.bind(this)} />
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
