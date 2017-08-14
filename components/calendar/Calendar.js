'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import moment from 'moment';

import { getIcon } from '../../icons/icons';

import Month from './Month';

import styles, { calWidth } from './styles';

import { screenWidth } from '../styles/common';

import { caller, int } from '../../utils/lang';

export default class Calendar extends React.PureComponent {
  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    tickDates: PropTypes.array,
    monthNames: PropTypes.array,
    onDateSelect: PropTypes.func,
    onMonthChanged: PropTypes.func,
    titleFormat: PropTypes.string,
    todayMs: PropTypes.number,
    weekStart: PropTypes.number,
    monthToRender: PropTypes.number,
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

    this.state = {
      dateMs: this.props.dateMs,
      selectedDate: null,
    };
    this.selectDate = ::this.selectDate;
    this.scrollEnded = ::this.scrollEnded;
    this.onPrev = ::this.onPrev;
    this.onNext = ::this.onNext;
  }

  componentWillReceiveProps(props) {
    if (this.props.dateMs !== props.dateMs) {
      this.state.selectedDate = null;
      if (!this.props.shown) {
        this.state.dateMs = props.dateMs;
        return;
      }
      if (props.dateMs > this.props.dateMs) {
        this.isScrolling = true;
        setImmediate(() => this.onNext());
      }
      if (props.dateMs < this.props.dateMs) {
        this.isScrolling = true;
        setImmediate(() => this.onPrev());
      }
    }
  }

  componentDidMount() {
    const index = int(this.props.monthToRender / 2);
    this.scrollToItem(index, false);
  }

  componentDidUpdate() {
    const index = int(this.props.monthToRender / 2);
    this.scrollToItem(index, false);
  }

  getMonthsToRender(month) {
    const months = [];
    const index = int(this.props.monthToRender / 2);
    for (let i = -index; i <= index; i++) {
      months.push(moment(month).add(i, 'month'));
    }
    return months;
  }

  prepareTickDates(tickDates) {
    const dates = {};
    tickDates.forEach(date => {
      const month = date.month();
      dates[month] = dates[month] || {};
      dates[month][date.date() - 1] = true;
    });
    return dates;
  }

  selectDate(dateMs: number) {
    const date = moment(dateMs);
    this.setState({ selectedDate: date });
    caller(this.props.onDateSelect, date.format());
  }

  onPrev() {
    this.scrollToItem(0);
  }

  onNext() {
    this.scrollToItem(2);
  }

  scrollToItem(itemIndex: number, animated = true) {
    const scrollToX = itemIndex * screenWidth;
    this.refs.calendar.scrollTo({ y: 0, x: scrollToX, animated });
  }

  scrollEnded({ nativeEvent }) {
    const { dateMs } = this.state;
    const position = nativeEvent.contentOffset.x;
    const currentPage = position / screenWidth;
    const index = int(this.props.monthToRender / 2);
    const newMonth = moment(dateMs).add(currentPage - index, 'month');
    this.setState({ dateMs: newMonth.valueOf() }, () => {
      if (!this.isScrolling) {
        caller(this.props.onMonthChanged, newMonth);
      }
      this.isScrolling = false;
    });
  }

  renderHeading() {
    const { weekStart, dayHeadings } = this.props;

    const headings = [];
    for (let i = 0; i < 7; i++) {
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
    const { customStyle, titleFormat, tickDates, todayMs } = this.props;
    const { dateMs, selectedDate } = this.state;

    const monthsToRender = this.getMonthsToRender(moment(dateMs));
    const tickDatesMap = this.prepareTickDates(tickDates);
    const monthViews = monthsToRender.map(month => {
      const monthTickDates = tickDatesMap[month.month()] || {};
      const selectedDateMs = selectedDate ? selectedDate.valueOf() : 0;
      return (
        <Month
          key={month.valueOf()}
          customStyle={customStyle}
          monthMs={month.valueOf()}
          todayMs={todayMs}
          selectedDateMs={selectedDateMs}
          tickDates={monthTickDates}
          onDateSelect={this.selectDate}
        />
      );
    });

    return (
      <View style={[styles.calContainer, customStyle.calContainer]}>
        {this.renderHeading(titleFormat)}
        <ScrollView
          ref="calendar"
          horizontal
          pagingEnabled
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
