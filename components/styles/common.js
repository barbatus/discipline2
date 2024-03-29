import { StyleSheet, Dimensions } from 'react-native';

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

export const IS_IPHONE5 = window.width <= 320;

export const HINT_COLOR = '#DFDFDF';

export const WHITE_COLOR = '#F5F5F5';

export const LINK_COLOR = '#1A7CF9';

export const MAIN_TEXT = '#4A4A4A';

export const NAV_HEIHGT = 54;

export const SCREEN_WIDTH = window.width;

export const SCREEN_HEIGHT = window.height >= 812 ? 667 : window.height;

export const WIN_HEIGHT = window.height;

export const OFFSET_TOP = (WIN_HEIGHT - SCREEN_HEIGHT) / 2;

export const CONTENT_HEIGHT = SCREEN_HEIGHT - NAV_HEIHGT;

export const CONTENT_TOP_MARGIN = window.height >= 812 ? 10 : 0;

export const MENU_WIDTH = SCREEN_WIDTH / 2 + 25;

export const CONTENT_OFFSET = OFFSET_TOP + NAV_HEIHGT + CONTENT_TOP_MARGIN;
