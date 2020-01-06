import React, { PureComponent } from 'react';
import { UIManager, View, StyleSheet, findNodeHandle, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { caller, int } from 'app/utils/lang';

import Tooltip from '../tooltip/Tooltip';
import { SCREEN_WIDTH, HINT_COLOR, WHITE_COLOR } from '../styles/common';
import Day from './Day';

const PADDING = 15;

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
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticksContent: {
    flex: 1,
    flexWrap: 'nowrap',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tooltipLinkIcon: {
    fontSize: 10,
    color: WHITE_COLOR,
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
  color: ${WHITE_COLOR};
  font-weight: 300;
  font-size: 16px;
`;

const MoreText = styled.Text`
  color: ${WHITE_COLOR};
  font-weight: 300;
  font-size: 10px;
  marginTop: 5px;
`;

const TimeText = styled(TickText)`
  color: ${HINT_COLOR};
`;

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
    this.onSelectDate = ::this.onSelectDate;
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
      UIManager.measure(dayNode, (dx, dy, width, height) => {
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

  onSelectDate(day: number) {
    const { selDateMs: curDateMs, tooltipShown: curTooltipShown } = this.state;
    const { monthMs, ticks } = this.props;
    const selDateMs = moment(monthMs).date(day).valueOf();
    const dateHasTicks = ticks.has(moment(selDateMs).date() - 1);
    if (curDateMs === selDateMs) {
      this.setState({ tooltipShown: dateHasTicks && !curTooltipShown });
      return;
    }

    const tooltipShown = selDateMs ? dateHasTicks : false;
    this.setState({ selDateMs, tooltipShown });
    caller(this.props.onDateSelect, selDateMs);
  }

  renderTooltip() {
    const { ticks, onTooltipClick } = this.props;
    const { selDateMs } = this.state;

    const dayIndex = moment(selDateMs).date() - 1;
    const dayTicks = ticks.get(dayIndex);
    const ticksShown = dayTicks.slice(0, 3);
    const shownSize = ticksShown.length - 1;
    const tickTimes = ticksShown.map((tick, index) => {
      const timeStr = moment(tick.createdAt).format('LT');
      return (
        <TextRow key={tick.createdAt} isLast={index === shownSize}>
          <TimeText>
            {timeStr}
            {':'}
          </TimeText>
        </TextRow>
      );
    });

    const tickDescs = ticksShown.map((tick, index) => (
      <TextRow key={tick.createdAt} isLast={index === shownSize}>
        <TickText>{tick.desc}</TickText>
      </TextRow>
    ));

    const tooltipPos = this.getTooltipPos(selDateMs);
    const hasMore = dayTicks.length > 3 || dayTicks.some(tick => tick.hasMore);
    return (
      <Tooltip x={tooltipPos.x} y={tooltipPos.y}>
        <TouchableOpacity
          hitSlop={{ bottom: 15, right: 15 }}
          onPress={() => onTooltipClick(dayTicks)}
        >
          <View style={styles.tooltipContent}>
            <View style={styles.ticksContent}>
              <TimeCol>
                {tickTimes}
              </TimeCol>
              <TextCol>
                {tickDescs}
              </TextCol>
            </View>
            {hasMore ? (
              <MoreText>
                More
                <Icon
                  name="arrow-top-right-bold-outline"
                  style={styles.tooltipLinkIcon}
                />
              </MoreText>
            ) : null}
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
          onPress={this.onSelectDate}
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
