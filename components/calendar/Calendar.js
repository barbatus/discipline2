'use strict';

import React, {Component, PropTypes} from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import moment from 'moment';

import Day from './Day';

import styles from './styles';

import {screenWidth} from '../styles/common';

import {caller, int} from '../../utils/lang';

export default class Calendar extends Component {
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
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    titleFormat: 'MMMM YYYY',
    todayMs: moment().valueOf(),
    weekStart: moment().weekday(0).isoWeekday() - 1,
    monthToRender: 3,
  };

  constructor(props) {
    super(props);

    const { todayMs } = this.props;
    this.state = {
      currentMonth: moment(todayMs),
      selectedDate: null,
    };
  }

  shouldComponentUpdate(props, state) {
    if (this.props.todayMs !== props.todayMs) {
      this.state.currentMonth = moment(props.todayMs);
      this.state.selectedDate = null;
      return true;
    }
    return this.props.ticks !== props.ticks;
  }

  componentDidMount() {
    const index = int(this.props.monthToRender / 2);
    this._scrollToItem(index, false);
  }

  componentDidUpdate() {
    const index = int(this.props.monthToRender / 2);
    this._scrollToItem(index, false);
  }

  _getMonthsToRender(currentMonth) {
    const months = [];
    const index = int(this.props.monthToRender / 2);
    for (let i = -index; i <= index; i++) {
      months.push(moment(currentMonth).add(i, 'month'));
    }
    return months;
  }

  _prepareTickDates(tickDates) {
    const flattenDates = {};
    tickDates.forEach(date => {
      if (!flattenDates[date.month()]) {
        flattenDates[date.month()] = {};
      }
      flattenDates[date.month()][date.date() - 1] = true;
    });
    return flattenDates;
  }

  _selectDate(date) {
    this.setState({selectedDate: date});
    caller(this.props.onDateSelect, date.format());
  }

  _onPrev = () => {
    this._scrollToItem(0);
  }

  _onNext = () => {
    this._scrollToItem(2);
  }

  _scrollToItem(itemIndex, animated = true) {
    const scrollToX = itemIndex * screenWidth;
    this._calendar.scrollTo({ y: 0, x: scrollToX, animated });
  }

  _scrollEnded({ nativeEvent }) {
    const position = nativeEvent.contentOffset.x;
    const currentPage = position / screenWidth;
    const index = int(this.props.monthToRender / 2);
    const { currentMonth } = this.state;
    const newMonth = moment(currentMonth).add(
      currentPage - index, 'month');
    this.setState({currentMonth: newMonth});

    caller(this.props.onMonthChanged, newMonth);
  }

  _renderMonthView(month, tickDatesMap) {
    const { eventDates, customStyle, today } = this.props;
    const { selectedDate } = this.state;

    const
      startOfMonth = moment(month).startOf('month'),
      endOfMonth = moment(month).endOf('month'),
      startOffset = startOfMonth.weekday(),
      endOffset = 6 - endOfMonth.weekday();

    const startDay = startOfMonth.subtract(startOffset, 'day');
    const endDay = endOfMonth.add(endOffset, 'day');
    let days = [];
    let weekRows = [];
    while(startDay.isBefore(endDay)) {
      const isoWeekday = startDay.isoWeekday();
      const isOutDay = startDay.month() !== month.month();
      const dayIndex = startDay.date() - 1;
      days.push(
        <Day
          isWeekend={isoWeekday === 6 || isoWeekday === 7}
          key={startDay.valueOf()}
          onPress={this._selectDate.bind(this, moment(startDay))}
          caption={startDay.date()}
          isToday={startDay.isSame(today, 'day')}
          isSelected={startDay.isSame(selectedDate, 'day')}
          hasTick={!isOutDay && tickDatesMap[dayIndex] === true}
          customStyle={customStyle}
          outDay={isOutDay}
        />
      );
      if (startDay.weekday() === 6) {
        weekRows.push(
          <View key={weekRows.length} style={styles.weekRow}>
            {days}
          </View>
        );
        days = [];
      }
      startDay.add(1, 'day');
    }

    return (
      <View key={month.month()} style={styles.monthContainer}>
        {weekRows}
      </View>
    );
  }

  _renderHeading() {
    const { customStyle, weekStart, dayHeadings } = this.props;

    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={j === 0 || j === 6 ?
            styles.weekendHeading :
            styles.dayHeading}>
          {dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={styles.calendarHeading}>
        {headings}
      </View>
    );
  }

  _renderTopBar() {
    const { customStyle, monthNames } = this.props;
    const { currentMonth } = this.state;

    const monthName = monthNames[currentMonth.month()];
    return (
      <View style={styles.calendarControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={this._onPrev}>
           <Image
            source={getIcon('back')}
            style={styles.navIcon} />
        </TouchableOpacity>
        <Text style={[styles.title, customStyle.title]}>
          {monthName}{','} {currentMonth.year()}
        </Text>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={this._onNext}>
          <Image
            source={getIcon('next_')}
            style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { customStyle, titleFormat, tickDates } = this.props;
    const { currentMonth } = this.state;

    const monthsToRender = this._getMonthsToRender(currentMonth);
    const tickDatesMap = this._prepareTickDates(tickDates);
    const monthViews = monthsToRender.map(month => {
      const monthTickDates = tickDatesMap[month.month()] || {};
      return this._renderMonthView(month, monthTickDates);
    });

    return (
      <View style={[styles.calendarContainer, customStyle.calendarContainer]}>
        {this._renderTopBar()}
        {this._renderHeading(titleFormat)}
        <ScrollView
          ref={calendar => this._calendar = calendar}
          horizontal
          pagingEnabled
          //removeClippedSubviews
          scrollEventThrottle={1000}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
          onMomentumScrollEnd={event => this._scrollEnded(event)}>
          {monthViews}
        </ScrollView>
      </View>
    );
  }
}
