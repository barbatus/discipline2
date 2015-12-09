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

const TrackerSwiper = require('../trackers/TrackerSwiper');

const Trackers = require('../../trackers/Trackers');

class TrackersView extends Component {
  constructor(props) {
    super(props);
  }

  moveLeft(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    if (instantly) {
      this._trackersView.posX.setValue(-1);
    } else {
      Animated.timing(this._trackersView.posX, {
        duration: 1000,
        toValue: -1
      }).start(callback);
    }
  }

  moveRight(instantly, callback) {
    if (_.isFunction(instantly)) {
      callback = instantly;
      instantly = false;
    }

    if (instantly) {
      this._trackersView.posX.setValue(0);
    } else {
      Animated.timing(this._trackersView.posX, {
        duration: 1000,
        toValue: 0
      }).start(callback);
    }
  }

  setOpacity(value, animated, callback) {
    if (animated) {
      Animated.timing(this._trackersView.opacity, {
        duration: 1000,
        toValue: value
      }).start(callback);
    } else {
      this._trackersView.opacity.setValue(value);
    }
  }

  async addTracker(tracker, callback) {
    tracker = await Trackers.addAt(
      tracker, this.refs.trackers.nextInd);

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

  _onSlideChange(index) {
    if (this.props.onSlideChange) {
      this.props.onSlideChange(index);
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
    this.refs.trackers.showEdit();
  }

  _onRemove() {
    this.refs.trackers.removeTracker(
      this.props.onRemove);
  }

  _saveEdit() {
    this.refs.trackers.saveEdit();

    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  get _trackersView() {
    return this.refs.trackersView;
  }

  render() {
    return (
      <ScreenView
        ref='trackersView'
        posX={this.props.posX}
        content={
          <TrackerSwiper
            ref='trackers'
            onSlideChange={this._onSlideChange.bind(this)}
            onRemove={this._onRemove.bind(this)}
            onEdit={this._onEdit.bind(this)} />
        } />
    );
  }
};

TrackersView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});

module.exports = TrackersView;
