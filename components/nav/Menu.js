import React, { Component } from 'react';

import { StyleSheet, ScrollView } from 'react-native';

import { screenWidth, screenHeight } from '../styles';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'gray',
    padding: 20,
  },
});

export default class Menu extends Component {
  render() {
    return <ScrollView style={styles.menu} />;
  }
}
