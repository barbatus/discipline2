import React from 'react';

import { NavCancelButton, NavAcceptButton } from '../nav/buttons';

import Animation from '../animation/Animation';

import ScrollScreenView from './ScrollScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';

import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import { TrackerType } from '../../depot/consts';

import { caller } from '../../utils/lang';

const TYPES = TrackerType.symbols();

const createNewTracker = () => Trackers.create({});

export default class NewTrackerScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      tracker: createNewTracker(),
      typeId: TYPES[0].valueOf(),
    };
    this.onTypeSelect = ::this.onTypeSelect;
    this.onTrackerChange = ::this.onTrackerChange;
    this.onTypeChosen = ::this.onTypeChosen;
  }

  onRightMove() {
    const newTracker = createNewTracker();
    this.setState({
      tracker: newTracker,
      typeId: TYPES[0].valueOf(),
    });

    this.setNewTrackerBtns();
  }

  get leftView() {
    const { tracker } = this.state;
    return (
      <NewTrackerSlide
        ref="left"
        tracker={tracker}
        onTypeSelect={this.onTypeSelect}
        onTrackerChange={this.onTrackerChange}
      />
    );
  }

  get rightView() {
    const { typeId } = this.state;
    return (
      <TrackerTypesSlide
        ref="right"
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

  onTrackerChange(tracker: Tracker) {
    this.setState({ tracker });
  }

  onAccept() {
    caller(this.props.onAccept, this.state.tracker);
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

    let { tracker, typeId } = this.state;
    tracker = Trackers.create(tracker);
    tracker.typeId = typeId;
    this.setState({
      tracker,
    });
  }
}
