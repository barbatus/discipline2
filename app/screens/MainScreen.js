import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu-updated';
import { copilot } from 'react-native-copilot';

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
  iconsDlg = React.createRef();

  mapsDlg = React.createRef();

  ticksDlg = React.createRef();

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

  componentDidMount() {
    launchAlerts();
  }

  componentDidUpdate() {
    registry.register(DlgType.ICONS, this.iconsDlg.current);
    registry.register(DlgType.MAPS, this.mapsDlg.current);
    registry.register(DlgType.TICKS, this.ticksDlg.current);
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

  getMenuStyle(leftX) {
    return {
      overflow: 'visible',
      transform: [
        {
          translateX: leftX,
        },
      ],
    };
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

  render() {
    const { app, slides, navigator } = this.props;
    const { isOpen } = this.state;
    if (!app) {
      return null;
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <GradientSlider ref={(el) => (this.gradient = el)} slides={slides} />
        <SideMenu
          disableGestures
          menu={this.renderMenu()}
          isOpen={isOpen}
          openMenuOffset={MENU_WIDTH}
          onChange={this.onMenuChange}
          onSliding={this.onMenuSliding}
          animationStyle={this.getMenuStyle}
        >
          <Screen navigator={navigator}>{this.renderContent()}</Screen>
        </SideMenu>
        <IconsDlg ref={this.iconsDlg} />
        <MapsDlg ref={this.mapsDlg} />
        <TicksDlg ref={this.ticksDlg} />
      </SafeAreaView>
    );
  }
}

const circleSvgPath = ({ size, position, canvasSize }) =>
  Math.abs(size.x._value - size.y._value) <= 20
    ? `
  M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM ${position.x._value - 2}, ${
        position.y._value + size.y._value / 2
      }
    a ${size.x._value / 2 + 2},${size.x._value / 2 + 2} 0 1,0 ${
        size.x._value + 4
      },0
    a ${size.x._value / 2 + 2},${size.x._value / 2 + 2} 0 1,0 -${
        size.x._value + 4
      },0
  `
    : `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${position.x._value},${
        position.y._value
      }H${position.x._value + size.x._value}V${
        position.y._value + size.y._value
      }H${position.x._value}V${position.y._value}Z`;

const ScreenWithCopilot = copilot({
  overlay: 'svg',
  svgMaskPath: circleSvgPath,
  animated: true,
  stepNumberComponent: () => null,
  tooltipComponent: CopilotTooltip,
})(MainScreen);

export default connect(
  ({ trackers: { trackers, app } }) => ({
    // Keep +1 to adjust for the animation of the last track removal.
    slides: trackers.size + 1,
    app,
  }),
  (dispatch) => ({
    onUpdateAlerts: (alerts) => dispatch(updateAppProps({ alerts })),
    onUpdateMetric: (metric) => dispatch(updateAppProps({ metric })),
  }),
)(ScreenWithCopilot);
