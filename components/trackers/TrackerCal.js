'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity
} from 'react-native';

import Calendar from '../calendar/Calendar';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

import {commonStyles} from '../styles/common';
import {slideWidth} from './styles/slideStyles';

import {caller} from '../../utils/lang';

export default class TrackerCal extends Component {
  _opacity = new Animated.Value(0);

  _upDown = new ScreenSlideUpDownAnim();

  constructor(props) {
    super(props);
    this._upDown.setOut();
  }

  setShown(value: number) {
    this._opacity.setValue(value);

    value === 0 ?
      this._upDown.setOut():
      this._upDown.setIn();
  }

  render() {
    const { style } = this.props;

    const calStyle = [style, this._upDown.style, {opacity: this._opacity}];

    return (
      <Animated.View style={calStyle}>
        <Calendar
          ref='calendar'
          customStyle={{
            calendarContainer: styles.container,
            monthContainer: styles.monthContainer,
            dayButton: styles.dayButton,
            day: styles.day,
            calendarHeading: styles.calendarHeading,
            dayHeading: styles.dayHeading,
            weekendHeading: styles.weekendHeading,
            title: styles.title,
            currentDayCircle: styles.currentDayCircle,
            dayCircleFiller: styles.dayCircleFiller,
            selectedDayCircle: styles.selectedDayCircle
          }}
          eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
          showControls={true}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
        />
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    top: -40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayButton: {
    borderTopColor: 'transparent',
    padding: 0
  },
  day: {
    fontSize: 18,
    color: 'white',
    fontWeight: '200'
  },
  weekendDayText: {
    color: 'white'
  },
  selectedDayText: {
    color: 'white'
  },
  currentDayText: {
    color: 'white'
  },
  calendarHeading: {
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  dayHeading: {
    color: 'white',
    fontSize: 13,
    fontWeight: '100'
  },
  weekendHeading: {
    color: 'white',
    fontSize: 13,
    fontWeight: '100'
  },
  title: {
    fontSize: 19,
    color: 'white',
    fontWeight: '200'
  },
  currentDayCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
  },
  selectedDayCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  dayCircleFiller: {
    width: 35,
    height: 35,
    borderRadius: 17
  }
});
