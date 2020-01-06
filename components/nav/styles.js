import { StyleSheet } from 'react-native';

import { HINT_COLOR } from '../styles/common';

export const MENU_TEXT_COLOR = HINT_COLOR;

const styles = StyleSheet.create({
  navTitle: {
    paddingBottom: 5,
  },
  navTitleText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white',
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
    color: '#1A7CF9',
  },
});

export default styles;
