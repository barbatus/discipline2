import React, { PureComponent } from 'react';

import { View, Text } from 'react-native';

import styles from './styles';

export default class NavTitle extends PureComponent {
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
