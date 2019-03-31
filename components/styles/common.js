import { StyleSheet } from 'react-native';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

export const commonDef = {
  flexFilled: {
    flex: 1,
  },
  absoluteFilled: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  absFilled: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const commonStyles = StyleSheet.create({
  ...commonDef,
});

export function isPhone5() {
  return window.width <= 320;
}

export const HINT_COLOR = '#DFDFDF';

export const NAV_HEIHGT = 64;

export const SCREEN_WIDTH = window.width;

export const SCREEN_HEIGHT = window.height;

export const MENU_WIDTH = SCREEN_WIDTH / 2 + 25;
