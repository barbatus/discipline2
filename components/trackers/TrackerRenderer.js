'use strict';

import React, {Component} from 'react';

import {
  Animated,
  StyleSheet
} from 'react-native';

import GoalTrackerSlide from './slides/GoalTrackerSlide';
import CounterSlide from './slides/CounterSlide';
import SumTrackerSlide from './slides/SumTrackerSlide';
import StopWatchTrackerSlide from './slides/StopWatchTrackerSlide';

import {TrackerType} from '../../depot/consts';

import {caller} from '../../utils/lang';

export default class TrackerRenderer extends Component {
  _opacity = new Animated.Value(0);

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity.setValue(value);
  }

  hide(callback) {
    this._opacity.setValue(0);
  }

  show(index, callback) {
    this._opacity.setValue(1);
  }

  get shown() {
    return this._opacity._value === 1;
  }

  onEdit(trackId) {
    caller(this.props.onEdit, trackId);
  }

  onRemove(trackId) {
    caller(this.props.onRemove, trackId);
  }

  onTap(trackId) {
    caller(this.props.onTap, trackId);
  }

  renderTracker(tracker: Object, editable: boolean = true, style) {
    let newSlide = (Component) => {
      let id = tracker.id;
      return (
        <Component
          ref={id}
          key={id}
          editable={editable}
          style={StyleSheet.create(style)}
          onEdit={this.onEdit.bind(this, id)}
          onRemove={this.onRemove.bind(this, id)}
          onTap={this.onTap.bind(this, id)}
          tracker={tracker}
        />
      )
    };

    let type = tracker.type;
    switch (type) {
      case TrackerType.GOAL_TRACKER:
        return newSlide(GoalTrackerSlide);
      case TrackerType.COUNTER:
        return newSlide(CounterSlide);
      case TrackerType.SUM:
        return newSlide(SumTrackerSlide);
      case TrackerType.STOP_WATCH:
        return newSlide(StopWatchTrackerSlide);
    }
  }
};
