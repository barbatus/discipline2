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
import DistanceTrackerSlide from './slides/DistanceTrackerSlide';

import {TrackerType} from '../../depot/consts';

import {caller} from '../../utils/lang';

export default class TrackerRenderer extends Component {
  _opacity = new Animated.Value(0);

  constructor(props) {
    super(props);

    this.state = {
      trackers: []
    };
  }

  setTrackers(trackers, callback) {
    this.setState({
      trackers
    }, callback);
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity.setValue(value);
  }

  hide(callback) {
    this.opacity = 0;
  }

  show(index, callback) {
    this.opacity = 1;
  }

  get shown() {
    return this.opacity._value === 1;
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

  renderTracker(tracker: Object,
                editable: boolean = true,
                scale: number = 1) {
    let newSlide = (Component) => {
      let { id } = tracker;
      return (
        <Component
          ref={id}
          key={id}
          editable={editable}
          scale={scale}
          onEdit={this.onEdit.bind(this, id)}
          onRemove={this.onRemove.bind(this, id)}
          onTap={this.onTap.bind(this, id)}
          tracker={tracker}
        />
      )
    };

    let type = tracker.type;
    switch (type) {
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
