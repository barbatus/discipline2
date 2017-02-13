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

import {caller} from '../../utils/lang';

export default class TrackerCal extends Component {
  _opacity = new Animated.Value(0);

  _upDown = new ScreenSlideUpDownAnim();

  constructor(props) {
    super(props);
    this._upDown.setOut();

    const { tracker } = this.props;
    this.state = {
      ticks: this._getTicks(tracker, moment()),
    };
  }

  shouldComponentUpdate(props, state) {
    return (this.props.tracker !== props.tracker ||
            this.state.ticks !== state.ticks);
  }

  setShown(value: number) {
    this._opacity.setValue(value);

    value === 0 ?
      this._upDown.setOut():
      this._upDown.setIn();
  }

  _getTicks(tracker, date) {
    const startDate = moment(date)
      .subtract(1, 'month')
      .startOf('month');
    const endDate = moment(date)
      .add(1, 'month')
      .endOf('month')
      .add(1, 'day');
    const ticks = depot.getTicks(
      tracker.id, startDate.valueOf(), endDate.valueOf());
    return ticks;
  }

  _onMonthChanged(date) {
    const { tracker } = this.props;
    this.setState({
      ticks: this._getTicks(tracker, date),
    });
  }

  render() {
    const { style, tracker } = this.props;
    const { ticks } = this.state;
    const tickDates = ticks.map(tick => moment(tick.dateTimeMs));

    const calStyle = [style, this._upDown.style, {opacity: this._opacity}];
    return (
      <Animated.View style={calStyle}>
        <Calendar
          ref='calendar'
          customStyle={{
            calendarContainer: styles.container,
          }}
          scrollEnabled={true}
          tickDates={tickDates}
          showControls={true}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onMonthChanged={::this._onMonthChanged}
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
