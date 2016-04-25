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
  NavAcceptButton,
  NavBackButton
} = require('../nav/buttons');

const Easing = require('Easing');

const ScreenView = require('./ScreenView');

const NewTrackerSlide = require('../trackers/slides/NewTrackerSlide');
const TrackerTypesSlide = require('../trackers/slides/TrackerTypesSlide');

const Trackers = require('../../trackers/Trackers');

const { commonDef, commonStyles } = require('../styles/common');

class NewTrackerView extends ScreenView {
  constructor(props) {
    super(props);

    this.state = {
      trackerTypeId: null
    }
  }

  moveLeft(instantly, callback) {
    this.setState({
      trackerTypeId: null
    });

    this._setNewTrackerBtns();

    super.moveLeft(instantly, callback);
  }

  moveRight(instantly, callback) {
    this.refs.newTrackerSlide.reset();
    this.refs.typeSlide.reset();

    super.moveRight(instantly, callback);
  }

  setOpacity(value, animated, callback) {
    super.setOpacity(value, animated, () => {
      this.refs.newTrackerSlide.reset();
      if (callback) {
        callback();
      }
    });
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

  _setNewTrackerBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this._getCancelBtn(this.props.onCancel),
        this._getAcceptBtn(this._onAccept));
    }
  }

  _setTrackerTypeBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this._getCancelBtn(this._onTypeCancel),
        this._getAcceptBtn(this._onTypeAccept));
    }
  }

  _moveLeft() {
    this.refs.newTracker.moveLeft();
    this.refs.trackerType.moveLeft();
  }

  _moveRight() {
    this.refs.newTracker.moveRight();
    this.refs.trackerType.moveRight();
  }

  _onAccept() {
    let tracker = this.refs.newTrackerSlide.tracker;

    if (this.props.onAccept) {
      this.props.onAccept(tracker);
    }
  }

  _onTypeCancel() {
    this._setNewTrackerBtns();
    this._moveRight();
  }

  _onTypeChange() {
    this._setTrackerTypeBtns();
    this._moveLeft();
  }

  _onTypeAccept() {
    this.setState({
      trackerTypeId: this.refs.typeSlide.typeId
    }, () => {
      this._setNewTrackerBtns();
      this._moveRight();
    });
  }

  get content() {
    return (
      <View style={commonStyles.flexFilled}>
        <ScreenView
          ref='newTracker'
          posX={0}
          content={
            <NewTrackerSlide
              ref='newTrackerSlide'
              typeId={this.state.trackerTypeId}
              onTypeChange={this._onTypeChange.bind(this)}
            />
          }
        />
        <ScreenView
          ref='trackerType'
          posX={1}
          content={
            <TrackerTypesSlide
              ref='typeSlide'
            />
          }
        />
      </View>
    );
  }
};

NewTrackerView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  slideContainer: {
    ...commonDef.absoluteFilled
  }
});

module.exports = NewTrackerView;
