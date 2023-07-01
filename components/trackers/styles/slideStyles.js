import { StyleSheet } from 'react-native';

import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  NAV_HEIHGT,
  IS_IPHONE5,
} from '../../styles/common';

export const SLIDE_WIDTH_OFFSET = 40;
export const SLIDE_BOTTOM_OFFSET = IS_IPHONE5 ? 35 : 45;

export const SLIDE_WIDTH = SCREEN_WIDTH - SLIDE_WIDTH_OFFSET;

export const SLIDE_HEIGHT = SCREEN_HEIGHT - NAV_HEIHGT - SLIDE_BOTTOM_OFFSET;

export const slideDef = {
  slide: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    alignItems: 'center',
  },
  innerView: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    opacity: 1,
    transform: [{ rotateY: '0deg' }],
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 0.2,
  },
  bodyContainer: {
    flex: 0.7,
  },
  footerContainer: {
    flex: 0.3,
  },
  borderRadius: {
    borderWidth: 0,
    borderRadius: 3,
  },
  borderTopRadius: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  borderBottomRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
};

export const slideStyles = StyleSheet.create({
  ...slideDef,
  innerView: {
    ...slideDef.innerView,
    ...slideDef.borderRadius,
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
    borderColor: 'red',
  },
});
