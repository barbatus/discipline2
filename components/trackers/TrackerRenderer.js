/* eslint react/no-multi-comp: 0 */

import React, { PureComponent } from 'react';
import { Animated, InteractionManager } from 'react-native';
import check from 'check-types';
import PropTypes from 'prop-types';

import { TrackerType } from 'app/depot/consts';
import Tracker from 'app/model/Tracker';
import { caller } from 'app/utils/lang';

import GoalTrackerSlide from './slides/GoalTrackerSlide';
import CounterSlide from './slides/CounterSlide';
import SumTrackerSlide from './slides/SumTrackerSlide';
import StopWatchTrackerSlide from './slides/StopWatchTrackerSlide';
import DistanceTrackerSlide from './slides/DistanceTrackerSlide';

// TODO: get rid of it once we get rid of refs.
class TrackerWrapper extends PureComponent {
  static propTypes = {
    component: PropTypes.func.isRequired,
    responsive: PropTypes.bool.isRequired,
    tracker: PropTypes.instanceOf(Tracker).isRequired,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onTap: PropTypes.func,
    onTick: PropTypes.func,
    onStart: PropTypes.func,
    onStop: PropTypes.func,
    onProgress: PropTypes.func,
    onUndo: PropTypes.func,
  };

  static defaultProps = {
    onEdit: null,
    onRemove: null,
    onTap: null,
    onTick: null,
    onStart: null,
    onStop: null,
    onProgress: null,
    onUndo: null,
  };

  constructor(props) {
    super(props);
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
    this.onTap = ::this.onTap;
    this.onTick = ::this.onTick;
    this.onUndo = ::this.onUndo;
    this.onStart = ::this.onStart;
    this.onStop = ::this.onStop;
    this.onProgress = ::this.onProgress;
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

  onProgress(...args) {
    const { onProgress, tracker } = this.props;
    caller(onProgress, tracker, ...args);
  }

  showEdit(...args) {
    this.tracker.showEdit(...args);
  }

  cancelEdit(...args) {
    this.tracker.cancelEdit(...args);
  }

  shake() {
    this.tracker.shake();
  }

  collapse(...args) {
    this.tracker.collapse(...args);
  }

  render() {
    const { component, responsive, ...rest } = this.props;
    return React.createElement(component, {
      ...rest,
      ref: (el) => (this.tracker = el),
      responsive,
      onEdit: this.onEdit,
      onRemove: this.onRemove,
      onTap: this.onTap,
      onTick: this.onTick,
      onUndo: this.onUndo,
      onStart: this.onStart,
      onStop: this.onStop,
      onProgress: responsive ? this.onProgress : null,
    });
  }
}

export default class TrackerRenderer extends PureComponent {
  static propTypes = {
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onTap: PropTypes.func,
    onTick: PropTypes.func,
    onStart: PropTypes.func,
    onStop: PropTypes.func,
    onProgress: PropTypes.func,
    onUndo: PropTypes.func,
    onTrackerEdit: PropTypes.func,
    trackers: PropTypes.arrayOf(PropTypes.instanceOf(Tracker)).isRequired,
    enabled: PropTypes.bool.isRequired,
    responsive: PropTypes.bool,
  };

  static defaultProps = {
    onEdit: null,
    onRemove: null,
    onTap: null,
    onTick: null,
    onStart: null,
    onStop: null,
    onProgress: null,
    onUndo: null,
    onTrackerEdit: null,
    responsive: true,
  };

  inOpacity = new Animated.Value(0);

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
    this.onProgress = ::this.onProgress;
    this.onTrackerEdit = ::this.onTrackerEdit;
  }

  componentWillReceiveProps(props) {
    if (this.props.trackers !== props.trackers) {
      this.state.trackers = props.trackers;
    }
    if (this.props.enabled !== props.enabled) {
      this.state.enabled = props.enabled;
    }
  }

  get opacity() {
    return this.inOpacity;
  }

  set opacity(value) {
    this.inOpacity.setValue(value);
  }

  get shown() {
    return this.inOpacity._value === 1;
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

  onTick(tracker: Tracker, value: number, data: any) {
    caller(this.props.onTick, tracker, value, data);
  }

  onStart(tracker: Tracker, value: number, data: any) {
    caller(this.props.onStart, tracker, value, data);
  }

  onStop(tracker: Tracker, value: number, data: any) {
    caller(this.props.onStop, tracker, value, data);
  }

  onProgress(tracker: Tracker, value: number, data: any, progress: any) {
    InteractionManager.runAfterInteractions(() => (
      caller(this.props.onProgress, tracker, value, data, progress)
    ));
  }

  onUndo(tracker: Tracker) {
    caller(this.props.onUndo, tracker);
  }

  onTrackerEdit(values) {
    caller(this.props.onTrackerEdit, values);
  }

  hide() {
    this.opacity = 0;
  }

  show() {
    this.opacity = 1;
  }

  renderTracker(tracker: Tracker, metric: boolean) {
    const { enabled } = this.props;
    return this.renderTrackerInternal(tracker, 1.0, true, enabled, metric);
  }

  renderScaledTracker(tracker: Tracker, scale: number, responsive: boolean, metric: boolean) {
    check.assert.number(scale);
    check.assert.boolean(responsive);

    return this.renderTrackerInternal(tracker, scale, responsive, false, metric);
  }

  renderTrackerInternal(
    tracker: Tracker,
    scale: number,
    responsive: boolean,
    editable: boolean,
    metric: boolean,
  ) {
    const trackProps = { responsive, editable, scale };
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
        return this.renderSlide(DistanceTrackerSlide, tracker, { ...trackProps, metric });
      default:
        throw new Error('Tracker type is not supported');
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
        onProgress={this.onProgress}
        onTrackerEdit={this.onTrackerEdit}
        tracker={tracker}
      />
    );
  }
}
