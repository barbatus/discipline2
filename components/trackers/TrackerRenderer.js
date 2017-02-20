'use strict';

import React, {Component} from 'react';

import {
  Animated,
  StyleSheet,
} from 'react-native';

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
    caller(this.props.onProgress, tracker, value, data);
  }

  onUndo(tracker: Tracker) {
    caller(this.props.onUndo, tracker);
  }

  onTrackerChange(tracker: Tracker) {
    caller(this.props.onTrackerChange, tracker);
  }

  _wrapPropCall(prop: string, tracker: Tracker) {
    return (...args) => caller(this.props[prop], tracker, ...args);
  }

  renderTracker(tracker: Tracker, editable: boolean = true, scale: number = 1) {
    const newSlide = (Component) => {
      return (
        <Component
          ref={tracker.id}
          key={tracker.id}
          editable={editable}
          scale={scale}
          onEdit={this.onEdit.bind(this, tracker)}
          onRemove={this.onRemove.bind(this, tracker)}
          onTap={this.onTap.bind(this, tracker)}
          onTick={this.onTick.bind(this, tracker)}
          onUndo={this.onUndo.bind(this, tracker)}
          onProgress={this.onProgress.bind(this, tracker)}
          onStart={this.onStart.bind(this, tracker)}
          onStop={this.onStop.bind(this, tracker)}
          onTrackerChange={::this.onTrackerChange}
          tracker={tracker}
        />
      );
    };

    switch (tracker.type) {
      case TrackerType.GOAL:
        return newSlide(GoalTrackerSlide);
      case TrackerType.COUNTER:
        return newSlide(CounterSlide);
      case TrackerType.SUM:
        return newSlide(SumTrackerSlide);
      case TrackerType.STOPWATCH:
        return newSlide(StopWatchTrackerSlide);
      case TrackerType.DISTANCE:
        return newSlide(DistanceTrackerSlide);
    }
  }
};
