import React, { PureComponent } from 'react';

import { View } from 'react-native';

import { connect } from 'react-redux';

import Screen from './Screen';

import IconsDlg from '../dlg/IconsDlg';

import MapsDlg from '../dlg/MapsDlg';

import registry, { DlgType } from '../dlg/registry';

import GradientSlider from '../common/GradientSlider2';

import MainScreenView from './MainScreenView';

import { commonStyles as cs } from '../styles/common';

export class MainScreen extends PureComponent {
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
    registry.register(DlgType.ICONS, this.iconsDlg);
    registry.register(DlgType.MAPS, this.mapsDlg);
  }

  onSlideChange(index, previ, animated) {
    this.gradient.finishSlide(index + 1, previ, animated);
  }

  onSlideNoChange() {
    this.gradient.finishNoSlide();
  }

  onScroll(dx) {
    this.gradient.slide(dx);
  }

  renderContent() {
    return (
      <View style={cs.flexFilled}>
        <MainScreenView
          {...this.props}
          onScroll={this.onScroll}
          onSlideChange={this.onSlideChange}
          onSlideNoChange={this.onSlideNoChange}
        />
        <IconsDlg ref={(el) => (this.iconsDlg = el)} />
        <MapsDlg ref={(el) => (this.mapsDlg = el)} />
      </View>
    );
  }

  render() {
    const { slides, navigator } = this.props;
    const gradient = (
      <GradientSlider
        ref={(el) => (this.gradient = el)}
        style={cs.absFilled}
        index={1}
        slides={slides + 1}
      />
    );
    return (
      <Screen
        navigator={navigator}
        background={gradient}
        content={this.renderContent()}
      />
    );
  }
}

export default connect((state) => ({
  slides: state.trackers.trackers.size,
}))(MainScreen);
