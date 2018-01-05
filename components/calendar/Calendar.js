import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import moment from 'moment';

import Month from './Month';

import styles from './styles';

import { screenWidth } from '../styles/common';

import { caller, int } from '../../utils/lang';

export default class Calendar extends PureComponent {
  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    onDateSelect: PropTypes.func,
    onMonthChanged: PropTypes.func,
    titleFormat: PropTypes.string,
    todayMs: PropTypes.number,
    weekStart: PropTypes.number,
    monthToRender: PropTypes.number,
    dateMs: PropTypes.number,
    selDateMs: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    dayHeadings: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
    tickDates: [],
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
    const scrollToX = itemIndex * screenWidth;
    this.calendar.scrollTo({ y: 0, x: scrollToX, animated });
  }

  scrollEnded({ nativeEvent }) {
    const { dateMs } = this.props;
    const position = nativeEvent.contentOffset.x;
    const currentPage = position / screenWidth;
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
    } = this.props;

    const monthsToRender = this.getMonthsToRender(dateMs);
    const monthViews = monthsToRender.map((monthDate) => {
      const monthTicks = ticks[monthDate.month()] || {};
      return (
        <Month
          key={monthDate.valueOf()}
          customStyle={customStyle}
          monthMs={monthDate.valueOf()}
          shown={dateMs === monthDate.valueOf()}
          todayMs={todayMs}
          selDateMs={selDateMs}
          ticks={monthTicks}
          onDateSelect={this.selectDate}
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
