'use strict';

import React, {Component} from 'react';

import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';

import Calendar from '../calendar/Calendar';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

import {commonStyles} from '../styles/common';
import {slideWidth} from './styles/slideStyles';

export default class TrackerCal extends Component {
  _opacity = new Animated.Value(0);

  _upDown = new ScreenSlideUpDownAnim();

  constructor(props) {
    super(props);
    this._upDown.setOut();
  }

  shouldComponentUpdate(props, state) {
    return this.props.ticks !== props.ticks;
  }

  setShown(value: number) {
    this._opacity.setValue(value);

    value === 0 ?
      this._upDown.setOut():
      this._upDown.setIn();
  }

  render() {
    const { style, ticks, todayMs, onMonthChanged } = this.props;
    const tickDates = ticks.map(tick => moment(tick.dateTimeMs));

    const calStyle = [style, this._upDown.style, {opacity: this._opacity}];
    return (
      <Animated.View style={calStyle}>
        <Calendar
          ref='calendar'
          customStyle={{
            calContainer: styles.container,
          }}
          todayMs={todayMs}
          scrollEnabled={true}
          tickDates={tickDates}
          showControls={true}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onMonthChanged={onMonthChanged}
        />
      </Animated.View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    top: -40,
  },
});
