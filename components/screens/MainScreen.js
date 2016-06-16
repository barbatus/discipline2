'use strict';

import React, {Component} from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated
} from 'react-native';

import {
  NavAddButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton,
  NavBackButton
} from '../nav/buttons';

import Screen from './Screen';

import ScreenView from './ScreenView';

import TrackersView from './TrackersView';

import NewTrackerView from './NewTrackerView';

import IconsDlg from './IconsDlg';

import Trackers from '../../trackers/Trackers';

import GradientSlider from '../common/GradientSlider';

import { commonStyles } from '../styles/common';

class MainScreen extends Component {
  componentDidMount() {
    this._setMainViewBtns();
  }

  _getNewBtn(onPress) {
    return (
      <NavAddButton onPress={onPress.bind(this)} />
    );
  }

  _getMenuBtn(onPress) {
    return (
      <NavMenuButton onPress={onPress.bind(this)} />
    );
  }

  _setMainViewBtns() {
    let navBar = this.refs.screen.navBar;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this._getMenuBtn(this._onMenuToggle),
        this._getNewBtn(this._onNewTracker));
    }
  }

  // Edit tracker events.

  _cancelTrackerEdit() {
    this._setMainViewBtns();
  }

  _saveTrackerEdit() {
    this._setMainViewBtns();
  }

  _removeTrackerEdit() {
    this._setMainViewBtns();
  }

  // New tracker events.

  _onAccept(tracker) {
    this.trackersView.addTracker(tracker, () => {
      this._setMainViewBtns();

      this.trackersView.setOpacity(0, false);
      this.trackersView.moveRight(true);
      this.newTrackerView.setOpacity(0, true, () => {
        this.newTrackerView.moveRight(false, () => {
          this.newTrackerView.setOpacity(1);
        });
      });
      this.trackersView.setOpacity(1, true);
    });
  }

  _cancelNewTracker() {
    this._setMainViewBtns();
    this._moveToRight(this.trackersView, this.newTrackerView);
  }

  _onNewTracker() {
    this._moveToLeft(this.trackersView, this.newTrackerView);
  }

  // Common

  _moveToLeft(view1, view2, callback) {
    view1.moveLeft();
    view2.moveLeft(callback);
  }

  _moveToRight(view1, view2, callback) {
    view2.moveRight();
    view1.moveRight(callback);
  }

  _onMenuToggle() {
    if (this.props.onMenu) {
      this.props.onMenu();
    }
  }

  _onSlideChange(index, dir) {
    this.refs.gradient.finishSlide(dir);
  }

  _onSlideNoChange(dir) {
    this.refs.gradient.finishNoSlide(dir);
  }

  _onScroll(dx) {
    this.refs.gradient.slide(dx);
  }

  get trackersView() {
    return this.refs.trackersView;
  }

  get newTrackerView() {
    return this.refs.newTrackerView;
  }

  _renderContent() {
    return (
      <View style={commonStyles.flexFilled}>
        <TrackersView
          ref='trackersView'
          posX={0}
          onScroll={this._onScroll.bind(this)}
          onSlideNoChange={this._onSlideNoChange.bind(this)}
          onSlideChange={this._onSlideChange.bind(this)}
          onRemove={this._removeTrackerEdit.bind(this)}
          onSave={this._saveTrackerEdit.bind(this)}
          onCancel={this._cancelTrackerEdit.bind(this)} />

        <NewTrackerView
          ref='newTrackerView'
          posX={1}
          onAccept={this._onAccept.bind(this)}
          onCancel={this._cancelNewTracker.bind(this)} />
      </View>
    );
  }

  render() {
    let { navigator } = this.props;

    let gradient = (
      <GradientSlider
        ref='gradient'
        style={commonStyles.absoluteFilled} />
    );
    return (
      <Screen
        ref='screen'
        navigator={navigator}
        background={gradient}
        content={this._renderContent()} />
    );
  }
};

module.exports = MainScreen;
