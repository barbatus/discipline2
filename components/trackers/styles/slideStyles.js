import { StyleSheet } from 'react-native';

import { screenWidth, screenHeight, navHeight } from '../../styles/common';

export const slideWidth = screenWidth - 40;

export const slideHeight = screenHeight - navHeight - 35;

export const slideDef = {
  slide: {
    width: slideWidth,
    height: slideHeight,
    alignItems: 'center',
  },
  innerView: {
    width: slideWidth,
    height: slideHeight,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 2,
      width: 0,
    },
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
