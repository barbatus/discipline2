import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from '../styles/common';

const styles = StyleSheet.create({
  calContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 0,
    zIndex: 2,
    overflow: 'visible',
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
    width: SCREEN_WIDTH,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
  },
  dayHeading: {
    fontSize: 13,
    width: 33,
    textAlign: 'center',
    marginVertical: 5,
    color: 'white',
    fontWeight: '200',
  },
});

export default styles;
