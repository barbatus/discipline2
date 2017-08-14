'use strict';

import React, { PureComponent } from 'react';

import { StyleSheet, View, Animated } from 'react-native';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  NavCancelButton,
  NavAcceptButton,
  NavLeftButton,
  NavRightButton,
} from '../nav/buttons';

import Animation from '../animation/Animation';

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

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const styles = StyleSheet.create({
  navTitle: { fontSize: 19, fontWeight: '200' },
});

class TrackersView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      current: props.trackers.get(0),
      changedTracker: null,
    };
    this._onEdit = ::this._onEdit;
    this._onRemove = ::this._onRemove;
    this._onRemoveCompleted = ::this._onRemoveCompleted;
    this._onSaveCompleted = ::this._onSaveCompleted;
    this._onSwiperScaleMove = ::this._onSwiperScaleMove;
    this._onSwiperMoveDown = ::this._onSwiperMoveDown;
    this._onSwiperMoveDownStart = ::this._onSwiperMoveDownStart;
    this._onTrackerChange = ::this._onTrackerChange;
    this._onSlideChange = ::this._onSlideChange;
    this._onMonthChanged = ::this._onMonthChanged;
    this._onNextMonth = ::this._onNextMonth;
    this._onPrevMonth = ::this._onPrevMonth;
  }

  render() {
    const { style, onMoveUp } = this.props;
    return (
      <Animated.View style={[commonStyles.flexFilled, style]}>
        <TrackerCal
          ref="calendar"
          {...this.props}
          style={[commonStyles.absFilled, { top: 0 }]}
          onMonthChanged={this._onMonthChanged}
        />
        <Trackers
          ref="trackers"
          {...this.props}
          style={commonStyles.flexFilled}
          onRemove={this._onRemove}
          onRemoveCompleted={this._onRemoveCompleted}
          onEdit={this._onEdit}
          onSaveCompleted={this._onSaveCompleted}
          onSwiperScaleMove={this._onSwiperScaleMove}
          onSwiperMoveDown={this._onSwiperMoveDown}
          onSwiperMoveDownStart={this._onSwiperMoveDownStart}
          onSwiperMoveUpStart={onMoveUp}
          onTrackerChange={this._onTrackerChange}
          onSlideChange={this._onSlideChange}
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

  _setCalendarBtns() {
    const { navBar } = this.context;
    navBar.setButtons(
      <NavLeftButton icon="back" onPress={this._onPrevMonth} />,
      <NavRightButton icon="next_" onPress={this._onNextMonth} />,
    );
  }

  _onNextMonth() {
    const { dateMs } = this.props;
    const { current } = this.state;
    const nextMonthMs = time.getNextMonthDateMs(dateMs);
    this._setNavBatMonth(nextMonthMs);

    const startDateMs = time.subtractMonth(nextMonthMs);
    const endDateMs = time.addMonth(nextMonthMs);
    this.props.onCalendarUpdate(current, nextMonthMs, startDateMs, endDateMs);
  }

  _onPrevMonth() {
    const { dateMs } = this.props;
    const { current } = this.state;
    const nextMonthMs = time.getPrevMonthDateMs(dateMs);
    this._setNavBatMonth(nextMonthMs);

    const startDateMs = time.subtractMonth(nextMonthMs);
    const endDateMs = time.addMonth(nextMonthMs);
    this.props.onCalendarUpdate(current, nextMonthMs, startDateMs, endDateMs);
  }

  _onSwiperScaleMove(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  _onSwiperMoveDown(dv: number) {
    this.refs.calendar.setShown(dv);
  }

  _onSwiperMoveDownStart() {
    const { current } = this.state;
    const monthDateMs = time.getCurMonthDateMs();
    this._setCalendarBtns();
    this._setNavBatMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
  }

  _onMonthChanged(monthDateMs) {
    const { current } = this.state;
    this._setNavBatMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
  }

  _setNavBatMonth(monthDateMs) {
    const date = moment(monthDateMs);
    const monthName = MONTH_NAMES[date.month()];
    const { navBar } = this.context;
    navBar.setTitle(monthName, styles.navTitle);
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
