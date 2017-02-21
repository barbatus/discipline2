'use strict';

import React, {Component} from 'react';

import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';

import {connect} from 'react-redux';

import {
  NavAddButton,
  NavMenuButton,
  NavCancelButton,
  NavAcceptButton,
  NavBackButton,
} from '../nav/buttons';

import Animation from '../animation/Animation';

import Screen from './Screen';
import ScreenView from './ScreenView';

import TrackersView from './TrackersView';
import NewTrackerView from './NewTrackerView';

import IconsDlg from '../dlg/IconsDlg';
import MapsDlg from '../dlg/MapsDlg';
import registry, {DlgType} from '../dlg/registry';

import {addTracker} from '../../model/actions';

import GradientSlider from '../common/GradientSlider';

import {commonStyles} from '../styles/common';

import {caller} from '../../utils/lang';

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      active: false,
    };
  }

  shouldComponentUpdate(props, state) {
    return false;
  }

  componentDidMount() {
    registry.register(DlgType.ICONS, this.refs.iconsDlg);
    registry.register(DlgType.MAPS, this.refs.mapsDlg);
    this._setMainViewBtns();
  }

  get trackersView() {
    return this.refs.trackersView.getWrappedInstance();
  }

  get newTrackView() {
    return this.refs.newTrackView;
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
    const navBar = this.refs.screen.navBar;
    if (navBar) {
      navBar.setTitle('Trackers');
      navBar.setButtons(
        this._getMenuBtn(this._onMenuToggle),
        this._getNewBtn(this._onNewTracker),
        callback);
    }
  }

  // New tracker events.

  _onAccept(tracker) {
    if (this.state.active) return;

    this.setState({active: true});
    this.props.onAdd(tracker, this.state.index + 1);
  }

  _onAddCompleted() {
    this._setMainViewBtns();

    this.trackersView.setHidden();
    this.trackersView.setRight();
    this.newTrackView.hide(() => {
      this.newTrackView.setRight();
      this.newTrackView.setShown();
    });
    this.trackersView.show(() => {
      this.setState({active: false});
    });
  }

  _cancelNewTracker() {
    if (Animation.on) return;

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
    const dir = (index - previ) >= 0 ? 1 : -1;
    this.refs.gradient.finishSlide(dir);
    this.setState({
      index,
    })
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
          onAddCompleted={::this._onAddCompleted}
          onRemoveCompleted={::this._setMainViewBtns}
          onSaveCompleted={::this._setMainViewBtns}
          onCancel={::this._setMainViewBtns}
        />
        <NewTrackerView
          ref='newTrackView'
          posX={1}
          onAccept={::this._onAccept}
          onCancel={::this._cancelNewTracker}
        />
        <IconsDlg ref='iconsDlg' />
        <MapsDlg ref='mapsDlg' />
      </View>
    );
  }

  render() {
    const { navigator } = this.props;

    const gradient = (
      <GradientSlider
        ref='gradient'
        style={commonStyles.absFilled}
      />
    );
    return (
      <Screen
        ref='screen'
        navigator={navigator}
        background={gradient}
        content={this._renderContent()}
      />
    );
  }
};

export default connect(null,
  dispatch => {
    return {
      onAdd: (tracker, index) => dispatch(
        addTracker(tracker, index))
    };
  }
)(MainScreen);
