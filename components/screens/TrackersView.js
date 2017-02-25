'use strict';

import React, { Component } from 'react';

import { StyleSheet, View, Animated } from 'react-native';

import { connect } from 'react-redux';

import moment from 'moment';

import { NavCancelButton, NavAcceptButton } from '../nav/buttons';

import Animation from '../animation/Animation';

import ScreenView from './ScreenView';

import TrackerCal from '../trackers/TrackerCal';

import Trackers from '../trackers/Trackers';

import {
  tickTracker,
  removeTracker,
  updateTracker,
  undoLastTick,
  updateLastTick,
  updateCalendar,
  completeChange,
  startTracker,
  stopTracker,
} from '../../model/actions';

import { commonStyles } from '../styles/common';

import { caller } from '../../utils/lang';

class TrackersView extends ScreenView {
  constructor(props) {
    super(props);

    this.state = {
      current: props.trackers.get(0),
      changedTracker: null,
    };
  }

  shouldComponentUpdate(props, state) {
    return this.props.trackers !== props.trackers ||
      this.props.ticks !== props.ticks ||
      this.props.todayMs !== props.todayMs;
  }

  get content() {
    return (
      <Animated.View style={commonStyles.flexFilled}>
        <TrackerCal
          ref="calendar"
          {...this.props}
          style={commonStyles.absFilled}
          onMonthChanged={::this._onMonthChanged}
        />
        <Trackers
          ref="trackers"
          {...this.props}
          style={commonStyles.absFilled}
          onRemove={::this._onRemove}
          onRemoveCompleted={::this._onRemoveCompleted}
          onEdit={::this._onEdit}
          onSaveCompleted={::this._onSaveCompleted}
          onSwiperScaleMove={::this._onSwiperScaleMove}
          onSwiperMoveDown={::this._onSwiperMoveDown}
          onSwiperMoveDownStart={::this._onSwiperMoveDownStart}
          onTrackerChange={::this._onTrackerChange}
          onSlideChange={::this._onSlideChange}
        />
      </Animated.View>
    );
  }

  _onSlideChange(index: number, previ: number) {
    this.setState({
      current: this.props.trackers.get(index),
    });
    caller(this.props.onSlideChange, index, previ);
  }

  _onRemove(tracker: Tracker) {
    if (this.state.active) return;

    this.setState({ active: true });
    this.props.onRemove(tracker);
  }

  _onRemoveCompleted(index: number) {
    this.setState({ active: false });
    caller(this.props.onRemoveCompleted, index);
  }

  _saveEdit() {
    if (Animation.on) return;

    const { changedTracker, current } = this.state;
    this.setState({ active: true });
    this.props.onUpdate(changedTracker || current);
  }

  _onSaveCompleted(index) {
    this.setState({
      active: false,
      changedTracker: null,
    });
    caller(this.props.onSaveCompleted, index);
  }

  _getCancelBtn(onPress) {
    return <NavCancelButton onPress={this::onPress} />;
  }

  _getAcceptBtn(onPress) {
    return <NavAcceptButton onPress={this::onPress} />;
  }

  _setEditTrackerBtns() {
    const { navBar } = this.context;

    navBar.setTitle('Edit Tracker');
    navBar.setButtons(
      this._getCancelBtn(this._cancelEdit),
      this._getAcceptBtn(this._saveEdit),
    );
  }

  _onSwiperScaleMove(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  _onSwiperMoveDown(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(1 - dv);
    this.refs.calendar.setShown(dv);
  }

  _onSwiperMoveDownStart() {
    const { current } = this.state;
    const dateMs = moment().valueOf();
    const startDateMs = time.subtractMonth(dateMs);
    const endDateMs = time.addMonth(dateMs);
    this.props.onCalendarUpdate(current, dateMs, startDateMs, endDateMs);
  }

  _onMonthChanged(date) {
    const { current } = this.state;
    const dateMs = date.valueOf();
    const startDateMs = time.subtractMonth(dateMs);
    const endDateMs = time.addMonth(dateMs);
    this.props.onCalendarUpdate(current, dateMs, startDateMs, endDateMs);
  }

  // Edit tracker events.

  _cancelEdit() {
    if (Animation.on) return;

    this.refs.trackers.cancelEdit();
  }

  _onEdit() {
    if (Animation.on) return;

    this._setEditTrackerBtns();
  }

  _onTrackerChange(tracker: Tracker) {
    this.setState({
      changedTracker: tracker,
    });
  }
}

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired,
};

export default connect(
  state => {
    return {
      trackers: state.trackers.trackers,
      addIndex: state.trackers.addIndex,
      removeIndex: state.trackers.removeIndex,
      updateIndex: state.trackers.updateIndex,
      ticks: state.trackers.ticks || [],
      todayMs: state.trackers.todayMs,
      dateMs: state.trackers.dateMs,
    };
  },
  (dispatch, props) => {
    return {
      onCalendarUpdate: (tracker, dateMs, startDateMs, endDateMs) =>
        dispatch(updateCalendar(tracker, dateMs, startDateMs, endDateMs)),
      onRemove: tracker => dispatch(removeTracker(tracker)),
      onUpdate: tracker => dispatch(updateTracker(tracker)),
      onTick: (tracker, value, data) =>
        dispatch(tickTracker(tracker, value, data)),
      onStart: tracker => dispatch(startTracker(tracker)),
      onProgress: (tracker, value, data) =>
        dispatch(updateLastTick(tracker, value, data)),
      onStop: tracker => dispatch(stopTracker(tracker)),
      onUndo: (tracker, value) => dispatch(undoLastTick(tracker)),
      onAddCompleted: index => {
        dispatch(completeChange(index));
        caller(props.onAddCompleted, index);
      },
      onRemoveCompleted: index => {
        dispatch(completeChange(index));
        caller(props.onRemoveCompleted, index);
      },
      onSaveCompleted: index => {
        dispatch(completeChange(index));
        caller(props.onSaveCompleted, index);
      },
      dispatch,
    };
  },
  null,
  { withRef: true },
)(TrackersView);
