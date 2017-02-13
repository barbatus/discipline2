'use strict';

import {Dimensions, StyleSheet} from 'react-native';

import {screenWidth} from '../styles/common';

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthContainer: {
    width: screenWidth,
  },
  calendarControls: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row'
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    color: 'white',
    fontWeight: '200',
  },
  calendarHeading: {
    flexDirection: 'row',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  dayHeading: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 5,
    color: 'white',
    fontWeight: '200',
  },
  weekendHeading: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 5,
    color: 'white',
    fontWeight: '200',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 0,
    width: screenWidth / 7,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  dayText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '300',
  },
  outDayText: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  dayCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 33,
    height: 33,
    borderRadius: 16,
  },
  currentDayCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  currentDayText: {
    color: 'white',
  },
  selectedDayCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  selectedDayText: {
    color: 'white',
  },
  weekendDayText: {
    color: 'white',
  },
  tickPoint: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    left: 27,
    top: 3,
  },
});

export default styles;
