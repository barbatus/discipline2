'use strict';

const React = require('react-native');
const {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Component,
  Animated
} = React;

const {
  NavCancelButton,
  NavAcceptButton
} = require('../nav/buttons');

const ScreenView = require('./ScreenView');

const Trackers = require('../trackers/Trackers');

const { commonStyles } = require('../styles/common');

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
