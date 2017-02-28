'use strict';

import React, { Component } from 'react';

import { View } from 'react-native';

import Screen from './Screen';

import IconsDlg from '../dlg/IconsDlg';

import MapsDlg from '../dlg/MapsDlg';

import registry, { DlgType } from '../dlg/registry';

import GradientSlider from '../common/GradientSlider';

import MainScreenView from './MainScreenView';

import { commonStyles } from '../styles/common';

export default class MainScreen extends Component {
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
  }

  _onSlideChange(index, previ) {
    const dir = index - previ >= 0 ? 1 : -1;
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
        <MainScreenView
          {...this.props}
          onScroll={::this._onScroll}
          onSlideChange={::this._onSlideChange}
          onSlideNoChange={::this._onSlideNoChange}
        />
        <IconsDlg ref="iconsDlg" />
        <MapsDlg ref="mapsDlg" />
      </View>
    );
  }

  render() {
    const { navigator } = this.props;
    const gradient = (
      <GradientSlider ref="gradient" style={commonStyles.absFilled} />
    );
    return (
      <Screen
        ref="screen"
        navigator={navigator}
        background={gradient}
        content={this._renderContent()}
      />
    );
  }
}
