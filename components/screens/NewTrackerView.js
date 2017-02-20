'use strict';

import React, {Component} from 'react';

import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Animated,
  ScrollView,
} from 'react-native';

import {
  NavCancelButton,
  NavAcceptButton,
  NavBackButton,
} from '../nav/buttons';

import Easing from 'Easing';

import Animation from '../animation/Animation';

import ScreenView from './ScreenView';

import NewTrackerSlide from '../trackers/slides/NewTrackerSlide';

import TrackerTypesSlide from '../trackers/slides/TrackerTypesSlide';

import Trackers from '../../model/Trackers';

import {commonDef, commonStyles, screenWidth} from '../styles/common';

import {caller} from '../../utils/lang';

export default class NewTrackerView extends ScreenView {
  constructor(props) {
    super(props);

    this.state = {
      tracker: Trackers.create({}),
      typeId: null,
    };
  }

  onLeftMove() {
    this.setState({
      tracker: Trackers.create({}),
      typeId: null,
    });

    this._setNewTrackerBtns();
  }

  shouldComponentUpdate(props, state) {
    return this.state.tracker !== state.tracker ||
           this.state.typeId !== state.typeId;
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
    const { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this._getCancelBtn(this.props.onCancel),
        this._getAcceptBtn(this._onAccept),
        callback);
    }
  }

  _setTrackerTypeBtns(callback?: Function) {
    const { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this._getCancelBtn(this._onTypeCancel),
        this._getAcceptBtn(this._onTypeAccept),
        callback);
    }
  }

  _onTrackerChange(tracker: Tracker) {
    this.setState({
      tracker,
    });
  }

  _onAccept() {
    caller(this.props.onAccept, this.state.tracker);
  }

  _onTypeCancel() {
    if (Animation.on) return;

    this._setNewTrackerBtns();
    this._moveTo(0);
  }

  _onTypeSelect() {
    if (Animation.on) return;

    this._setTrackerTypeBtns();
    this._moveTo(1);
  }

  _onTypeChosen(typeId) {
    this.setState({
      typeId,
    });
  }

  _onTypeAccept() {
    if (Animation.on) return;

    this._setNewTrackerBtns();
    this._moveTo(0);

    let { tracker, typeId } = this.state;
    tracker = Trackers.create(tracker);
    tracker.typeId = typeId;
    this.setState({
      tracker,
    });
  }

  _moveTo(index: number) {
    const scrollToX = index * screenWidth;
    this.refs.scroll.scrollTo({ y: 0, x: scrollToX, animated: true });
  }

  get content() {
    const { tracker } = this.state;

    return (
      <ScrollView
        ref='scroll'
        horizontal
        pagingEnabled
        scrollEnabled={false}
        //removeClippedSubviews
        scrollEventThrottle={1000}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets>
        <View key={0} style={styles.slideContainer}>
          <NewTrackerSlide
            tracker={tracker}
            onTypeSelect={::this._onTypeSelect}
            onTrackerChange={::this._onTrackerChange}
          />
        </View>
        <View key={1} style={styles.slideContainer}>
          <TrackerTypesSlide
            typeId={tracker.typeId}
            onTypeChosen={::this._onTypeChosen}
          />
        </View>
      </ScrollView>
    );
  }
};

NewTrackerView.contextTypes = {
  navBar: React.PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  slideContainer: {
    ...commonDef.flexFilled,
    width: screenWidth,
    alignItems: 'center',
  },
});
