import { StyleSheet } from 'react-native';
import Color from 'color';

import { HINT_COLOR, WHITE_COLOR, LINK_COLOR } from '../styles/common';

export const MENU_TEXT_COLOR = Color(HINT_COLOR).lighten(0.25).hex();

const styles = StyleSheet.create({
  navTitle: {
    paddingBottom: 5,
  },
  navTitleText: {
    fontSize: 18,
    fontWeight: '300',
    color: WHITE_COLOR,
  },
  menuText: {
    color: MENU_TEXT_COLOR,
    fontSize: 18,
    fontWeight: '200',
  },
  navBarIcon: {
    marginVertical: 10,
    resizeMode: 'contain',
    height: 23,
    width: 23,
  },
  cancelIcon: {
    height: 20,
    width: 20,
  },
  navBarTitleText: {
    color: 'black',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    marginLeft: 20,
  },
  navBarRightButton: {
    marginRight: 20,
  },
  navBarButtonText: {
    color: LINK_COLOR,
  },
});

export default styles;
