'use strict';

import React, { PureComponent, PropTypes } from 'react';

import { View, Text, StyleSheet, findNodeHandle } from 'react-native';

import styled from 'styled-components/native';

import NativeMethodsMixin from 'NativeMethodsMixin';

import moment from 'moment';

import Tooltip from '../tooltip/Tooltip';

import { screenWidth } from '../styles/common';

import Day from './Day';

import { caller, int } from '../../utils/lang';

const styles = StyleSheet.create({
  monthContainer: {
    position: 'relative',
    width: screenWidth,
    paddingLeft: 15,
    paddingRight: 15,
  },
  weekRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
  },
  tooltipContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const TickText = styled.Text`
  color: #f5f5f5;
  font-size: 15px;
  padding-bottom: ${({ isLast }) => (isLast ? 0 : 5)}px;
`;

const PADDING = 15;

export default class Month extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooltipShown: false,
    };
    this.dayWidth = 0;
    this.dayHeight = 0;
    this.selectDate = ::this.selectDate;
  }

  componentWillReceiveProps({ selDateMs }) {
    if (this.props.selDateMs !== selDateMs) {
      const { shown, ticks } = this.props;
      this.state.tooltipShown =
        shown && selDateMs && !!ticks[moment(selDateMs).date() - 1];
    }
  }

  componentDidUpdate() {
    const dayView = this.refs['day1'];
    const dayNode = findNodeHandle(dayView);
    NativeMethodsMixin.measure.call(dayNode, (dx, dy, width, height) => {
      this.dayWidth = width;
      this.dayHeight = height;
    });
  }

  render() {
    const { monthMs, todayMs, selectedDateMs, ticks } = this.props;

    const startOfMonth = moment(monthMs).startOf('month');
    const endOfMonth = moment(monthMs).endOf('month');
    const startOffset = startOfMonth.weekday();
    const endOffset = 6 - endOfMonth.weekday();

    const startDay = moment(startOfMonth).subtract(startOffset, 'day');
    const endDay = moment(endOfMonth).add(endOffset, 'day');
    const weekRows = [];
    let days = [];
    let daysCount = 0;
    while (startDay.isBefore(endDay)) {
      const isoWeekday = startDay.isoWeekday();
      const isOutDay = startDay.month() !== startOfMonth.month();
      const dayIndex = startDay.date() - 1;
      days.push(
        <Day
          key={startDay.valueOf()}
          ref={`day${daysCount++}`}
          onPress={this.selectDate}
          value={startDay.date()}
          isToday={startDay.isSame(todayMs, 'day')}
          isSelected={startDay.isSame(selectedDateMs, 'day')}
          hasTicks={!isOutDay ? !!ticks[dayIndex] : false}
          isOutDay={isOutDay}
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

    const { tooltipShown } = this.state;
    return (
      <View style={styles.monthContainer}>
        {tooltipShown ? this.renderTooltip() : null}
        {weekRows}
      </View>
    );
  }

  selectDate(day: number) {
    const { monthMs } = this.props;
    this.setState({ tooltipShown: false }, () => {
      const dateMs = moment(monthMs).date(day).valueOf();
      caller(this.props.onDateSelect, dateMs);
    });
  }

  renderTooltip() {
    const { ticks, selectedDateMs } = this.props;
    const dayIndex = moment(selectedDateMs).date() - 1;
    const ticksToRender = ticks[dayIndex].slice(0, 2);
    const tickList = ticksToRender.map((tick, index) => {
      const timeStr = moment(tick.dateMs).format('LT');
      return (
        <TickText key={index} isLast={index === ticksToRender.length - 1}>
          {`${timeStr} ${tick.desc}`}
        </TickText>
      );
    });

    const tooltipPos = this.getTooltipPos(selectedDateMs);
    return (
      <Tooltip x={tooltipPos.x} y={tooltipPos.y}>
        <View style={styles.tooltipContent}>
          {tickList}
        </View>
      </Tooltip>
    );
  }

  getTooltipPos(selDateMs) {
    const { monthMs } = this.props;
    const day = moment(selDateMs).date();
    const startOfMonth = moment(monthMs).startOf('month');
    const offset = startOfMonth.weekday();
    const week = int((offset + day - 1) / 7);
    const dayInd = moment(selDateMs).weekday();
    const dWidth = (screenWidth - 2 * PADDING - this.dayWidth) / 6;
    return {
      x: PADDING + dWidth * dayInd + this.dayWidth / 2,
      y: this.dayHeight * week,
    };
  }
}
