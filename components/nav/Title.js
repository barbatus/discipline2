import React, { PureComponent } from 'react';
import { View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

export default class NavTitle extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
  };

  static defaultProps = {
    style: null,
    title: null,
  };

  render() {
    const { style } = this.props;
    const navTitle = (
      <View style={[styles.navTitle, style]}>
        <Text style={styles.navTitleText}>
          {this.props.title}
        </Text>
      </View>
    );

    return navTitle;
  }
}
