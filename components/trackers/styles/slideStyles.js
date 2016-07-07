'use strict';

import React from 'react';

import {StyleSheet} from 'react-native';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

const slideDef = {
  slide: {
    //flex: 1,
    //width: window.width - 40,
    height: window.height - 64,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    //height: window.height - 60,
    width: window.width - 40
  },
  innerView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    },
    opacity: 1,
    transform: [{rotateY: '0deg'}],
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 0.2,
    backgroundColor: 'white'
  },
  bodyContainer: {
    flex: 0.5,
    backgroundColor: 'white'
  },
  footerContainer: {
    flex: 0.3,
    backgroundColor: 'white'
  },
  borderRadius: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: 'transparent'
  },
  borderTopRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  borderBottomRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  }
};

const slideStyles = StyleSheet.create({
  ...slideDef,
  innerView: {
    ...slideDef.innerView,
    ...slideDef.borderRadius
  },
  headerContainer: {
    ...slideDef.headerContainer,
    ...slideDef.borderRadius,
    ...slideDef.borderTopRadius,
  },
  footerContainer: {
    ...slideDef.footerContainer,
    ...slideDef.borderRadius,
    ...slideDef.borderBottomRadius,
  }
});

module.exports = {
  slideStyles,
  slideDef
};
