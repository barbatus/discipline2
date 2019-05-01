import React, { PureComponent } from 'react';
import { StyleSheet, Switch, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';

import {
  SLIDE_WIDTH_OFFSET,
  SLIDE_HEIGHT,
} from 'app/components/trackers/styles/slideStyles';
import { CONTENT_OFFSET } from 'app/components/styles/common';

const MENU_COLOR = 'white';

const styles = StyleSheet.create({
  menu: {
    top: CONTENT_OFFSET,
    height: SLIDE_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  prop: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: SLIDE_WIDTH_OFFSET / 2,
    marginBottom: 20,
  },
  lastProp: {
    marginBottom: 30,
  },
  label: {
    color: MENU_COLOR,
    marginRight: 5,
    fontSize: 18,
    width: 120,
    fontWeight: '300',
  },
  ver: {
    color: MENU_COLOR,
    opacity: 0.8,
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
    return (
      <View style={[styles.menu, style]}>
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
    );
  }
}
