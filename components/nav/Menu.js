import React from 'react';

import { pure } from 'recompose';

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

export default pure(() => <ScrollView style={styles.menu} />);
