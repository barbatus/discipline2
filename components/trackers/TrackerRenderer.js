'use strict';

import React, { PureComponent } from 'react';

import { Animated, StyleSheet, InteractionManager } from 'react-native';

import { extend } from 'lodash';

import GoalTrackerSlide from './slides/GoalTrackerSlide';

import CounterSlide from './slides/CounterSlide';

import SumTrackerSlide from './slides/SumTrackerSlide';

import StopWatchTrackerSlide from './slides/StopWatchTrackerSlide';

import DistanceTrackerSlide from './slides/DistanceTrackerSlide';

import { TrackerType } from '../../depot/consts';

import { caller } from '../../utils/lang';

// TODO: get rid of it once we get rid of refs.
class TrackerWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
    this.onTap = ::this.onTap;
    this.onTick = ::this.onTick;
    this.onUndo = ::this.onUndo;
    this.onStart = ::this.onStart;
    this.onStop = ::this.onStop;
  }

  onEdit(...args) {
    const { onEdit, tracker } = this.props;
    caller(onEdit, tracker, ...args);
  }

  onRemove(...args) {
    const { onRemove, tracker } = this.props;
    caller(onRemove, tracker, ...args);
  }

  onTap(...args) {
    const { onTap, tracker } = this.props;
    caller(onTap, tracker, ...args);
  }

  onTick(...args) {
    const { onTick, tracker } = this.props;
    caller(onTick, tracker, ...args);
  }

  onUndo(...args) {
    const { onUndo, tracker } = this.props;
    caller(onUndo, tracker, ...args);
  }

  onStart(...args) {
    const { onStart, tracker } = this.props;
    caller(onStart, tracker, ...args);
  }

  onStop(...args) {
    const { onStop, tracker } = this.props;
    caller(onStop, tracker, ...args);
  }

  showEdit(...args) {
    this.refs.tracker.showEdit(...args);
  }

  cancelEdit(...args) {
    this.refs.tracker.cancelEdit(...args);
  }

  shake() {
    this.refs.tracker.shake();
  }

  collapse(...args) {
    this.refs.tracker.collapse(...args);
  }

  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, {
      ...rest,
      ref: 'tracker',
      onEdit: this.onEdit,
      onRemove: this.onRemove,
      onTap: this.onTap,
      onTick: this.onTick,
      onUndo: this.onUndo,
      onStart: this.onStart,
      onStop: this.onStop,
    });
  }
}

export default class TrackerRenderer extends PureComponent {
  _opacity = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      trackers: props.trackers,
    };
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
    this.onTap = ::this.onTap;
    this.onTick = ::this.onTick;
    this.onUndo = ::this.onUndo;
    this.onStart = ::this.onStart;
    this.onStop = ::this.onStop;
    this.onTrackerChange = ::this.onTrackerChange;
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

  componentWillReceiveProps(props) {
    if (this.props.trackers !== props.trackers) {
      this.state.trackers = props.trackers;
    }
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
    return this.renderTrackerInternal(tracker, 1.0, true, true, {
      onProgress: this.onProgress.bind(this, tracker),
    });
  }

  renderScaledTracker(tracker: Tracker, scale: number, responsive: boolean) {
    check.assert.number(scale);
    check.assert.boolean(responsive);

    return this.renderTrackerInternal(tracker, scale, responsive, false);
  }

  renderTrackerInternal(
    tracker: Tracker,
    scale: number,
    responsive: boolean,
    editable: boolean,
    props: Object,
  ) {
    const trackProps = extend({ responsive, editable, scale }, props);
    switch (tracker.type) {
      case TrackerType.GOAL:
        return this.renderSlide(GoalTrackerSlide, tracker, trackProps);
      case TrackerType.COUNTER:
        return this.renderSlide(CounterSlide, tracker, trackProps);
      case TrackerType.SUM:
        return this.renderSlide(SumTrackerSlide, tracker, trackProps);
      case TrackerType.STOPWATCH:
        return this.renderSlide(StopWatchTrackerSlide, tracker, trackProps);
      case TrackerType.DISTANCE:
        return this.renderSlide(DistanceTrackerSlide, tracker, trackProps);
    }
  }

  renderSlide(Component, tracker: Tracker, props: Object) {
    return (
      <TrackerWrapper
        {...props}
        component={Component}
        ref={tracker.id}
        key={tracker.id}
        onEdit={this.onEdit}
        onRemove={this.onRemove}
        onTap={this.onTap}
        onTick={this.onTick}
        onUndo={this.onUndo}
        onStart={this.onStart}
        onStop={this.onStop}
        onTrackerChange={this.onTrackerChange}
        tracker={tracker}
      />
    );
  }
}
