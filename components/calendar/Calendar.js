import React, { PureComponent } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import { caller, int } from 'app/utils/lang';
import time from 'app/time/utils';
import { Tick } from 'app/model/Tracker';

import { SCREEN_WIDTH } from '../styles/common';
import Month from './Month';
import styles from './styles';

export default class Calendar extends PureComponent {
  static propTypes = {
    ticks: PropTypes.instanceOf(Map),
    // Prev tick for the current month.
    prevTick: PropTypes.instanceOf(Tick),
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    titleFormat: PropTypes.string,
    todayMs: PropTypes.number,
    weekStart: PropTypes.number,
    monthToRender: PropTypes.number,
    monthDateMs: PropTypes.number,
    // TODO: for time being
    toggleTooltip: PropTypes.bool,
    showTotal: PropTypes.bool,
    onDateSelect: PropTypes.func,
    onMonthChanged: PropTypes.func.isRequired,
    onTooltipClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ticks: new Map(),
    customStyle: {},
    dayHeadings: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
    titleFormat: 'MMMM YYYY',
    todayMs: moment().valueOf(),
    monthDateMs: time.getCurMonthDateMs(),
    weekStart: moment().weekday(0).isoWeekday() - 1,
    monthToRender: 3,
    onDateSelect: null,
    toggleTooltip: false,
  };

  calendar = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
    this.selectDate = ::this.selectDate;
    this.scrollEnded = ::this.scrollEnded;
  }

  componentDidMount() {
    const index = int(this.props.monthToRender / 2);
    this.scrollToItem(index, false);
  }

  componentDidUpdate() {
    const index = int(this.props.monthToRender / 2);
    this.scrollToItem(index, false);
  }

  getMonthsToRender(monthMs: number) {
    const months = [];
    const index = int(this.props.monthToRender / 2);
    for (let i = -index; i <= index; i += 1) {
      months.push(moment(monthMs).add(i, 'month'));
    }
    return months;
  }

  selectDate(dateMs: number) {
    caller(this.props.onDateSelect, dateMs);
  }

  scrollToPrevMonth() {
    this.scrollToItem(0);
  }

  scrollToNextMonth() {
    this.scrollToItem(2);
  }

  scrollToItem(itemIndex: number, animated = true) {
    const scrollToX = itemIndex * SCREEN_WIDTH;
    this.calendar.current.scrollTo({ y: 0, x: scrollToX, animated });
  }

  scrollEnded({ nativeEvent }) {
    const { monthDateMs } = this.props;
    const position = nativeEvent.contentOffset.x;
    const currentPage = position / SCREEN_WIDTH;
    const index = int(this.props.monthToRender / 2);
    const newMonth = moment(monthDateMs).add(currentPage - index, 'month');
    caller(this.props.onMonthChanged, newMonth.valueOf());
  }

  renderHeading() {
    const { weekStart, dayHeadings } = this.props;
    const headings = [];
    for (let i = 0; i < 7; i += 1) {
      const j = (i + weekStart) % 7;
      headings.push(
        <Text key={i} style={styles.dayHeading}>
          {dayHeadings[j]}
        </Text>,
      );
    }

    return <View style={styles.calHeading}>{headings}</View>;
  }

  render() {
    const {
      customStyle,
      ticks,
      todayMs,
      monthDateMs,
      titleFormat,
      onTooltipClick,
      toggleTooltip,
      showTotal,
      prevTick,
    } = this.props;

    const startOfCurMonth = time.getCurMonthDateMs();
    const monthsToRender = this.getMonthsToRender(monthDateMs);
    const monthViews = monthsToRender.map((monthDate, index) => {
      const monthTicks = ticks.get(monthDate.month());
      const showPrev = monthDate.valueOf() === startOfCurMonth;
      return (
        <Month
          key={monthDate.month()}
          index={index}
          toggleTooltip={toggleTooltip}
          customStyle={customStyle}
          monthMs={monthDate.valueOf()}
          todayMs={todayMs}
          ticks={monthTicks?.ticks}
          totalDesc={showTotal ? monthTicks?.totalDesc : null}
          prevDesc={
            showPrev && prevTick ? moment(prevTick.createdAt).fromNow() : null
          }
          onDateSelect={this.selectDate}
          onTooltipClick={onTooltipClick}
        />
      );
    });

    return (
      <View style={[styles.calContainer, customStyle.calContainer]}>
        {this.renderHeading(titleFormat)}
        <ScrollView
          ref={this.calendar}
          horizontal
          pagingEnabled
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
          onMomentumScrollEnd={this.scrollEnded}>
          {monthViews}
        </ScrollView>
      </View>
    );
  }
}
