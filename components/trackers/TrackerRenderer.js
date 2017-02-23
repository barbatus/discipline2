'use strict';

import React, {Component} from 'react';

import {
  Animated,
  StyleSheet,
  InteractionManager,
} from 'react-native';

import {extend} from 'lodash';

import GoalTrackerSlide from './slides/GoalTrackerSlide';

import CounterSlide from './slides/CounterSlide';

import SumTrackerSlide from './slides/SumTrackerSlide';

import StopWatchTrackerSlide from './slides/StopWatchTrackerSlide';

import DistanceTrackerSlide from './slides/DistanceTrackerSlide';

import {TrackerType} from '../../depot/consts';

import {caller} from '../../utils/lang';

export default class TrackerRenderer extends Component {
  _opacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      trackers: props.trackers,
    };
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity.setValue(value);
  }

  get shown() {
    return this.opacity._value === 1;
  }

  shouldComponentUpdate(props, state) {
    if (this.props.trackers !== props.trackers) {
      this.state.trackers = props.trackers;
      return true;
    }
    return this.state.trackers !== state.trackers;
  }

  hide(callback) {
    this.opacity = 0;
  }

  show(index, callback) {
    this.opacity = 1;
  }

  onEdit(tracker: Tracker) {
    caller(this.props.onEdit, tracker);
  }

  onRemove(tracker: Tracker) {
    caller(this.props.onRemove, tracker);
  }

  onTap(tracker: Tracker) {
    caller(this.props.onTap, tracker);
  }

  onTick(tracker: Tracker, value?: number, data?: any) {
    caller(this.props.onTick, tracker, value, data);
  }

  onStart(tracker: Tracker) {
    caller(this.props.onStart, tracker);
  }

  onStop(tracker: Tracker) {
    caller(this.props.onStop, tracker);
  }

  onProgress(tracker: Tracker, value?: number, data?: any) {
    InteractionManager.runAfterInteractions(() => {
      caller(this.props.onProgress, tracker, value, data);
    });
  }

  onUndo(tracker: Tracker) {
    caller(this.props.onUndo, tracker);
  }

  onTrackerChange(tracker: Tracker) {
    caller(this.props.onTrackerChange, tracker);
  }

  renderTracker(tracker: Tracker) {
    // Generate onProgress events only
    // for the main tracker slides (swiper's ones)
    return this._renderTracker(tracker, 1.0, true, true, {
      onProgress: this.onProgress.bind(this, tracker),
    });
  }

  renderScaledTracker(tracker: Tracker, scale: number, responsive: boolean) {
    check.assert.number(scale);
    check.assert.boolean(responsive);

    return this._renderTracker(tracker, scale, responsive, false);
  }

  _renderTracker(tracker: Tracker, scale: number,
                 responsive: boolean, editable: boolean,
                 props: Object) {
    props = extend({ responsive, editable, scale }, props); 
    switch (tracker.type) {
      case TrackerType.GOAL:
        return this._renderSlide(GoalTrackerSlide, tracker, props);
      case TrackerType.COUNTER:
        return this._renderSlide(CounterSlide, tracker, props);
      case TrackerType.SUM:
        return this._renderSlide(SumTrackerSlide, tracker, props);
      case TrackerType.STOPWATCH:
        return this._renderSlide(StopWatchTrackerSlide, tracker, props);
      case TrackerType.DISTANCE:
        return this._renderSlide(DistanceTrackerSlide, tracker, props);
    }
  }

  _renderSlide(Component, tracker: Tracker, props: Object) {
    return (
      <Component
        {...props}
        ref={tracker.id}
        key={tracker.id}
        onEdit={this.onEdit.bind(this, tracker)}
        onRemove={this.onRemove.bind(this, tracker)}
        onTap={this.onTap.bind(this, tracker)}
        onTick={this.onTick.bind(this, tracker)}
        onUndo={this.onUndo.bind(this, tracker)}
        onStart={this.onStart.bind(this, tracker)}
        onStop={this.onStop.bind(this, tracker)}
        onTrackerChange={::this.onTrackerChange}
        tracker={tracker}
      />
    );
  }
};
