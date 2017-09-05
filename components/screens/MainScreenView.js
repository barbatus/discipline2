import React from 'react';

import { connect } from 'react-redux';

import {
  NavAddButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton,
} from '../nav/buttons';

import Animation from '../animation/Animation';

import ScrollScreenView from './ScrollScreenView';

import TrackersView from './TrackersView';

import NewTrackerScreenView from './NewTrackerScreenView';

import { addTracker } from '../../model/actions';

import { caller } from '../../utils/lang';

import { commonStyles } from '../styles/common';

export class MainScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: React.PropTypes.object.isRequired,
  };

  index = 0;

  active = false;

  constructor(props) {
    super(props);

    this.onSlideChange = ::this.onSlideChange;
    this.onAddCompleted = ::this.onAddCompleted;
    this.setMainViewBtns = ::this.setMainViewBtns;
    this.onAcceptNewTracker = ::this.onAcceptNewTracker;
    this.cancelNewTracker = ::this.cancelNewTracker;
  }

  get leftView() {
    return (
      <TrackersView
        {...this.props}
        ref={(el) => this.leftViewRef = el}
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
        ref={(el) => this.rightViewRef = el}
        onAccept={this.onAcceptNewTracker}
        onCancel={this.cancelNewTracker}
      />
    );
  }

  componentDidMount() {
    this.setMainViewBtns();
  }

  getNewBtn(onPress) {
    return <NavAddButton onPress={this::onPress} />;
  }

  getMenuBtn(onPress) {
    return <NavMenuButton onPress={this::onPress} />;
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
    this.props.onAdd(tracker, this.index + 1);
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

  onSlideChange(index, previ) {
    this.index = index;
    caller(this.props.onSlideChange, index, previ);
  }

  onMenuToggle() {
    caller(this.props.onMenu);
  }
}

export default connect(null, (dispatch) => ({
  onAdd: (tracker, index) => dispatch(addTracker(tracker, index)),
}))(MainScreenView);
