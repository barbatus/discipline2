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

import Animation from '../animation/Animation';

import Screen from './Screen';

import ScreenView from './ScreenView';

import TrackersView from './TrackersView';

import NewTrackerView from './NewTrackerView';

import IconsDlg from '../dlg/IconsDlg';

import registry, {DlgType} from '../dlg/registry';

import Trackers from '../../model/Trackers';

import GradientSlider from '../common/GradientSlider';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

class MainScreen extends Component {
  _active = false;

  componentDidMount() {
    registry.register(DlgType.ICONS, this.refs.iconDlg);
    this._setMainViewBtns();
  }

  get trackersView() {
    return this.refs.trackersView;
  }

  get newTrackView() {
    return this.refs.newTrackView;
  }

  get _isActive() {
    return Animation.on;
  }

  _getNewBtn(onPress) {
    return (
      <NavAddButton onPress={this::onPress} />
    );
  }

  _getMenuBtn(onPress) {
    return (
      <NavMenuButton onPress={this::onPress} />
    );
  }

  _setMainViewBtns(callback?: Function) {
    let navBar = this.refs.screen.navBar;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this._getMenuBtn(this._onMenuToggle),
        this._getNewBtn(this._onNewTracker),
        callback);
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
    if (this._active) return;

    this._active = true;
    this.trackersView.addTracker(tracker, () => {
      this._setMainViewBtns();

      this.trackersView.setHidden();
      this.trackersView.setRight();
      this.newTrackView.hide(() => {
        this.newTrackView.setRight();
        this.newTrackView.setShown();
      });
      this.trackersView.show(() => {
        this._active = false;
      });
    });
  }

  _cancelNewTracker() {
    if (this._isActive) return;

    this._setMainViewBtns();
    ScreenView.moveRight([this.trackersView, this.newTrackView]);
  }

  _onNewTracker() {
    ScreenView.moveLeft([this.trackersView, this.newTrackView]);
  }

  // Common

  _onMenuToggle() {
    caller(this.props.onMenu);
  }

  _onSlideChange(index, previ) {
    let dir = Math.sign(index - previ);
    this.refs.gradient.finishSlide(dir);
  }

  _onSlideNoChange() {
    this.refs.gradient.finishNoSlide();
  }

  _onScroll(dx) {
    this.refs.gradient.slide(dx);
  }

  _renderContent() {
    return (
      <View style={commonStyles.flexFilled}>
        <TrackersView
          ref='trackersView'
          posX={0}
          onScroll={::this._onScroll}
          onSlideNoChange={::this._onSlideNoChange}
          onSlideChange={::this._onSlideChange}
          onRemove={::this._removeTrackerEdit}
          onSave={::this._saveTrackerEdit}
          onCancel={::this._cancelTrackerEdit} />

        <NewTrackerView
          ref='newTrackView'
          posX={1}
          onAccept={::this._onAccept}
          onCancel={::this._cancelNewTracker} />

        <IconsDlg ref='iconDlg' />
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
