'use strict';

import React, { PureComponent, PropTypes } from 'react';

import { View, StyleSheet } from 'react-native';

import moment from 'moment';

import Day from './Day';

import styles from './styles';

import { caller } from '../../utils/lang';

export default class Month extends PureComponent {
  render() {
    const {
      customStyle,
      monthMs,
      todayMs,
      selectedDateMs,
      tickDates,
    } = this.props;

    const startOfMonth = moment(monthMs).startOf('month'),
      endOfMonth = moment(monthMs).endOf('month'),
      startOffset = startOfMonth.weekday(),
      endOffset = 6 - endOfMonth.weekday(),
      today = moment(todayMs),
      selectedDate = moment(selectedDateMs);

    const startDay = moment(startOfMonth).subtract(startOffset, 'day');
    const endDay = moment(endOfMonth).add(endOffset, 'day');
    let days = [];
    let weekRows = [];
    while (startDay.isBefore(endDay)) {
      const isoWeekday = startDay.isoWeekday();
      const isOutDay = startDay.month() !== startOfMonth.month();
      const dayIndex = startDay.date() - 1;
      days.push(
        <Day
          key={startDay.valueOf()}
          onPress={this._selectDate.bind(this, startDay.valueOf())}
          caption={startDay.date()}
          isToday={startDay.isSame(today, 'day')}
          isSelected={startDay.isSame(selectedDate, 'day')}
          hasTick={!isOutDay && tickDates[dayIndex] === true}
          customStyle={customStyle}
          outDay={isOutDay}
        />,
      );
      if (startDay.weekday() === 6) {
        weekRows.push(
          <View key={weekRows.length} style={styles.weekRow}>
            {days}
          </View>,
        );
        days = [];
      }
      startDay.add(1, 'day');
    }

    return (
      <View style={styles.monthContainer}>
        {weekRows}
      </View>
    );
  }

  _selectDate(dateMs: number) {
    caller(this.props.onDateSelect, dateMs);
  }
}
