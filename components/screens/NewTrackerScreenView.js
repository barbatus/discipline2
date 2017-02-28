'use strict';

import React from 'react';

import { NavCancelButton, NavAcceptButton } from '../nav/buttons';

import Animation from '../animation/Animation';

import ScrollScreenView from './ScrollScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';

import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import { caller } from '../../utils/lang';

export default class NewTrackerScreenView extends ScrollScreenView {
  constructor(props) {
    super(props);

    this.state = {
      tracker: Trackers.create({}),
      typeId: null,
    };
  }

  onRightMove() {
    this.setState({
      tracker: Trackers.create({}),
      typeId: null,
    });

    this._setNewTrackerBtns();
  }

  shouldComponentUpdate(props, state) {
    return this.state.tracker !== state.tracker ||
      this.state.typeId !== state.typeId;
  }

  get leftView() {
    const { tracker } = this.state;
    return (
      <NewTrackerSlide
        ref="left"
        tracker={tracker}
        onTypeSelect={::this._onTypeSelect}
        onTrackerChange={::this._onTrackerChange}
      />
    );
  }

  get rightView() {
    const { tracker } = this.state;
    return (
      <TrackerTypesSlide
        ref="right"
        typeId={tracker.typeId}
        onTypeChosen={::this._onTypeChosen}
      />
    );
  }

  _getCancelBtn(onPress: Function) {
    return <NavCancelButton onPress={this::onPress} />;
  }

  _getAcceptBtn(onPress: Function) {
    return <NavAcceptButton onPress={this::onPress} />;
  }

  _setNewTrackerBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this._getCancelBtn(this.props.onCancel),
        this._getAcceptBtn(this._onAccept),
        callback,
      );
    }
  }

  _setTrackerTypeBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this._getCancelBtn(this._onTypeCancel),
        this._getAcceptBtn(this._onTypeAccept),
        callback,
      );
    }
  }

  _onTrackerChange(tracker: Tracker) {
    this.setState({ tracker });
  }

  _onAccept() {
    caller(this.props.onAccept, this.state.tracker);
  }

  _onTypeCancel() {
    if (Animation.on) return;

    this._setNewTrackerBtns();
    this.moveLeft();
  }

  _onTypeSelect() {
    if (Animation.on) return;

    this._setTrackerTypeBtns();
    this.moveRight();
  }

  _onTypeChosen(typeId) {
    this.setState({
      typeId,
    });
  }

  _onTypeAccept() {
    if (Animation.on) return;

    this._setNewTrackerBtns();
    this.moveLeft();

    let { tracker, typeId } = this.state;
    tracker = Trackers.create(tracker);
    tracker.typeId = typeId;
    this.setState({
      tracker,
    });
  }
}

NewTrackerScreenView.contextTypes = {
  navBar: React.PropTypes.object.isRequired,
};
