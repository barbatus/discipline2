import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';
import { copilot } from '@okgrow/react-native-copilot';

import PushNotification from 'app/notifications';
import { launch as launchAlerts } from 'app/notifications/runner';
import { updateAppProps } from 'app/model/actions';
import registry, { DlgType } from 'app/components/dlg/registry';
import IconsDlg from 'app/components/dlg/IconsDlg';
import MapsDlg from 'app/components/dlg/MapsDlg';
import TicksDlg from 'app/components/dlg/TicksDlg';

import { MENU_WIDTH } from 'app/components/styles/common';

import Menu from 'app/components/nav/Menu';
import GradientSlider from 'app/components/common/GradientSlider2';
import CopilotTooltip from 'app/components/copilot/Tooltip';

import Screen from './Screen';
import MainScreenView from './MainScreenView';

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

  iconsDlg = React.createRef();

  mapsDlg = React.createRef();

  ticksDlg = React.createRef();

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

  componentDidMount() {
    launchAlerts();
  }

  componentDidUpdate() {
    registry.register(DlgType.ICONS, this.iconsDlg.current);
    registry.register(DlgType.MAPS, this.mapsDlg.current);
    registry.register(DlgType.TICKS, this.ticksDlg.current);
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
    if (alerts) {
      PushNotification.checkPermissions();
    }
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
      <SafeAreaView style={{ flex: 1 }}>
        <GradientSlider
          ref={(el) => (this.gradient = el)}
          slides={slides}
        />
        <SideMenu
          disableGestures
          menu={this.renderMenu()}
          isOpen={isOpen}
          openMenuOffset={MENU_WIDTH}
          onChange={this.onMenuChange}
          onSliding={this.onMenuSliding}
        >
          <Screen navigator={navigator}>
            {this.renderContent()}
          </Screen>
        </SideMenu>
        <IconsDlg ref={this.iconsDlg} />
        <MapsDlg ref={this.mapsDlg} />
        <TicksDlg ref={this.ticksDlg} />
      </SafeAreaView>
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
