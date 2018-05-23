import React, { PureComponent } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';

import { caller, int } from 'app/utils/lang';
import time from 'app/time/utils';

import { SCREEN_WIDTH } from '../styles/common';
import Month from './Month';
import styles from './styles';

export default class Calendar extends PureComponent {
  static propTypes = {
    ticks: PropTypes.instanceOf(Map),
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    onDateSelect: PropTypes.func.isRequired,
    onMonthChanged: PropTypes.func.isRequired,
    onTooltipClick: PropTypes.func.isRequired,
    titleFormat: PropTypes.string,
    todayMs: PropTypes.number,
    weekStart: PropTypes.number,
    monthToRender: PropTypes.number,
    dateMs: PropTypes.number,
    selDateMs: PropTypes.number,
  };

  static defaultProps = {
    ticks: null,
    selDateMs: null,
    customStyle: {},
    dayHeadings: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
    titleFormat: 'MMMM YYYY',
    todayMs: moment().valueOf(),
    dateMs: time.getCurMonthDateMs(),
    weekStart: moment().weekday(0).isoWeekday() - 1,
    monthToRender: 3,
  };

  constructor(props) {
    super(props);

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

  getMonthsToRender(monthMs) {
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
    this.calendar.scrollTo({ y: 0, x: scrollToX, animated });
  }

  scrollEnded({ nativeEvent }) {
    const { dateMs } = this.props;
    const position = nativeEvent.contentOffset.x;
    const currentPage = position / SCREEN_WIDTH;
    const index = int(this.props.monthToRender / 2);
    const newMonth = moment(dateMs).add(currentPage - index, 'month');
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

    return (
      <View style={styles.calHeading}>
        {headings}
      </View>
    );
  }

  render() {
    const {
      customStyle,
      ticks,
      todayMs,
      dateMs,
      selDateMs,
      titleFormat,
      onTooltipClick,
    } = this.props;

    const monthsToRender = this.getMonthsToRender(dateMs);
    const monthViews = monthsToRender.map((monthDate) => {
      const monthTicks = ticks ? ticks.get(monthDate.month()) : null;
      return (
        <Month
          key={monthDate.month()}
          customStyle={customStyle}
          monthMs={monthDate.valueOf()}
          todayMs={todayMs}
          selDateMs={selDateMs}
          ticks={monthTicks}
          onDateSelect={this.selectDate}
          onTooltipClick={onTooltipClick}
        />
      );
    });

    return (
      <View style={[styles.calContainer, customStyle.calContainer]}>
        {this.renderHeading(titleFormat)}
        <ScrollView
          ref={(el) => (this.calendar = el)}
          horizontal
          pagingEnabled
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
          onMomentumScrollEnd={this.scrollEnded}
        >
          {monthViews}
        </ScrollView>
      </View>
    );
  }
}
