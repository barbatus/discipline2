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

class TrackersView extends ScreenView {
  constructor(props) {
    super(props);
  }

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

  async addTracker(tracker, callback) {
    await this.refs.trackers.addTracker(tracker, callback);
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
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  _onEdit() {
    this._setEditTrackerBtns();
  }

  _saveEdit() {
   this.refs.trackers.saveEdit();
    if (this.props.onSave) {
      this.props.onSave();
    }
  }
};

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = TrackersView;
