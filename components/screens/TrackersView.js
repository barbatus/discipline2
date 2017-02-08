'use strict';

import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import {connect} from 'react-redux';

import {
  NavCancelButton,
  NavAcceptButton,
} from '../nav/buttons';

import ScreenView from './ScreenView';

import Trackers from '../trackers/Trackers';

import {
  tickTracker,
  removeTracker,
  updateTracker,
  undoLastTick,
  updateLastTick,
} from '../../model/actions';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

class TrackersView extends ScreenView {
  get content() {
    const { trackers, removeIndex, addIndex, updateIndex } = this.props;
    const {
      onRemoveCompleted,
      onAddCompleted,
      onSaveCompleted,
      onCalendarShown,
    } = this.props;
    const { onScroll, onSlideChange, onSlideNoChange } = this.props;

    return (
      <Trackers
        ref='trackers'
        trackers={trackers}
        removeIndex={removeIndex}
        addIndex={addIndex}
        updateIndex={updateIndex}
        onScroll={onScroll}
        onSlideChange={onSlideChange}
        onSlideNoChange={onSlideNoChange}
        onSwiperDown={onCalendarShown}
        onRemove={::this._onRemove}
        onEdit={::this._onEdit}
        onTick={::this._onTick}
        onStop={::this._onStopLastTick}
        onUndo={::this._onUndoLastTick}
        onRemoveCompleted={onRemoveCompleted}
        onAddCompleted={onAddCompleted}
        onSaveCompleted={onSaveCompleted}
        onSwiperScaleMove={::this._onSwiperScaleMove}
        onSwiperMoveDown={::this._onSwiperMoveDown}
      />
    );
  }

  get index() {
    return this.refs.trackers.index;
  }

  get current() {
    return this.refs.trackers.tracker;
  }

  _onRemove(tracker) {
    this.props.onRemove(tracker);
  }

  _getCancelBtn(onPress) {
    return (
      <NavCancelButton onPress={this::onPress} />
    );
  }

  _getAcceptBtn(onPress) {
    return (
      <NavAcceptButton onPress={this::onPress} />
    );
  }

  _setEditTrackerBtns() {
    const { navBar } = this.context;

    navBar.setTitle('Edit Tracker');
    navBar.setButtons(
      this._getCancelBtn(this._cancelEdit),
      this._getAcceptBtn(this._saveEdit));
  }

  _onSwiperScaleMove(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  _onSwiperMoveDown(dv: number) {
    const { navBar } = this.context;
    navBar.setOpacity(1 - dv);
  }

  // Edit tracker events.

  _cancelEdit() {
    this.refs.trackers.cancelEdit();
    caller(this.props.onCancel);
  }

  _onEdit() {
    this._setEditTrackerBtns();
  }

  _saveEdit() {
    const editedTracker = this.refs.trackers.editedTracker;
    if (editedTracker) {
      this.props.onUpdate(editedTracker);
    }
  }

  _onTick(tracker: Tracker, value?: number) {
    this.props.onTick(tracker, value);
  }

  _onStopLastTick(tracker: Tracker, value?: number) {
    this.props.onStop(tracker, value);
  }

  _onUndoLastTick(tracker: Tracker) {
    this.props.onUndo(tracker);
  }
};

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired,
};

export default connect(
  state => {
    return {
      trackers: state.trackers.trackers,
      addIndex: state.trackers.addIndex,
      removeIndex: state.trackers.removeIndex,
      updateIndex: state.trackers.updateIndex,
    };
  },
  dispatch => {
    return {
      onRemove: tracker => dispatch(
        removeTracker(tracker)),
      onUpdate: tracker => dispatch(
        updateTracker(tracker)),
      onTick: (tracker, value) => dispatch(
        tickTracker(tracker, value)),
      onStop: (tracker, value) => dispatch(
        updateLastTick(tracker, value)),
      onUndo: (tracker, value) => dispatch(
        undoLastTick(tracker))
    }
  }, null, {withRef: true}
)(TrackersView);
