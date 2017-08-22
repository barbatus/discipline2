'use strict';

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

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      active: false,
    };
    this._onSlideChange = ::this._onSlideChange;
    this._onAddCompleted = ::this._onAddCompleted;
    this._setMainViewBtns = ::this._setMainViewBtns;
    this._onAcceptNewTracker = ::this._onAcceptNewTracker;
    this._cancelNewTracker = ::this._cancelNewTracker;
  }

  get leftView() {
    return (
      <TrackersView
        ref="left"
        {...this.props}
        style={commonStyles.absFilled}
        onSlideChange={this._onSlideChange}
        onAddCompleted={this._onAddCompleted}
        onRemoveCompleted={this._setMainViewBtns}
        onSaveCompleted={this._setMainViewBtns}
        onCancel={this._setMainViewBtns}
        onMoveUp={this._setMainViewBtns}
      />
    );
  }

  get rightView() {
    return (
      <NewTrackerScreenView
        ref="right"
        onAccept={this._onAcceptNewTracker}
        onCancel={this._cancelNewTracker}
      />
    );
  }

  componentDidMount() {
    this._setMainViewBtns();
  }

  _getNewBtn(onPress) {
    return <NavAddButton onPress={this::onPress} />;
  }

  _getMenuBtn(onPress) {
    return <NavMenuButton onPress={this::onPress} />;
  }

  _setMainViewBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this._getMenuBtn(this._onMenuToggle),
        this._getNewBtn(this._onNewTracker),
        callback,
      );
    }
  }

  // New tracker events.

  _onAcceptNewTracker(tracker) {
    if (this.state.active) return;

    this.setState({ active: true });
    this.props.onAdd(tracker, this.state.index + 1);
  }

  _onAddCompleted() {
    this._setMainViewBtns();

    this.setState({ active: false });
    this.moveLeft();
  }

  _cancelNewTracker() {
    if (Animation.on) return;

    this._setMainViewBtns();
    this.moveLeft();
  }

  _onNewTracker() {
    this.moveRight();
  }

  // Common

  _onSlideChange(index, previ) {
    this.setState({ index });
    caller(this.props.onSlideChange, index, previ);
  }

  _onMenuToggle() {
    caller(this.props.onMenu);
  }
}

export default connect(null, dispatch => {
  return {
    onAdd: (tracker, index) => dispatch(addTracker(tracker, index)),
  };
})(MainScreenView);
