import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';

import registry, { DlgType } from 'app/components/dlg/registry';
import IconsDlg from 'app/components/dlg/IconsDlg';
import MapsDlg from 'app/components/dlg/MapsDlg';
import TicksDlg from 'app/components/dlg/TicksDlg';

import { commonStyles as cs, screenWidth, screenHeight } from 'app/components/styles/common';

import Menu from '../nav/Menu';
import GradientSlider from '../common/GradientSlider2';

import Screen from './Screen';
import MainScreenView from './MainScreenView';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
  },
});

export class MainScreen extends PureComponent {
  static propTypes = {
    slides: PropTypes.number.isRequired,
    navigator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    console.log('----MainScreenView----');

    this.state = {
      isOpen: false,
    };
    this.onMenu = ::this.onMenu;
    this.onMenuChange = ::this.onMenuChange;
    this.onScroll = ::this.onScroll;
    this.onSlideChange = ::this.onSlideChange;
    this.onSlideNoChange = ::this.onSlideNoChange;
  }

  componentDidMount() {
    registry.register(DlgType.ICONS, this.iconsDlg);
    registry.register(DlgType.MAPS, this.mapsDlg);
    registry.register(DlgType.TICKS, this.ticksDlg);
  }

  onSlideChange(index, previ, animated) {
    this.gradient.finishSlide(index, previ, animated);
  }

  onSlideNoChange() {
    this.gradient.finishNoSlide();
  }

  onScroll(dx) {
    this.gradient.slide(dx);
  }

  onMenuChange(isOpen) {
    this.setState({
      isOpen,
    });
  }

  onMenu() {
    this.setState({
      isOpen: true,
    });
  }

  renderContent() {
    return (
      <MainScreenView
        {...this.props}
        onMenu={this.onMenu}
        onScroll={this.onScroll}
        onSlideChange={this.onSlideChange}
        onSlideNoChange={this.onSlideNoChange}
      />
    );
  }

  render() {
    const { slides, navigator } = this.props;
    const { isOpen } = this.state;
    return (
      <View style={cs.flexFilled}>
        <View style={styles.background}>
          <GradientSlider
            ref={(el) => (this.gradient = el)}
            style={cs.absFilled}
            slides={slides || 1}
          />
        </View>
        <SideMenu
          disableGestures
          menu={<Menu navigator={navigator} />}
          isOpen={isOpen}
          onChange={this.onMenuChange}
        >
          <Screen navigator={navigator}>
            <MainScreenView
              {...this.props}
              onMenu={this.onMenu}
              onScroll={this.onScroll}
              onSlideChange={this.onSlideChange}
              onSlideNoChange={this.onSlideNoChange}
            />
          </Screen>
        </SideMenu>
        <IconsDlg ref={(el) => (this.iconsDlg = el)} />
        <MapsDlg ref={(el) => (this.mapsDlg = el)} />
        <TicksDlg ref={(el) => (this.ticksDlg = el)} />
      </View>
    );
  }
}

export default connect(({ trackers }) => ({
  slides: trackers.trackers.size,
}))(MainScreen);
