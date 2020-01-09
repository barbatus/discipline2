import React, { PureComponent } from 'react';
import { StyleSheet, Animated, InteractionManager, ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import moment from 'moment';
import { List } from 'immutable';

import Notifications from 'app/notifications';
import registry, { DlgType } from 'app/components/dlg/registry';
import TrackersModel from 'app/model/Trackers';
import { Tick } from 'app/model/Tracker';
import { tickValueFormatter } from 'app/model/ticks';
import time from 'app/time/utils';
import { caller } from 'app/utils/lang';

import {
  tickTracker,
  removeTracker,
  updateTracker,
  undoLastTick,
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
} from 'app/components/nav/buttons';

import TrackerCal from 'app/components/trackers/TrackerCal';
import Trackers from 'app/components/trackers/Trackers';
import DummyTrackerSlide from 'app/components/trackers/slides/DummyTrackerSlide';
import { commonStyles, CONTENT_HEIGHT, SCREEN_WIDTH } from 'app/components/styles/common';

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
  calc: {
    ...commonStyles.absFilled,
    height: CONTENT_HEIGHT / 2,
    top: 0,
  },
  trackersContainer: {
    height: CONTENT_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

function getCurrentTrackerUpdate(tracker, app) {
  if (!tracker) return {
    current: null,
    formatTickValue: null,
  };

  return {
    current: tracker,
    formatTickValue: tickValueFormatter(tracker, app.props.metric),
  };
}

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
    onAddCompleted: PropTypes.func.isRequired,
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

  calendar = React.createRef();

  trackers = React.createRef();

  constructor(props) {
    super(props);

    const {trackers, app} = props;
    this.state = {
      ...getCurrentTrackerUpdate(trackers.get(0), app),
      calShown: false,
    };
    this.onStartEdit = ::this.onStartEdit;
    this.onTrackerEdit = ::this.onTrackerEdit;
    this.onSubmitFail = ::this.onSubmitFail;
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

  static getDerivedStateFromProps({ trackers, app }, prevState) {
    if (!trackers.size) return null;

    if (prevState.current) {
      const tracker = trackers.find(tracker => tracker.id === prevState.current.id);
      return tracker !== prevState.current ? getCurrentTrackerUpdate(tracker, app) : null;
    }

    return getCurrentTrackerUpdate(trackers.get(0), app);
  }

  componentDidUpdate({ trackers: prevTrackers }) {
    const { trackers, onAddCompleted } = this.props;
    // Firing onAddCompleted because Trackers is not rendered when no trackers
    if (trackers.size > prevTrackers.size && !prevTrackers.size) {
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
    this.setState(getCurrentTrackerUpdate(this.props.trackers.get(index), this.props.app));
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

    this.calendar.current.scrollToNextMonth();
  }

  onPrevMonth() {
    const { dateMs } = this.props;
    const monthMs = time.getPrevMonthDateMs(dateMs);
    this.setNavBarMonth(monthMs);

    this.calendar.current.scrollToPrevMonth();
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
      this.props.onCalendarUpdate(current, monthDateMs, startDateMs, endDateMs);
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
    if (tracker.props.alerts) {
      Notifications.checkPermissions();
    }
    this.props.onUpdate(TrackersModel.create({
      ...current,
      ...tracker,
    }));
  }

  onSubmitFail() {
    this.isActive = false;
  }

  saveEdit() {
    if (this.isActive) return;

    this.isActive = true;
    const { dispatch } = this.props;
    dispatch(submit('trackerForm'));
  }

  // Edit tracker events.

  cancelEdit() {
    this.trackers.current.cancelEdit();
  }

  render() {
    const { style, app, onMoveUp, onMoveDownCancel, onCancel } = this.props;
    const { current: tracker, formatTickValue, calShown } = this.state;

    if (!tracker) { return <DummyTrackerSlide />; }

    const calcStyle = { opacity: this.calcOpacity, zIndex: calShown ? 1 : 0 };
    return (
      <Animated.View style={[commonStyles.flexFilled, style]}>
        <TrackerCal
          ref={this.calendar}
          {...this.props}
          shown={calShown}
          trackerType={tracker ? tracker.type : null}
          formatTickValue={formatTickValue}
          style={[styles.calc, calcStyle]}
          onMonthChanged={this.onMonthChanged}
          onTooltipClick={this.onTooltipClick}
        />
        <View style={styles.trackersContainer}>
          <Trackers
            ref={this.trackers}
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
            onSubmitFail={this.onSubmitFail}
            onSlideChange={this.onSlideChange}
          />
        </View>
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
