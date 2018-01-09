import React from 'react';

import { pure } from 'recompose';

import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
});

export default pure(() => <View style={styles.menu} />);
