'use strict';

import React, {Component} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated
} from 'react-native';

import {
  NavCancelButton,
  NavAcceptButton
} from '../nav/buttons';

import ScreenView from './ScreenView';

import Trackers from '../trackers/Trackers';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

class TrackersView extends ScreenView {
  get content() {
    return (
      <Trackers
        ref='trackers'
        onScroll={this.props.onScroll}
        onSlideChange={this.props.onSlideChange}
        onSlideNoChange={this.props.onSlideNoChange}
        onRemove={this.props.onRemove}
        onSwiperDown={this.props.onCalendarShown}
        onEdit={::this._onEdit}
        onSwiperScaleMove={::this._onSwiperScaleMove}
        onSwiperMoveDown={::this._onSwiperMoveDown}
      />
    )
  }

  addTracker(tracker, callback) {
    this.refs.trackers.addTracker(tracker, callback);
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
    let { navBar } = this.context;

    navBar.setTitle('Edit Tracker');
    navBar.setButtons(
      this._getCancelBtn(this._cancelEdit),
      this._getAcceptBtn(this._saveEdit));
  }

  _onSwiperScaleMove(dv: number) {
    let { navBar } = this.context;
    navBar.setOpacity(dv);
  }

  _onSwiperMoveDown(dv: number) {
    let { navBar } = this.context;
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
    this.refs.trackers.saveEdit();
    caller(this.props.onSave);
  }
};

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = TrackersView;
