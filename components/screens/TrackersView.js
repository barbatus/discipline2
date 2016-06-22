'use strict';

import React, { Component } from 'react';

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

import { commonStyles } from '../styles/common';

import { caller } from '../../utils/lang';

class TrackersView extends ScreenView {
  get content() {
    return (
      <Trackers
        ref='trackers'
        onScroll={this.props.onScroll}
        onSlideChange={this.props.onSlideChange}
        onSlideNoChange={this.props.onSlideNoChange}
        onEdit={this._onEdit.bind(this)}
        onRemove={this.props.onRemove}
      />
    )
  }

  addTracker(tracker, callback) {
    this.refs.trackers.addTracker(tracker, callback);
  }

  _getCancelBtn(onPress) {
    return (
      <NavCancelButton onPress={onPress.bind(this)} />
    );
  }

  _getAcceptBtn(onPress) {
    return (
      <NavAcceptButton onPress={onPress.bind(this)} />
    );
  }

  _setEditTrackerBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Edit Tracker');
      navBar.setButtons(
        this._getCancelBtn(this._cancelEdit),
        this._getAcceptBtn(this._saveEdit));
    }
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
