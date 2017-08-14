'use strict';

import React, { PureComponent } from 'react';

import { View } from 'react-native';

import Screen from './Screen';

import IconsDlg from '../dlg/IconsDlg';

import MapsDlg from '../dlg/MapsDlg';

import registry, { DlgType } from '../dlg/registry';

import GradientSlider from '../common/GradientSlider';

import MainScreenView from './MainScreenView';

import { commonStyles } from '../styles/common';

export default class MainScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      active: false,
    };
    this.onScroll = ::this.onScroll;
    this.onSlideChange = ::this.onSlideChange;
    this.onSlideNoChange = ::this.onSlideNoChange;
  }

  componentDidMount() {
    registry.register(DlgType.ICONS, this.refs.iconsDlg);
    registry.register(DlgType.MAPS, this.refs.mapsDlg);
  }

  onSlideChange(index, previ) {
    const dir = index - previ >= 0 ? 1 : -1;
    this.refs.gradient.finishSlide(dir);
  }

  onSlideNoChange() {
    this.refs.gradient.finishNoSlide();
  }

  onScroll(dx) {
    this.refs.gradient.slide(dx);
  }

  renderContent() {
    return (
      <View style={commonStyles.flexFilled}>
        <MainScreenView
          {...this.props}
          onScroll={this.onScroll}
          onSlideChange={this.onSlideChange}
          onSlideNoChange={this.onSlideNoChange}
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
        content={this.renderContent()}
      />
    );
  }
}
