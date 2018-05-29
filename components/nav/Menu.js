import React, { PureComponent } from 'react';
import { StyleSheet, Switch, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import {
  SLIDE_BOTTOM_OFFSET,
  SLIDE_WIDTH_OFFSET,
} from 'app/components/trackers/styles/slideStyles';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 0,
    paddingBottom: SLIDE_BOTTOM_OFFSET + 10,
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
    marginBottom: 0,
  },
  label: {
    color: 'white',
    marginRight: 10,
    fontSize: 18,
    width: 130,
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
            Imperial Metric
          </Text>
          <Switch
            onValueChange={onMeasureChange}
            value={!props.metric}
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
      </View>
    );
  }
}

