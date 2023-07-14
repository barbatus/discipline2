import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import first from 'lodash/first';
import moment from 'moment';

import { MAX_TRACKERS } from 'app/env';
import { addTracker, updateCopilot } from 'app/model/actions';
import { caller } from 'app/utils/lang';
import Keyboard from 'app/utils/Keyboard';
import time from 'app/time/utils';

import CopilotStep from 'app/components/copilot/CopilotStep';
import CopilotStepEnum, {
  CopilotScreenEnum,
  getScreenByStep,
} from 'app/components/copilot/steps';
import { NavAddButton, NavMenuButton } from 'app/components/nav/buttons';
import { commonStyles } from 'app/components/styles/common';
import Animation from 'app/components/animation/Animation';

import ScrollScreenView from './ScrollScreenView';
import TrackersView from './TrackersView';
import NewTrackerScreenView from './NewTrackerScreenView';

export class MainScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  static propTypes = {
    app: PropTypes.object.isRequired,
  };

  slideIndex = 0;

  isActive = false;

  hTimers = {};

  constructor(props) {
    super(props);

    this.state = { rightView: null };

    this.onSlideChange = ::this.onSlideChange;
    this.onAddCompleted = ::this.onAddCompleted;
    this.setMainViewBtns = ::this.setMainViewBtns;
    this.onAcceptNewTracker = ::this.onAcceptNewTracker;
    this.cancelNewTracker = ::this.cancelNewTracker;
    this.onMenuToggle = ::this.onMenuToggle;
    this.onNewTracker = ::this.onNewTracker;
    this.onMoveDownCancel = ::this.onMoveDownCancel;
    this.onCalendarUpdate = ::this.onCalendarUpdate;
  }

  get leftView() {
    return (
      <TrackersView
        {...this.props}
        parent={this.emitter}
        style={commonStyles.absFilled}
        onSlideChange={this.onSlideChange}
        onAddCompleted={this.onAddCompleted}
        onRemoveCompleted={this.setMainViewBtns}
        onSaveCompleted={this.setMainViewBtns}
        onCancel={this.setMainViewBtns}
        onMoveUp={this.setMainViewBtns}
        onMoveDownCancel={this.onMoveDownCancel}
        onCalendarUpdate={this.onCalendarUpdate}
      />
    );
  }

  get rightView() {
    const { rightView } = this.state;
    return rightView;
  }

  componentDidMount() {
    this.props.copilotEvents.on('stepChange', ({ name }) => {
      const step = CopilotStepEnum.fromValue(name);
      const screen = getScreenByStep(step);
      this.props.onCopilot(screen.value, step.value);
    });

    this.setMainViewBtns();
    this.copilotIfEmptyApp();
  }

  componentWillUnmount() {
    this.props.copilotEvents.off('stepChange');
  }

  getNewBtn(onPress) {
    return (
      <CopilotStep step={CopilotStepEnum.CREATE_FIRST}>
        <NavAddButton onPress={onPress} />
      </CopilotStep>
    );
  }

  getMenuBtn(onPress) {
    return <NavMenuButton onPress={onPress} />;
  }

  setMainViewBtns(callback?: Function, animated = true) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this.getMenuBtn(this.onMenuToggle),
        this.getNewBtn(this.onNewTracker),
        callback,
        animated,
      );
    }
  }

  startCopilot(delay: number, stepId: string) {
    return setTimeout(() => {
      const { copilot } = this.props.app.props;
      const step = CopilotStepEnum.fromValue(stepId);
      const screen = getScreenByStep(step);
      if (!(screen.value in copilot)) {
        this.props.start(stepId);
      }
    }, delay);
  }

  // New tracker events.

  onAcceptNewTracker(tracker) {
    if (this.isActive) {
      return;
    }

    if (this.copilotIfAddIcon(tracker)) {
      return;
    }

    this.isActive = true;
    Keyboard.dismiss();
    this.props.onAddTracker(tracker, this.slideIndex + 1);
  }

  onAddCompleted() {
    this.setMainViewBtns(() => (this.isActive = false));
    this.moveLeft();
  }

  cancelNewTracker() {
    if (Animation.on) {
      return;
    }

    this.setMainViewBtns();
    this.moveLeft();
  }

  onNewTracker() {
    const { trackers } = this.props;
    if (trackers.size > MAX_TRACKERS) {
      return Alert.alert(
        'Trackers Limit',
        'Sorry, there is no more than 40 trackers allowed.',
        { text: 'Ok' },
      );
    }

    this.setState({
      rightView: (
        <NewTrackerScreenView
          parent={this.emitter}
          onAccept={this.onAcceptNewTracker}
          onCancel={this.cancelNewTracker}
        />
      ),
    });

    this.moveRight();
    const { copilot } = this.props.app.props;
    if (!(CopilotScreenEnum.EMPTY.value in copilot)) {
      const firstStep = first(CopilotScreenEnum.EMPTY.steps);
      clearTimeout(this.hTimers[firstStep.value]);
      this.props.onCopilot(CopilotScreenEnum.EMPTY.value, firstStep.value);
    }
  }

  // Copilot

  copilotIfEmptyApp() {
    const { copilot } = this.props.app.props;
    if (CopilotScreenEnum.EMPTY.value in copilot) {
      return false;
    }
    const firstStep = first(CopilotScreenEnum.EMPTY.steps);
    this.hTimers[firstStep.value] = this.startCopilot(2000, firstStep.value);
    return true;
  }

  copilotIfAddIcon(tracker) {
    const { copilot } = this.props.app.props;
    if (CopilotScreenEnum.CREATE_TRACKER.value in copilot) {
      return false;
    }
    const firstStep = first(CopilotScreenEnum.CREATE_TRACKER.steps);
    if (tracker.iconId) {
      this.props.onCopilot(
        CopilotScreenEnum.CREATE_TRACKER.value,
        firstStep.value,
      );
      return false;
    }
    this.hTimers[firstStep.value] = this.startCopilot(500, firstStep.value);
    return true;
  }

  copilotIfEditPast(tracker, monthMs) {
    if (
      tracker.ticks.length &&
      moment(monthMs).month() === moment().month() &&
      moment().date() === 14
    ) {
      const firstStep = first(CopilotScreenEnum.CALENDAR.steps);
      this.hTimers[firstStep.value] = this.startCopilot(500, firstStep.value);
    }
  }

  // Common

  onSlideChange(index, previ, animated) {
    this.slideIndex = index;
    caller(this.props.onSlideChange, index, previ, animated);
  }

  onMenuToggle() {
    caller(this.props.onMenu);
  }

  onMoveDownCancel() {
    this.setMainViewBtns(null, false);
  }

  onCalendarUpdate(tracker, monthDateMs, startDateMs, endDateMs) {
    this.copilotIfEditPast(tracker, monthDateMs);
  }
}

export default connect(
  ({ trackers }) => ({
    ...trackers,
  }),
  (dispatch) => ({
    onAddTracker: (tracker, index) => dispatch(addTracker(tracker, index)),
    onCopilot: (screen, step) => dispatch(updateCopilot(screen, step)),
  }),
)(MainScreenView);
