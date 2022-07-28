import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';

import Tracker from 'app/model/Tracker';
import Trackers from 'app/model/Trackers';
import { TrackerType } from 'app/depot/consts';
import { caller } from 'app/utils/lang';

import Animation from 'app/components/animation/Animation';
import { NavCancelButton, NavAcceptButton } from 'app/components/nav/buttons';
import NewTrackerSlide from 'app/components/trackers/slides/NewTrackerSlide';
import TrackerTypesSlide from 'app/components/trackers/slides/TrackerTypesSlide';

import ScrollScreenView from './ScrollScreenView';

const TYPES = TrackerType.symbols();

export class NewTrackerScreenView extends ScrollScreenView {
  static contextTypes = {
    navBar: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      tracker: Tracker.defaultValues(),
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
      tracker: Tracker.defaultValues(),
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
      <TrackerTypesSlide typeId={typeId} onTypeChosen={this.onTypeChosen} />
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
    this.state.tracker = tracker;
  }

  onNewTracker(tracker) {
    caller(this.props.onAccept, Trackers.create(tracker));
  }

  onAccept() {
    const { dispatch } = this.props;
    dispatch(submit('newTrackerForm'));
  }

  onTypeCancel() {
    if (Animation.on) {
      return;
    }

    this.setNewTrackerBtns();
    this.moveLeft();
  }

  onTypeSelect() {
    if (Animation.on) {
      return;
    }

    this.setTrackerTypeBtns();
    this.moveRight();
  }

  onTypeChosen(typeId) {
    this.setState({
      typeId,
    });
  }

  onTypeAccept() {
    if (Animation.on) {
      return;
    }

    this.setNewTrackerBtns();
    this.moveLeft();

    const { tracker, typeId } = this.state;
    this.setState({
      tracker: { ...tracker, typeId },
    });
  }
}

export default connect()(NewTrackerScreenView);
