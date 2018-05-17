import React, { PureComponent } from 'react';
import { StyleSheet, Animated, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { submit } from 'redux-form';

import moment from 'moment';
import { List } from 'immutable';

import registry, { DlgType } from 'app/components/dlg/registry';
import TrackersModel from 'app/model/Trackers';
import { Tick } from 'app/model/Tracker';
import time from 'app/time/utils';
import { caller } from 'app/utils/lang';

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
} from 'app/model/actions';

import {
  NavCancelButton,
  NavAcceptButton,
  NavLeftButton,
  NavRightButton,
} from '../nav/buttons';

import Animation from '../animation/Animation';
import TrackerCal from '../trackers/TrackerCal';
import Trackers from '../trackers/Trackers';
import { commonStyles } from '../styles/common';

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
    navBar: PropTypes.object.isRequired,
  };

  static propTypes = {
    ticks: PropTypes.arrayOf(PropTypes.instanceOf(Tick)),
    trackers: PropTypes.instanceOf(List),
    dispatch: PropTypes.func.isRequired,
    onRemoveCompleted: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCalendarUpdate: PropTypes.func.isRequired,
    onSaveCompleted: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onSlideChange: PropTypes.func,
    onMoveUp: PropTypes.func,
    onCancel: PropTypes.func,
    dateMs: PropTypes.number.isRequired,
    style: Animated.View.propTypes.style,
  };

  static defaultProps = {
    trackers: List.of(),
    ticks: null,
    onSlideChange: null,
    onMoveUp: null,
    onCancel: null,
    style: null,
  };

  calcOpacity = new Animated.Value(0);
  isActive = false;

  constructor(props) {
    super(props);

    this.state = {
      current: props.trackers.get(0),
      selDateMs: null,
    };
    this.onEdit = ::this.onEdit;
    this.onRemove = ::this.onRemove;
    this.onRemoveCompleted = ::this.onRemoveCompleted;
    this.onSaveCompleted = ::this.onSaveCompleted;
    this.onSwiperScaleMove = ::this.onSwiperScaleMove;
    this.onSwiperScaleDone = ::this.onSwiperScaleDone;
    this.onSwiperShown = ::this.onSwiperShown;
    this.onSwiperMoveDown = ::this.onSwiperMoveDown;
    this.onSwiperMoveDownStart = ::this.onSwiperMoveDownStart;
    this.onSwiperMoveUpDone = ::this.onSwiperMoveUpDone;
    this.onTrackerEdit = ::this.onTrackerEdit;
    this.onSlideChange = ::this.onSlideChange;
    this.onMonthChanged = ::this.onMonthChanged;
    this.onTooltipClick = ::this.onTooltipClick;
    this.onDateSelect = ::this.onDateSelect;
    this.onNextMonth = ::this.onNextMonth;
    this.onPrevMonth = ::this.onPrevMonth;
    this.cancelEdit = ::this.cancelEdit;
    this.saveEdit = ::this.saveEdit;
  }

  componentWillReceiveProps({ trackers }) {
    if (this.props.trackers !== trackers) {
      const { current } = this.state;
      if (!current) {
        this.setState({
          current: trackers.get(0),
        });
      }
    }
  }

  getCancelBtn(onPress) {
    return <NavCancelButton onPress={onPress} />;
  }

  getAcceptBtn(onPress) {
    return <NavAcceptButton onPress={onPress} />;
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

  setNavBarMonth(monthDateMs) {
    const date = moment(monthDateMs);
    const monthName = `${MONTH_NAMES[date.month()]}, ${date.year()}`;
    const { navBar } = this.context;
    navBar.setTitle(monthName, styles.navTitle);
  }

  onSlideChange(index: number, previ: number, animated: boolean) {
    this.setState({
      current: this.props.trackers.get(index),
    });
    caller(this.props.onSlideChange, index, previ, animated);
  }

  onRemove(tracker) {
    if (this.isActive) return;

    this.isActive = true;
    this.props.onRemove(tracker);
  }

  onRemoveCompleted(index: number) {
    this.isActive = false;
    caller(this.props.onRemoveCompleted, index);
  }

  onNextMonth() {
    const { dateMs } = this.props;
    const monthMs = time.getNextMonthDateMs(dateMs);
    this.setNavBarMonth(monthMs);

    this.calendar.scrollToNextMonth();
  }

  onPrevMonth() {
    const { dateMs } = this.props;
    const monthMs = time.getPrevMonthDateMs(dateMs);
    this.setNavBarMonth(monthMs);

    this.calendar.scrollToPrevMonth();
  }

  onSwiperScaleMove(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  onSwiperScaleDone() {
    const { navBar } = this.context;
    navBar.setOpacity(0);
    navBar.setDisabled(true);
  }

  onSwiperShown() {
    const { navBar } = this.context;
    navBar.setDisabled(false);
  }

  onSwiperMoveDown(dv: number) {
    this.calcOpacity.setValue(dv);
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

  onSwiperMoveUpDone() {
    this.setState({ selDateMs: null });
  }

  onMonthChanged(monthDateMs) {
    const { current } = this.state;
    this.setNavBarMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
  }

  onTooltipClick() {
    const dlg = registry.get(DlgType.TICKS);
    const { current } = this.state;
    dlg.show(this.props.ticks, current.type);
  }

  onDateSelect(dateMs: number) {
    this.setState({ selDateMs: dateMs });
  }

  onSaveCompleted(index) {
    this.isActive = false;
    caller(this.props.onSaveCompleted, index);
  }

  onEdit() {
    this.setEditTrackerBtns();
  }

  onTrackerEdit(tracker) {
    const { current } = this.state;
    this.props.onUpdate(TrackersModel.create({
      ...current,
      ...tracker,
    }));
  }

  saveEdit() {
    // Animation.on is animation to be done after onSaveCompleted.
    if (this.isActive || Animation.on) return;

    this.isActive = true;
    const { dispatch } = this.props;
    dispatch(submit('trackerForm'));
  }

  // Edit tracker events.

  cancelEdit() {
    if (this.isActive) return;

    this.isActive = true;
    this.trackers.cancelEdit(() =>
      (this.isActive = false));
  }

  render() {
    const { style, onMoveUp, onCancel } = this.props;
    const { current, selDateMs } = this.state;
    const calcStyle = [commonStyles.absFilled, { top: 0 }, { opacity: this.calcOpacity }];

    return (
      <Animated.View style={[commonStyles.flexFilled, style]}>
        <TrackerCal
          ref={(el) => (this.calendar = el)}
          {...this.props}
          trackerType={current ? current.type : null}
          selDateMs={selDateMs}
          style={calcStyle}
          onMonthChanged={this.onMonthChanged}
          onDateSelect={this.onDateSelect}
          onTooltipClick={this.onTooltipClick}
        />
        <Trackers
          ref={(el) => (this.trackers = el)}
          {...this.props}
          style={commonStyles.flexFilled}
          onRemove={this.onRemove}
          onRemoveCompleted={this.onRemoveCompleted}
          onEdit={this.onEdit}
          onCancel={onCancel}
          onSaveCompleted={this.onSaveCompleted}
          onSwiperScaleMove={this.onSwiperScaleMove}
          onSwiperScaleDone={this.onSwiperScaleDone}
          onSwiperMoveUpDone={this.onSwiperMoveUpDone}
          onSwiperShown={this.onSwiperShown}
          onSwiperMoveDown={this.onSwiperMoveDown}
          onSwiperMoveDownStart={this.onSwiperMoveDownStart}
          onSwiperMoveUpStart={onMoveUp}
          onTrackerEdit={this.onTrackerEdit}
          onSlideChange={this.onSlideChange}
        />
      </Animated.View>
    );
  }
}

export default connect(
  ({ trackers }) => ({
    ...trackers,
    ticks: trackers.ticks,
  }),
  (dispatch, props) => ({
    onCalendarUpdate: (tracker, dateMs, startDateMs, endDateMs) =>
      dispatch(updateCalendar(tracker, dateMs, startDateMs, endDateMs)),
    onRemove: (tracker) => dispatch(removeTracker(tracker)),
    onUpdate: (tracker) => dispatch(updateTracker(tracker)),
    onTick: (tracker, value, data) =>
      dispatch(tickTracker(tracker, value, data)),
    onStart: (tracker, value, data) =>
      dispatch(startTracker(tracker, value, data)),
    onProgress: (tracker, value, data) =>
      dispatch(updateLastTick(tracker, value, data)),
    onStop: (tracker, value, data) =>
      dispatch(stopTracker(tracker, value, data)),
    onUndo: (tracker) => dispatch(undoLastTick(tracker)),
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
)(TrackersView);
