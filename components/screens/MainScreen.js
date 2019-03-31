import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import { copilot } from '@okgrow/react-native-copilot';

import { updateAppProps } from 'app/model/actions';
import registry, { DlgType } from 'app/components/dlg/registry';
import IconsDlg from 'app/components/dlg/IconsDlg';
import MapsDlg from 'app/components/dlg/MapsDlg';
import TicksDlg from 'app/components/dlg/TicksDlg';

import {
  commonStyles as cs,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MENU_WIDTH,
} from 'app/components/styles/common';

import Menu from '../nav/Menu';
import GradientSlider from '../common/GradientSlider2';
import CopilotTooltip from '../copilot/Tooltip';

import Screen from './Screen';
import MainScreenView from './MainScreenView';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
});

export class MainScreen extends PureComponent {
  static propTypes = {
    slides: PropTypes.number.isRequired,
    navigator: PropTypes.object.isRequired,
    onUpdateAlerts: PropTypes.func.isRequired,
    onUpdateMetric: PropTypes.func.isRequired,
    app: PropTypes.object,
  };

  static defaultProps = {
    app: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      menuOpacity: 0,
    };
    this.onMenu = ::this.onMenu;
    this.onMenuChange = ::this.onMenuChange;
    this.onMenuSliding = ::this.onMenuSliding;
    this.onAlertChange = ::this.onAlertChange;
    this.onScroll = ::this.onScroll;
    this.onSlideChange = ::this.onSlideChange;
    this.onSlideNoChange = ::this.onSlideNoChange;
    this.onMeasureChange = ::this.onMeasureChange;
  }

  componentDidUpdate() {
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

  onMenuSliding(menuOpacity: number) {
    this.setState({
      menuOpacity,
    });
  }

  onMenu() {
    this.setState({
      isOpen: true,
    });
  }

  onMeasureChange(metric: boolean) {
    this.props.onUpdateMetric(metric);
  }

  onAlertChange(alerts: boolean) {
    this.props.onUpdateAlerts(alerts);
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

  renderMenu() {
    const { app } = this.props;
    const { menuOpacity } = this.state;
    const menuStyle = { opacity: menuOpacity };
    return (
      <Menu
        style={menuStyle}
        props={app.props}
        onAlertChange={this.onAlertChange}
        onMeasureChange={this.onMeasureChange}
      />
    );
  }

  render() {
    const { app, slides, navigator } = this.props;
    const { isOpen } = this.state;
    if (!app) { return null; }

    return (
      <>
        <View style={styles.background}>
          <GradientSlider
            ref={(el) => (this.gradient = el)}
            style={cs.absFilled}
            slides={slides}
          />
        </View>
        <SideMenu
          disableGestures
          menu={this.renderMenu()}
          isOpen={isOpen}
          openMenuOffset={MENU_WIDTH}
          onChange={this.onMenuChange}
          onSliding={this.onMenuSliding}
        >
          <Screen navigator={navigator}>
            { this.renderContent() }
          </Screen>
        </SideMenu>
        <IconsDlg ref={(el) => (this.iconsDlg = el)} />
        <MapsDlg ref={(el) => (this.mapsDlg = el)} />
        <TicksDlg ref={(el) => (this.ticksDlg = el)} />
      </>
    );
  }
}

const ScreenWithCopilot = copilot({
  overlay: 'svg',
  animated: true,
  stepNumberComponent: () => null,
  tooltipComponent: CopilotTooltip,
})(MainScreen);

export default connect(({ trackers: { trackers, app } }) => ({
  slides: trackers.size,
  app,
}), (dispatch) => ({
  onUpdateAlerts: (alerts) => dispatch(updateAppProps({ alerts })),
  onUpdateMetric: (metric) => dispatch(updateAppProps({ metric })),
}))(ScreenWithCopilot);
