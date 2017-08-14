'use strict';

import { Dimensions, StyleSheet } from 'react-native';

import { screenWidth } from '../styles/common';

const styles = StyleSheet.create({
  calContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    width: screenWidth,
  },
  calControls: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  controlButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  navIcon: {
    resizeMode: 'contain',
    height: 23,
    width: 23,
  },
  calHeading: {
    width: screenWidth,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dayHeading: {
    fontSize: 13,
    width: 33,
    textAlign: 'center',
    marginVertical: 5,
    color: 'white',
    fontWeight: '200',
  },
  weekRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

export default styles;
