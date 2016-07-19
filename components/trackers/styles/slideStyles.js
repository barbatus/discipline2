'use strict';

import React from 'react';

import {StyleSheet} from 'react-native';

import {screenWidth, screenHeight, navHeight} from '../../styles/common';

export const slideWidth = screenWidth - 40;

export const slideHeight = screenHeight - navHeight - 35;

export const slideDef = {
  slide: {
    width: slideWidth,
    height: slideHeight,
    alignItems: 'center'
  },
  innerView: {
    width: slideWidth,
    height: slideHeight,
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

export const slideStyles = StyleSheet.create({
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

