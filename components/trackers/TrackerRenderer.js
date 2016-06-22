'use strict';

import React, { Component } from 'react';

import {
  Animated,
  StyleSheet
} from 'react-native';

import GoalTrackerSlide from './slides/GoalTrackerSlide';
import CounterSlide from './slides/CounterSlide';
import SumTrackerSlide from './slides/SumTrackerSlide';

import { TrackerType } from '../../depot/consts';

import { caller } from '../../utils/lang';

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

  renderTracker(tracker: Object, style) {
    let type = tracker.type;
    let id = tracker.id;
    switch (type) {
      case TrackerType.GOAL_TRACKER:
        return (
          <GoalTrackerSlide
            ref={tracker.id}
            key={tracker.id}
            style={StyleSheet.create(style)}
            onEdit={this.onEdit.bind(this, id)}
            onRemove={this.onRemove.bind(this, id)}
            onTap={this.onTap.bind(this, id)}
            tracker={tracker}
          />
        );
      case TrackerType.COUNTER:
        return (
          <CounterSlide
            ref={tracker.id}
            key={tracker.id}
            style={StyleSheet.create(style)}
            onEdit={this.onEdit.bind(this, id)}
            onRemove={this.onRemove.bind(this, id)}
            onTap={this.onTap.bind(this, id)}
            tracker={tracker}
          />
        );
      case TrackerType.SUM:
        return (
          <SumTrackerSlide
            ref={tracker.id}
            key={tracker.id}
            style={StyleSheet.create(style)}
            onEdit={this.onEdit.bind(this, id)}
            onRemove={this.onRemove.bind(this, id)}
            onTap={this.onTap.bind(this, id)}
            tracker={tracker}
          />
        );
    }
  }
};
