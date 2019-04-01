import React, { PureComponent } from 'react';
import { StyleSheet, Animated, InteractionManager, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
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
    trackers: PropTypes.instanceOf(List).isRequired,
    dispatch: PropTypes.func.isRequired,
    onRemoveCompleted: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCalendarUpdate: PropTypes.func.isRequired,
    onSaveCompleted: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onSlideChange: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDownCancel: PropTypes.func,
    onCancel: PropTypes.func,
    dateMs: PropTypes.number.isRequired,
    style: ViewPropTypes.style,
    app: PropTypes.object.isRequired,
  };

  static defaultProps = {
    ticks: null,
    onSlideChange: null,
    onMoveUp: null,
    onMoveDownCancel: null,
    onCancel: null,
    style: null,
  };

  calcOpacity = new Animated.Value(0);

  isActive = false;

  constructor(props) {
    super(props);

    this.state = {
      current: props.trackers.get(0),
      calShown: false,
    };
    this.onStartEdit = ::this.onStartEdit;
    this.onTrackerEdit = ::this.onTrackerEdit;
    this.onRemove = ::this.onRemove;
    this.onRemoveCompleted = ::this.onRemoveCompleted;
    this.onSaveCompleted = ::this.onSaveCompleted;
    this.onSwiperScaleMove = ::this.onSwiperScaleMove;
    this.onSwiperScaleDone = ::this.onSwiperScaleDone;
    this.onSwiperShown = ::this.onSwiperShown;
    this.onSwiperMoveDown = ::this.onSwiperMoveDown;
    this.onSwiperMoveDownStart = ::this.onSwiperMoveDownStart;
    this.onSlideChange = ::this.onSlideChange;
    this.onMonthChanged = ::this.onMonthChanged;
    this.onTooltipClick = ::this.onTooltipClick;
    this.onNextMonth = ::this.onNextMonth;
    this.onPrevMonth = ::this.onPrevMonth;
    this.cancelEdit = ::this.cancelEdit;
    this.saveEdit = ::this.saveEdit;
    this.onSwiperMoveUpDone = ::this.onSwiperMoveUpDone;
    this.onSwiperMoveDownDone = ::this.onSwiperMoveDownDone;
  }

  static getDerivedStateFromProps({ trackers }, prevState) {
    if (!trackers.size || prevState.current) return null;

    return { current: trackers.get(0) };
  }

  componentDidUpdate({ trackers: prevTrackers }) {
    const { trackers, onAddCompleted } = this.props;
    // Firing onAddCompleted because Trackers is not rendered when no trackers
    if (trackers !== prevTrackers && !prevTrackers.size) {
      window.requestAnimationFrame(onAddCompleted);
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
    const { trackers } = this.props;
    // Resetting current tracker here since waiting
    // for remove animation to be done
    if (!trackers.size) {
      this.setState({ current: null });
    }
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
    InteractionManager.runAfterInteractions(() => {
      this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs)
    });
  }

  onSwiperMoveUpDone() {
    this.setState({ calShown: false });
  }

  onSwiperMoveDownDone() {
    this.setState({ calShown: true });
  }

  onMonthChanged(monthDateMs) {
    const { current } = this.state;
    this.setNavBarMonth(monthDateMs);

    const startDateMs = time.subtractMonth(monthDateMs);
    const endDateMs = time.addMonth(monthDateMs);
    this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
  }

  onTooltipClick(ticks) {
    const dlg = registry.get(DlgType.TICKS);
    const { current } = this.state;
    dlg.show(ticks, current.type);
  }

  onSaveCompleted(index) {
    this.isActive = false;
    caller(this.props.onSaveCompleted, index);
  }

  onStartEdit() {
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
    if (this.isActive) return;

    this.isActive = true;
    const { dispatch } = this.props;
    dispatch(submit('trackerForm'));
  }

  // Edit tracker events.

  cancelEdit() {
    this.trackers.cancelEdit();
  }

  render() {
    const { style, app, onMoveUp, onMoveDownCancel, onCancel } = this.props;
    const { current, calShown } = this.state;
    const calcStyle = { ...commonStyles.absFilled, top: 0, opacity: this.calcOpacity };

    if (!current) { return null; }

    return (
      <Animated.View style={[commonStyles.flexFilled, style]}>
        <TrackerCal
          ref={(el) => (this.calendar = el)}
          {...this.props}
          shown={calShown}
          metric={app.props.metric}
          trackerType={current ? current.type : null}
          style={calcStyle}
          onMonthChanged={this.onMonthChanged}
          onTooltipClick={this.onTooltipClick}
        />
        <Trackers
          ref={(el) => (this.trackers = el)}
          {...this.props}
          style={commonStyles.flexFilled}
          metric={app.props.metric}
          onRemove={this.onRemove}
          onRemoveCompleted={this.onRemoveCompleted}
          onEdit={this.onStartEdit}
          onCancel={onCancel}
          onSaveCompleted={this.onSaveCompleted}
          onSwiperScaleMove={this.onSwiperScaleMove}
          onSwiperScaleDone={this.onSwiperScaleDone}
          onSwiperShown={this.onSwiperShown}
          onSwiperMoveDown={this.onSwiperMoveDown}
          onSwiperMoveDownStart={this.onSwiperMoveDownStart}
          onSwiperMoveDownDone={this.onSwiperMoveDownDone}
          onSwiperMoveDownCancel={onMoveDownCancel}
          onSwiperMoveUpStart={onMoveUp}
          onSwiperMoveUpDone={this.onSwiperMoveUpDone}
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
    onCalendarUpdate: (tracker, dateMs, startDateMs, endDateMs) => (
      dispatch(updateCalendar(tracker, dateMs, startDateMs, endDateMs))
    ),
    onRemove: (tracker) => dispatch(removeTracker(tracker)),
    onUpdate: (tracker) => dispatch(updateTracker(tracker)),
    onTick: (tracker, value, data) => dispatch(tickTracker(tracker, value, data)),
    onStart: (tracker, value, data) => dispatch(startTracker(tracker, value, data)),
    // onProgress: (tracker, value, data, progress) => (
    //   dispatch(updateLastTick(tracker, value, data, progress))
    // ),
    onStop: (tracker, value, data) => dispatch(stopTracker(tracker, value, data)),
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
