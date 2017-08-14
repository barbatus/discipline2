'use strict';

import React, { PureComponent } from 'react';

import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';

import moment from 'moment';

import Calendar from '../calendar/Calendar';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

import { slideWidth } from './styles/slideStyles';

export default class TrackerCal extends PureComponent {
  _opacity = new Animated.Value(0);

  _upDown = new ScreenSlideUpDownAnim();

  constructor(props) {
    super(props);
    this.state = {
      shown: false,
    };
    this._upDown.setOut();
  }

  setShown(value: number) {
    this._opacity.setValue(value);

    value === 0 ? this._upDown.setOut() : this._upDown.setIn();

    if (value === 0) {
      this.setState({
        shown: false,
      });
    }
    if (value === 1) {
      this.setState({
        shown: true,
      });
    }
  }

  render() {
    const { style, ticks, todayMs, dateMs, onMonthChanged } = this.props;
    const { shown } = this.state;
    const tickDates = ticks.map(tick => moment(tick.dateTimeMs));

    const calStyle = [style, this._upDown.style, { opacity: this._opacity }];
    return (
      <Animated.View style={calStyle}>
        <Calendar
          ref="calendar"
          todayMs={todayMs}
          dateMs={dateMs}
          scrollEnabled
          showControls
          shown={shown}
          tickDates={tickDates}
          titleFormat="MMMM YYYY"
          prevButtonText="Prev"
          nextButtonText="Next"
          onMonthChanged={onMonthChanged}
        />
      </Animated.View>
    );
  }
}
