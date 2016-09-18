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

import Animation from '../animation/Animation';

import ScreenView from './ScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';
import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import {commonDef, commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

export default class NewTrackerView extends ScreenView {
  _active = false;

  constructor(props) {
    super(props);

    this.state = {
      trackerTypeId: null
    }
  }

  onLeftMove() {
    this.setState({
      trackerTypeId: null
    });

    this._setNewTrackerBtns();
  }

  onRightMove() {
    this.refs.newTrackSlide.reset();
    this.refs.typeSlide.reset();
  }

  get _isActive() {
    return Animation.on;
  }

  _getCancelBtn(onPress: Function) {
    return (
      <NavCancelButton onPress={this::onPress} />
    );
  }

  _getAcceptBtn(onPress: Function) {
    return (
      <NavAcceptButton onPress={this::onPress} />
    );
  }

  _setNewTrackerBtns(callback?: Function) {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this._getCancelBtn(this.props.onCancel),
        this._getAcceptBtn(this._onAccept),
        callback);
    }
  }

  _setTrackerTypeBtns(callback?: Function) {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this._getCancelBtn(this._onTypeCancel),
        this._getAcceptBtn(this._onTypeAccept),
        callback);
    }
  }

  _moveViewsLeft(callback?: Function) {
    let views = [
      this.refs.newTracker,
      this.refs.trackerType
    ];
    ScreenView.moveLeft(views, callback);
  }

  _moveViewsRight(callback?: Function) {
    let views = [
      this.refs.newTracker,
      this.refs.trackerType
    ];
    ScreenView.moveRight(views, callback);
  }

  _onAccept() {
    let tracker = this.refs.newTrackSlide.tracker;
    caller(this.props.onAccept, tracker);
  }

  _onTypeCancel() {
    if (this._isActive) return;

    this._setNewTrackerBtns();
    this._moveViewsRight();
  }

  _onTypeChange() {
    if (this._isActive) return;

    this._setTrackerTypeBtns();
    this._moveViewsLeft();
  }

  _onTypeAccept() {
    if (this._isActive) return;

    this.setState({
      trackerTypeId: this.refs.typeSlide.typeId
    }, () => {
      this._setNewTrackerBtns();
      this._moveViewsRight();
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
                ref='newTrackSlide'
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
