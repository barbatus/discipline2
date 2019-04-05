import React, { PureComponent } from 'react';
import { View, StyleSheet, findNodeHandle, TouchableOpacity } from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import moment from 'moment';

import { caller, int } from 'app/utils/lang';

import Tooltip from '../tooltip/Tooltip';
import { SCREEN_WIDTH, HINT_COLOR } from '../styles/common';
import Day from './Day';

const styles = StyleSheet.create({
  monthContainer: {
    position: 'relative',
    width: SCREEN_WIDTH,
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
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const TextRow = styled.View`
  padding-bottom: ${({ isLast }) => (isLast ? 0 : 5)}px;
  flex-direction: row;
  align-items: center;
`;

const TextCol = styled.View`
  flex-direction: column;
  flex-wrap: nowrap;
`;

const TimeCol = styled(TextCol)`
  padding-right: 5px;
`;

const TickText = styled.Text`
  color: #F5F5F5;
  font-weight: 300;
`;

const TimeText = styled(TickText)`
  color: ${HINT_COLOR};
`;

const PADDING = 15;

export default class Month extends PureComponent {
  static propTypes = {
    ticks: PropTypes.instanceOf(Map),
    monthMs: PropTypes.number.isRequired,
    todayMs: PropTypes.number.isRequired,
    onDateSelect: PropTypes.func.isRequired,
    onTooltipClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ticks: new Map(),
  };

  constructor(props) {
    super(props);
    this.state = {
      selDateMs: null,
      tooltipShown: false,
    };
    this.dayWidth = 0;
    this.dayHeight = 0;
    this.selectDate = ::this.selectDate;
  }

  static getDerivedStateFromProps({ shown, index }, prevState) {
    if (shown !== prevState.shown || index !== prevState.index) {
      return { index, shown, tooltipShown: false };
    }
    return null;
  }

  componentDidUpdate() {
    if (!this.dayWidth) {
      const dayNode = findNodeHandle(this.dayRef);
      NativeMethodsMixin.measure.call(dayNode, (dx, dy, width, height) => {
        this.dayWidth = width;
        this.dayHeight = height;
      });
    }
  }

  getTooltipPos(selDateMs) {
    const { monthMs } = this.props;
    const day = moment(selDateMs).date();
    const startOfMonth = moment(monthMs).startOf('month');
    const offset = startOfMonth.weekday();
    const week = int((offset + day - 1) / 7);
    const dayInd = moment(selDateMs).weekday();
    const dWidth = (SCREEN_WIDTH - (2 * PADDING) - this.dayWidth) / 6;
    return {
      x: PADDING + (dWidth * dayInd) + (this.dayWidth / 2),
      y: this.dayHeight * week,
    };
  }

  selectDate(day: number) {
    const { selDateMs: curDateMs, tooltipShown: curTooltipShown } = this.state;    
    const { monthMs, ticks } = this.props;
    const selDateMs = moment(monthMs).date(day).valueOf();
    if (curDateMs === selDateMs) {
      this.setState({ tooltipShown: !curTooltipShown });
      return;
    }

    const tooltipShown = selDateMs ?
      ticks.has(moment(selDateMs).date() - 1) : false;
    this.setState({ selDateMs, tooltipShown });
    caller(this.props.onDateSelect, selDateMs);
  }

  renderTooltip() {
    const { ticks, onTooltipClick } = this.props;
    const { selDateMs } = this.state;

    const dayIndex = moment(selDateMs).date() - 1;
    const ticksShown = ticks.get(dayIndex).slice(0, 3);
    const size = ticksShown.length - 1;
    const tickTimes = ticksShown.map((tick, index) => {
      const timeStr = moment(tick.dateTimeMs).format('LT');
      return (
        <TextRow key={tick.dateTimeMs} isLast={index === size}>
          <TimeText>
            {timeStr}
            {':'}
          </TimeText>
        </TextRow>
      );
    });

    const tickDescs = ticksShown.map((tick, index) => (
      <TextRow key={tick.dateTimeMs} isLast={index === size}>
        <TickText>{tick.desc}</TickText>
      </TextRow>
    ));

    const tooltipPos = this.getTooltipPos(selDateMs);
    return (
      <Tooltip x={tooltipPos.x} y={tooltipPos.y}>
        <TouchableOpacity onPress={() => onTooltipClick(ticks.get(dayIndex))}>
          <View style={styles.tooltipContent}>
            <TimeCol>
              {tickTimes}
            </TimeCol>
            <TextCol>
              {tickDescs}
            </TextCol>
          </View>
        </TouchableOpacity>
      </Tooltip>
    );
  }

  render() {
    const { monthMs, todayMs, ticks } = this.props;
    const { selDateMs } = this.state;

    const startOfMonth = moment(monthMs).startOf('month');
    const endOfMonth = moment(monthMs).endOf('month');
    const startOffset = startOfMonth.weekday();
    const endOffset = 6 - endOfMonth.weekday();

    const startDay = moment(startOfMonth).subtract(startOffset, 'day');
    const endDay = moment(endOfMonth).add(endOffset, 'day');
    const weekRows = [];
    let days = [];
    while (startDay.isBefore(endDay)) {
      const isOutDay = startDay.month() !== startOfMonth.month();
      const dayIndex = startDay.date() - 1;
      days.push(
        <Day
          key={startDay.valueOf()}
          ref={(ref) => (this.dayRef = ref)}
          onPress={this.selectDate}
          value={startDay.date()}
          isToday={startDay.isSame(todayMs, 'day')}
          isSelected={startDay.isSame(selDateMs, 'day')}
          hasTicks={!isOutDay ? !!ticks.get(dayIndex) : false}
          isOutDay={isOutDay}
        />,
      );
      if (startDay.weekday() === 6) {
        weekRows.push(
          <View key={startDay.valueOf()} style={styles.weekRow}>
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
}
