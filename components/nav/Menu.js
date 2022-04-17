import React, { PureComponent } from 'react';
import { StyleSheet, Switch, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

import { DEBUG_MENU } from 'app/env';
import { SLIDE_WIDTH_OFFSET, SLIDE_HEIGHT } from 'app/components/trackers/styles/slideStyles';
import { CONTENT_TOP_MARGIN } from 'app/components/styles/common';

import menuStyles, { MENU_TEXT_COLOR } from './styles';
import Debug from './Debug';

export const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: 'center',
  },
  menuContent: {
    top: CONTENT_TOP_MARGIN,
    height: SLIDE_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  prop: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: SLIDE_WIDTH_OFFSET / 2,
    marginBottom: 20,
  },
  lastProp: {
    marginBottom: 30,
  },
  label: {
    ...menuStyles.menuText,
    marginRight: 5,
    width: 120,
  },
  ver: {
    ...menuStyles.menuText,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default class Menu extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    props: PropTypes.object.isRequired,
    onAlertChange: PropTypes.func.isRequired,
    onMeasureChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: null,
  };

  render() {
    const { style, props, onMeasureChange, onAlertChange } = this.props;
    const justify = DEBUG_MENU ? { justifyContent: 'space-between' } : null;
    return (
      <View style={styles.menu}>
        <View style={[styles.menuContent, style, justify]}>
          {DEBUG_MENU && <Debug />}
          <View>
            <View style={styles.prop}>
              <Text style={styles.label}>
                Metric System
              </Text>
              <Switch
                onValueChange={onMeasureChange}
                value={props.metric}
              />
            </View>
            <View style={[styles.prop, styles.lastProp]}>
              <Text style={styles.label}>
                Notifications
              </Text>
              <Switch
                onValueChange={onAlertChange}
                value={props.alerts}
              />
            </View>
            <View>
              <Text style={styles.ver}>
                {DeviceInfo.getVersion()}
                {'v'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
