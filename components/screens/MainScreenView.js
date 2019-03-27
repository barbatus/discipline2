import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { first } from 'lodash';

import { addTracker, updateCopilot } from 'app/model/actions';
import { caller } from 'app/utils/lang';

import CopilotStep from '../copilot/CopilotStep';
import CopilotStepEnum, { CopilotScreenEnum, getScreenByStep } from '../copilot/steps';
import { NavAddButton, NavMenuButton } from '../nav/buttons';
import { commonStyles } from '../styles/common';
import Animation from '../animation/Animation';

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

  constructor(props) {
    super(props);

    this.onSlideChange = ::this.onSlideChange;
    this.onAddCompleted = ::this.onAddCompleted;
    this.setMainViewBtns = ::this.setMainViewBtns;
    this.onAcceptNewTracker = ::this.onAcceptNewTracker;
    this.cancelNewTracker = ::this.cancelNewTracker;
    this.onMenuToggle = ::this.onMenuToggle;
    this.onNewTracker = ::this.onNewTracker;
    this.onMoveDownCancel = ::this.onMoveDownCancel;
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
      />
    );
  }

  get rightView() {
    return (
      <NewTrackerScreenView
        parent={this.emitter}
        onAccept={this.onAcceptNewTracker}
        onCancel={this.cancelNewTracker}
      />
    );
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
    setTimeout(() => {
      this.props.start(stepId);
    }, delay);
  }

  // New tracker events.

  onAcceptNewTracker(tracker) {
    if (this.isActive) return;

    if (!tracker.icon && this.copilotIfAddIcon()) return;

    this.isActive = true;
    this.props.onAddTracker(tracker, this.slideIndex + 1);
  }

  onAddCompleted() {
    this.setMainViewBtns(() => (this.isActive = false));
    this.moveLeft();
  }

  cancelNewTracker() {
    if (Animation.on) return;

    this.setMainViewBtns();
    this.moveLeft();
  }

  onNewTracker() {
    this.moveRight();
  }

  // Copilot

  copilotIfEmptyApp() {
    const { copilot } = this.props.app.props;
    if (!copilot[CopilotScreenEnum.EMPTY.value]) {
      const firstStep = first(CopilotScreenEnum.EMPTY.steps);
      this.startCopilot(3000, firstStep.value);
      return true;
    }
    return false;
  }

  copilotIfAddIcon() {
    const { copilot } = this.props.app.props;
    if (!copilot[CopilotScreenEnum.CREATE_TRACKER.value]) {
      const firstStep = first(CopilotScreenEnum.CREATE_TRACKER.steps);
      this.startCopilot(500, firstStep.value);
      return true;
    }
    return false;
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
}

export default connect(null, (dispatch) => ({
  onAddTracker: (tracker, index) => dispatch(addTracker(tracker, index)),
  onCopilot: (screen, step) => dispatch(updateCopilot(screen, step)),
}))(MainScreenView);
