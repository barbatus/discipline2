'use strict';

import React, {Component} from 'react';

import {View, Text, Image} from 'react-native';

import styles from './styles';

class NavTitle extends Component {
  render() {
    const navTitle = (
      <View style={styles.navTitle}>
        <Text style={styles.navTitleText}>
          {this.props.title}
        </Text>
      </View>
    );

    return navTitle;
  }
}

module.exports = NavTitle;
