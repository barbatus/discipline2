import React, { PureComponent } from 'react';
import {
  UIManager,
  View,
  StyleSheet,
  findNodeHandle,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import { caller, int } from 'app/utils/lang';
import { getIcon } from 'app/icons/icons';
import CopilotStep from 'app/components/copilot/CopilotStep';
import CopilotStepEnum from 'app/components/copilot/steps';

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
  iconBack: {
    position: 'absolute',
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  iconRight: {
    left: 10,
  },
});

const TextRow = styled.View`
  flex-direction: row;
  align-items: center;
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
  margin-top: 5px;
`;

const TimeText = styled(TickText)`
  color: ${HINT_COLOR};
  margin-right: 5px;
`;

const TotalView = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  opacity: 0.5;
`;

const PrevView = styled(TotalView)`
  margin-top: 10px;
`;

const TotalText = styled.Text`
  color: ${WHITE_COLOR};
  font-size: 40px;
  font-weight: 200;
`;

const PrevIcon = styled.View`
  display: flex;
  flex-direction: row;
  width: 20px;
  height: 20px;
`;

const PrevText = styled.Text`
  color: ${WHITE_COLOR};
  font-size: 25px;
  font-weight: 200;
`;

export default class Month extends PureComponent {
  dayRef = React.createRef();

  static propTypes = {
    ticks: PropTypes.instanceOf(Map),
    toggleTooltip: PropTypes.bool,
    monthMs: PropTypes.number.isRequired,
    todayMs: PropTypes.number.isRequired,
    totalDesc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prevDesc: PropTypes.string,
    onDateSelect: PropTypes.func.isRequired,
    onTooltipClick: PropTypes.func.isRequired,
    onDayLongPress: PropTypes.func,
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
    this.onTooltipClick = ::this.onTooltipClick;
    this.onDayLongPress = ::this.onDayLongPress;
  }

  static getDerivedStateFromProps({ toggleTooltip, index }, prevState) {
    if (
      toggleTooltip !== prevState.toggleTooltip ||
      index !== prevState.index
    ) {
      return { index, toggleTooltip, selDateMs: null, tooltipShown: false };
    }
    return null;
  }

  componentDidUpdate() {
    if (!this.dayWidth) {
      const dayNode = findNodeHandle(this.dayRef.current);
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
    const dWidth = (SCREEN_WIDTH - 2 * PADDING - this.dayWidth) / 6;
    return {
      x: PADDING + dWidth * dayInd + this.dayWidth / 2,
      y: this.dayHeight * week,
    };
  }

  getDayTicks(selDateMs) {
    const { ticks } = this.props;
    const dayIndex = moment(selDateMs).date() - 1;
    return ticks.get(dayIndex);
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

  onTooltipClick() {
    const { onTooltipClick } = this.props;
    const { selDateMs } = this.state;

    const { ticks: dayTicks } = this.getDayTicks(selDateMs);
    onTooltipClick(dayTicks);
  }

  onDayLongPress(day: number) {
    const { monthMs, onDayLongPress } = this.props;
    const selDateMs = moment(monthMs).date(day).valueOf();
    caller(onDayLongPress, selDateMs);
  }

  renderTooltip() {
    const { selDateMs } = this.state;

    const { totalDesc, ticks: dayTicks } = this.getDayTicks(selDateMs);
    const tooltipPos = this.getTooltipPos(selDateMs);

    if (dayTicks.length > 1) {
      return (
        <Tooltip
          x={tooltipPos.x}
          y={tooltipPos.y}
          onTooltipClick={this.onTooltipClick}
        >
          <View style={styles.ticksContent}>
            <TextRow>
              <TimeText>Total:</TimeText>
              <TickText>{totalDesc}</TickText>
            </TextRow>
          </View>
          <MoreText>
            More
            <Icon
              name="arrow-top-right-bold-outline"
              style={styles.tooltipLinkIcon}
            />
          </MoreText>
        </Tooltip>
      );
    }

    const { timeDesc, shortDesc } = dayTicks[0];
    return (
      <Tooltip
        x={tooltipPos.x}
        y={tooltipPos.y}
        onTooltipClick={this.onTooltipClick}
      >
        <View style={styles.ticksContent}>
          <TextRow>
            <TimeText>{timeDesc}:</TimeText>
            <TickText>{shortDesc}</TickText>
          </TextRow>
        </View>
      </Tooltip>
    );
  }

  renderTotal() {
    const { totalDesc, prevDesc, ticks } = this.props;
    if (totalDesc || prevDesc) {
      return totalDesc ? (
        <TotalView>
          <TotalText>=</TotalText>
          <TotalText>{totalDesc}</TotalText>
        </TotalView>
      ) : (
        <PrevView>
          <PrevIcon>
            <Image style={styles.iconBack} source={getIcon('back')} />
            <Image
              style={[styles.iconBack, styles.iconRight]}
              source={getIcon('back')}
            />
          </PrevIcon>
          <PrevText>{prevDesc}</PrevText>
        </PrevView>
      );
    }
    return null;
  }

  render() {
    const { monthMs, todayMs, ticks } = this.props;
    const { selDateMs } = this.state;

    const today = moment(todayMs);
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
          ref={this.dayRef}
          onPress={this.onSelectDate}
          onLongPress={this.onDayLongPress}
          value={startDay.date()}
          isToday={startDay.isSame(todayMs, 'day')}
          isSelected={startDay.isSame(selDateMs, 'day')}
          hasTicks={!isOutDay ? !!ticks.get(dayIndex) : false}
          isOutDay={isOutDay}
        />,
      );
      // 10th day is around the center
      if (today.month() === startDay.month() && startDay.date() === 10) {
        const dayElem = days.pop();
        days.push(
          <CopilotStep key="copilot" step={CopilotStepEnum.EDIT_PAST}>
            {dayElem}
          </CopilotStep>,
        );
      }
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
        {this.renderTotal()}
      </View>
    );
  }
}
