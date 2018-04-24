import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';

import Trackers from 'app/model/Trackers';
import { TrackerType } from 'app/depot/consts';
import { caller } from 'app/utils/lang';

import Animation from '../animation/Animation';
import { NavCancelButton, NavAcceptButton } from '../nav/buttons';
import ScrollScreenView from './ScrollScreenView';
import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';
import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

const TYPES = TrackerType.symbols();

export class NewTrackerScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  tracker = null;

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
    this.onTypeAccept = ::this.onTypeAccept;
    this.onTypeCancel = ::this.onTypeCancel;
    this.onAccept = ::this.onAccept;
  }

  componentDidMount() {
    const { parent } = this.props;
    parent.on('onMoveRight', this.onRightMove, this);
  }

  componentWillUnmount() {
    const { parent } = this.props;
    parent.removeListener(this.onRightMove, this);
  }

  onRightMove() {
    this.setState({
      tracker: null,
      typeId: TYPES[0].valueOf(),
    });
    this.setNewTrackerBtns();
    const { dispatch } = this.props;
    dispatch(reset('newTrackerForm'));
  }

  get leftView() {
    const { tracker } = this.state;
    return (
      <NewTrackerSlide
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
        typeId={typeId}
        onTypeChosen={this.onTypeChosen}
      />
    );
  }

  getCancelBtn(onPress: Function) {
    return <NavCancelButton onPress={onPress} />;
  }

  getAcceptBtn(onPress: Function) {
    return <NavAcceptButton onPress={onPress} />;
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

export default connect()(NewTrackerScreenView);
