'use strict';

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navTitle: {
    marginVertical: -10
  },
  navTitleText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFF'
  },
  navBarIcon: {
    marginVertical: 10,
    resizeMode: 'contain',
    height: 23,
    width: 23
  },
  // menuIcon: {
  //   height: 17,
  //   width: 24
  // },
  backIcon: {
    height: 30,
    width: 15
  },
  navBarTitleText: {
    color: 'black',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 0
  },
  navBarRightButton: {
    paddingRight: 20,
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 0
  },
  navBarButtonText: {
    color: '#1A7CF9'
  }
});

module.exports = styles;
