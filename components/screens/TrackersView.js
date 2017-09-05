import React, { PureComponent } from 'react';

import { StyleSheet, View, Animated, InteractionManager } from 'react-native';

import { connect } from 'react-redux';

import { submit } from 'redux-form';

import moment from 'moment';

import {
  NavCancelButton,
  NavAcceptButton,
  NavLeftButton,
  NavRightButton,
} from '../nav/buttons';

import Animation from '../animation/Animation';

import TrackerCal from '../trackers/TrackerCal';

import TrackersModel from '../../model/Trackers';

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
  static contextTypes = {
    navBar: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      current: props.trackers.get(0),
    };
    this.changedTracker = null;
    this.active = false;
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
    this.onRemoveCompleted = ::this.onRemoveCompleted;
    this.onSaveCompleted = ::this.onSaveCompleted;
    this.onSwiperScaleMove = ::this.onSwiperScaleMove;
    this.onSwiperMoveDown = ::this.onSwiperMoveDown;
    this.onSwiperMoveDownStart = ::this.onSwiperMoveDownStart;
    this.onTrackerEdit = ::this.onTrackerEdit;
    this.onSlideChange = ::this.onSlideChange;
    this.onMonthChanged = ::this.onMonthChanged;
    this.onNextMonth = ::this.onNextMonth;
    this.onPrevMonth = ::this.onPrevMonth;
  }

  render() {
    const { style, onMoveUp } = this.props;
    const { current } = this.state;
    return (
      <Animated.View style={[commonStyles.flexFilled, style]}>
        <TrackerCal
          ref="calendar"
          {...this.props}
          tracker={current}
          style={[commonStyles.absFilled, { top: 0 }]}
          onMonthChanged={this.onMonthChanged}
        />
        <Trackers
          ref="trackers"
          {...this.props}
          style={commonStyles.flexFilled}
          onRemove={this.onRemove}
          onRemoveCompleted={this.onRemoveCompleted}
          onEdit={this.onEdit}
          onSaveCompleted={this.onSaveCompleted}
          onSwiperScaleMove={this.onSwiperScaleMove}
          onSwiperMoveDown={this.onSwiperMoveDown}
          onSwiperMoveDownStart={this.onSwiperMoveDownStart}
          onSwiperMoveUpStart={onMoveUp}
          onTrackerEdit={this.onTrackerEdit}
          onSlideChange={this.onSlideChange}
        />
      </Animated.View>
    );
  }

  onSlideChange(index: number, previ: number) {
    this.setState({
      current: this.props.trackers.get(index),
    });
    caller(this.props.onSlideChange, index, previ);
  }

  onRemove(tracker: Tracker) {
    if (this.active) return;

    this.active = true;
    this.props.onRemove(tracker);
  }

  onRemoveCompleted(index: number) {
    this.active = false;
    caller(this.props.onRemoveCompleted, index);
  }

  saveEdit() {
    if (Animation.on) return;

    this.active = true;
    const { current } = this.state;
    const { dispatch } = this.props;
    dispatch(submit('trackerForm'));
  }

  onSaveCompleted(index) {
    this.active = false;
    caller(this.props.onSaveCompleted, index);
  }

  getCancelBtn(onPress) {
    return <NavCancelButton onPress={this::onPress} />;
  }

  getAcceptBtn(onPress) {
    return <NavAcceptButton onPress={this::onPress} />;
  }

  setEditTrackerBtns() {
    const { navBar } = this.context;

    navBar.setTitle('Edit Tracker');
    navBar.setButtons(
      this.getCancelBtn(this.cancelEdit),
      this.getAcceptBtn(this.saveEdit),
    );
  }

  setCalendarBtns() {
    const { navBar } = this.context;
    navBar.setButtons(
      <NavLeftButton icon="back" onPress={this.onPrevMonth} />,
      <NavRightButton icon="next_" onPress={this.onNextMonth} />,
    );
  }

  onNextMonth() {
    const { dateMs } = this.props;
    const { current } = this.state;
    const monthMs = time.getNextMonthDateMs(dateMs);
    this.setNavBarMonth(monthMs);

    const startMs = time.subtractMonth(monthMs);
    const endMs = time.addMonth(monthMs);
    this.refs.calendar.scrollToNextMonth();
  }

  onPrevMonth() {
    const { dateMs } = this.props;
    const { current } = this.state;
    const monthMs = time.getPrevMonthDateMs(dateMs);
    this.setNavBarMonth(monthMs);

    const startMs = time.subtractMonth(monthMs);
    const endMs = time.addMonth(monthMs);
    this.refs.calendar.scrollToPrevMonth();
  }

  onSwiperScaleMove(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  onSwiperMoveDown(dv: number) {
    this.refs.calendar.setShown(dv);
  }

  onSwiperMoveDownStart() {
    const { current } = this.state;
    const monthDateMs = time.getCurMonthDateMs();
    this.setCalendarBtns();
    this.setNavBarMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    InteractionManager.runAfterInteractions(() =>
      this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs)
    );
  }

  onMonthChanged(monthDateMs) {
    const { current } = this.state;
    this.setNavBarMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
  }

  setNavBarMonth(monthDateMs) {
    const date = moment(monthDateMs);
    const monthName = `${MONTH_NAMES[date.month()]}, ${date.year()}`;
    const { navBar } = this.context;
    navBar.setTitle(monthName, styles.navTitle);
  }

  // Edit tracker events.

  cancelEdit() {
    if (Animation.on) return;

    this.refs.trackers.cancelEdit();
  }

  onEdit() {
    if (Animation.on) return;

    this.setEditTrackerBtns();
  }

  onTrackerEdit(tracker) {
    const { current } = this.state;
    this.props.onUpdate(TrackersModel.create({
      ...current,
      ...tracker,
    }));
  }
}

export default connect(
  (state) => ({
    ...state.trackers,
    ticks: state.trackers.ticks || [],
  }),
  (dispatch, props) => ({
    onCalendarUpdate: (tracker, dateMs, startDateMs, endDateMs) =>
      dispatch(updateCalendar(tracker, dateMs, startDateMs, endDateMs)),
    onRemove: (tracker) => dispatch(removeTracker(tracker)),
    onUpdate: (tracker) => dispatch(updateTracker(tracker)),
    onTick: (tracker, value, data) =>
      dispatch(tickTracker(tracker, value, data)),
    onStart: (tracker) => dispatch(startTracker(tracker)),
    onProgress: (tracker, value, data) =>
      dispatch(updateLastTick(tracker, value, data)),
    onStop: (tracker) => dispatch(stopTracker(tracker)),
    onUndo: (tracker, value) => dispatch(undoLastTick(tracker)),
    onAddCompleted: (index) => {
      dispatch(completeChange(index));
      caller(props.onAddCompleted, index);
    },
    onRemoveCompleted: (index) => {
      dispatch(completeChange(index));
      caller(props.onRemoveCompleted, index);
    },
    onSaveCompleted: (index) => {
      dispatch(completeChange(index));
      caller(props.onSaveCompleted, index);
    },
    dispatch,
  }),
  null,
  { withRef: true },
)(TrackersView);
