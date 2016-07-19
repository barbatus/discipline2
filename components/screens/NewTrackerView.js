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
  NavAcceptButton,
  NavBackButton
} from '../nav/buttons';

import Easing from 'Easing';

import ScreenView from './ScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';
import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import {commonDef, commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

export default class NewTrackerView extends ScreenView {
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
      caller(callback);
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
    caller(this.props.onAccept, tracker);
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
            <View style={styles.slideContainer}>
              <NewTrackerSlide
                ref='newTrackerSlide'
                typeId={this.state.trackerTypeId}
                onTypeChange={::this._onTypeChange}
              />
            </View>
          }
        />
        <ScreenView
          ref='trackerType'
          posX={1}
          content={
            <View style={styles.slideContainer}>
              <TrackerTypesSlide ref='typeSlide' />
            </View>
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
    ...commonDef.flexFilled,
    alignItems: 'center'
  }
});
