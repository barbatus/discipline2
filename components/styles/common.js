'use strict';

import React from 'react';

import { StyleSheet } from 'react-native';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

const commonDef = {
  flexFilled: {
    flex: 1
  },
  absoluteFilled: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
};

const commonStyles = StyleSheet.create({
  ...commonDef
});

module.exports = {
  commonStyles,
  commonDef
};
