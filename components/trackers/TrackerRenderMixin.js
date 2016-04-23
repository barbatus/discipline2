'use strict';

const React = require('react-native');

const GoalTrackerSlide = require('./slides/GoalTrackerSlide');
const CounterSlide = require('./slides/CounterSlide');
const SumTrackerSlide = require('./slides/SumTrackerSlide');

const { TrackerType } = require('../../depot/consts');

let TrackerRenderMixin = {
  renderTracker(tracker: Object, scale: Number) {
    let type = tracker.type;
    switch (type) {
      case TrackerType.GOAL_TRACKER:
        return (
          <GoalTrackerSlide
            ref={tracker._id}
            key={tracker._id}
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
            ref={tracker._id}
            key={tracker._id}
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
            ref={tracker._id}
            key={tracker._id}
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

module.exports = TrackerRenderMixin;
