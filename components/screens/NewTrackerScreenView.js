import React from 'react';

import { connect } from 'react-redux';

import { submit } from 'redux-form';

import { NavCancelButton, NavAcceptButton } from '../nav/buttons';

import Animation from '../animation/Animation';

import ScrollScreenView from './ScrollScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';

import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import { TrackerType } from '../../depot/consts';

import { caller } from '../../utils/lang';

const TYPES = TrackerType.symbols();

export class NewTrackerScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: React.PropTypes.object.isRequired,
  };

  tracker = {};

  constructor(props) {
    super(props);

    this.state = {
      tracker: null,
      typeId: TYPES[0].valueOf(),
    };
    this.onTypeSelect = ::this.onTypeSelect;
    this.onChange = ::this.onChange;
    this.onTypeChosen = ::this.onTypeChosen;
    this.onNewTracker = ::this.onNewTracker;
  }

  onRightMove() {
    this.setState({
      tracker: null,
      typeId: TYPES[0].valueOf(),
    });
    this.setNewTrackerBtns();
  }

  get leftView() {
    const { tracker } = this.state;
    return (
      <NewTrackerSlide
        ref={(el) => this.leftViewRef = el}
        tracker={tracker}
        onTypeSelect={this.onTypeSelect}
        onChange={this.onChange}
        onNewTracker={this.onNewTracker}
      />
    );
  }

  get rightView() {
    const { typeId } = this.state;
    return (
      <TrackerTypesSlide
        ref={(el) => this.rightViewRef = el}
        typeId={typeId}
        onTypeChosen={this.onTypeChosen}
      />
    );
  }

  getCancelBtn(onPress: Function) {
    return <NavCancelButton onPress={this::onPress} />;
  }

  getAcceptBtn(onPress: Function) {
    return <NavAcceptButton onPress={this::onPress} />;
  }

  setNewTrackerBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this.getCancelBtn(this.props.onCancel),
        this.getAcceptBtn(this.onAccept),
        callback,
      );
    }
  }

  setTrackerTypeBtns(callback?: Function) {
    const { navBar } = this.context;
    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this.getCancelBtn(this.onTypeCancel),
        this.getAcceptBtn(this.onTypeAccept),
        callback,
      );
    }
  }

  onChange(tracker) {
    this.tracker = tracker;
  }

  onNewTracker(tracker) {
    caller(this.props.onAccept, Trackers.create(tracker));
  }

  onAccept() {
    const { dispatch } = this.props;
    dispatch(submit('newTrackerForm'));
  }

  onTypeCancel() {
    if (Animation.on) return;

    this.setNewTrackerBtns();
    this.moveLeft();
  }

  onTypeSelect() {
    if (Animation.on) return;

    this.setTrackerTypeBtns();
    this.moveRight();
  }

  onTypeChosen(typeId) {
    this.setState({
      typeId,
    });
  }

  onTypeAccept() {
    if (Animation.on) return;

    this.setNewTrackerBtns();
    this.moveLeft();

    const { typeId } = this.state;
    const tracker = { ...this.tracker, typeId };
    this.setState({
      tracker,
    });
  }
}

export default connect(
  null, null, null, { withRef: true },
)(NewTrackerScreenView);
