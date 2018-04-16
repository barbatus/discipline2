import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { addTracker } from 'app/model/actions';

import { caller } from 'app/utils/lang';

import { NavAddButton, NavMenuButton } from '../nav/buttons';

import Animation from '../animation/Animation';

import ScrollScreenView from './ScrollScreenView';

import TrackersView from './TrackersView';

import NewTrackerScreenView from './NewTrackerScreenView';

import { commonStyles } from '../styles/common';

export class MainScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  slideIndex = 0;

  active = false;

  constructor(props) {
    super(props);

    this.onSlideChange = ::this.onSlideChange;
    this.onAddCompleted = ::this.onAddCompleted;
    this.setMainViewBtns = ::this.setMainViewBtns;
    this.onAcceptNewTracker = ::this.onAcceptNewTracker;
    this.cancelNewTracker = ::this.cancelNewTracker;
    this.onMenuToggle = ::this.onMenuToggle;
    this.onNewTracker = ::this.onNewTracker;
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
    this.setMainViewBtns();
  }

  getNewBtn(onPress) {
    return <NavAddButton onPress={onPress} />;
  }

  getMenuBtn(onPress) {
    return <NavMenuButton onPress={onPress} />;
  }

  setMainViewBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this.getMenuBtn(this.onMenuToggle),
        this.getNewBtn(this.onNewTracker),
        callback,
      );
    }
  }

  // New tracker events.

  onAcceptNewTracker(tracker) {
    if (this.active) return;

    this.active = true;
    this.props.onAdd(tracker, this.slideIndex + 1);
  }

  onAddCompleted() {
    this.setMainViewBtns();

    this.active = false;
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

  // Common

  onSlideChange(index, previ, animated) {
    this.slideIndex = index;
    caller(this.props.onSlideChange, index, previ, animated);
  }

  onMenuToggle() {
    caller(this.props.onMenu);
  }
}

export default connect(null, (dispatch) => ({
  onAdd: (tracker, index) => dispatch(addTracker(tracker, index)),
}))(MainScreenView);
