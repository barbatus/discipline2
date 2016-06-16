'use strict';

import React, { Component } from 'react';

import { Animated } from 'react-native';

import GoalTrackerSlide from './slides/GoalTrackerSlide';
import CounterSlide from './slides/CounterSlide';
import SumTrackerSlide from './slides/SumTrackerSlide';

import { TrackerType } from '../../depot/consts';

export default class TrackerRenderer extends Component {
  constructor(props) {
    super(props);

    this._opacity = new Animated.Value(0);
  }

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

  renderTracker(tracker: Object, scale: Number) {
    let type = tracker.type;
    switch (type) {
      case TrackerType.GOAL_TRACKER:
        return (
          <GoalTrackerSlide
            ref={tracker.id}
            key={tracker.id}
            scale={scale}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
      case TrackerType.COUNTER:
        return (
          <CounterSlide
            ref={tracker.id}
            key={tracker.id}
            scale={scale}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
      case TrackerType.SUM:
        return (
          <SumTrackerSlide
            ref={tracker.id}
            key={tracker.id}
            scale={scale}
            onIconEdit={this.props.onIconEdit}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            tracker={tracker}
          />
        );
    }
  }
};
