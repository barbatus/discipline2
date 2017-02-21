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

import Month from './Month';

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
    dateMs: moment().valueOf(),
    weekStart: moment().weekday(0).isoWeekday() - 1,
    monthToRender: 3,
  };

  constructor(props) {
    super(props);

    const { dateMs } = this.props;
    this.state = {
      currentMonth: moment(dateMs).startOf('month'),
      selectedDate: null,
    };
  }

  shouldComponentUpdate(props, state) {
    if (this.props.dateMs !== props.dateMs) {
      this.state.currentMonth = moment(props.dateMs);
      this.state.selectedDate = null;
      return true;
    }
    return this.props.todayMs !== props.todayMs ||
           this.props.tickDates !== props.tickDates ||
           this.state.selectedDate !== state.selectedDate;
  }

  componentDidMount() {
    const index = int(this.props.monthToRender / 2);
    this._scrollToItem(index, false);
  }

  componentDidUpdate() {
    const index = int(this.props.monthToRender / 2);
    this._scrollToItem(index, false);
  }

  _getMonthsToRender(month) {
    const months = [];
    const index = int(this.props.monthToRender / 2);
    for (let i = -index; i <= index; i++) {
      months.push(moment(month).add(i, 'month'));
    }
    return months;
  }

  _prepareTickDates(tickDates) {
    const dates = {};
    tickDates.forEach(date => {
      if (!dates[date.month()]) {
        dates[date.month()] = {};
      }
      dates[date.month()][date.date() - 1] = true;
    });
    return dates;
  }

  _selectDate(dateMs: number) {
    const date = moment(dateMs);
    this.setState({selectedDate: date});
    caller(this.props.onDateSelect, date.format());
  }

  _onPrev() {
    this._scrollToItem(0);
  }

  _onNext() {
    this._scrollToItem(2);
  }

  _scrollToItem(itemIndex: number, animated = true) {
    const scrollToX = itemIndex * screenWidth;
    this._calendar.scrollTo({ y: 0, x: scrollToX, animated });
  }

  _scrollEnded({ nativeEvent }) {
    const { currentMonth } = this.state;

    const position = nativeEvent.contentOffset.x;
    const currentPage = position / screenWidth;
    const index = int(this.props.monthToRender / 2);
    const newMonth = moment(currentMonth).add(
      currentPage - index, 'month');
    this.setState({currentMonth: newMonth});

    caller(this.props.onMonthChanged, newMonth);
  }

  _renderHeading() {
    const { weekStart, dayHeadings } = this.props;

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
      <View style={styles.calHeading}>
        {headings}
      </View>
    );
  }

  _renderTopBar() {
    const { customStyle, monthNames } = this.props;
    const { currentMonth } = this.state;

    const monthName = monthNames[currentMonth.month()];
    return (
      <View style={styles.calControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={::this._onPrev}>
           <Image
            source={getIcon('back')}
            style={styles.navIcon} />
        </TouchableOpacity>
        <Text style={[styles.title, customStyle.title]}>
          {monthName}{','} {currentMonth.year()}
        </Text>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={::this._onNext}>
          <Image
            source={getIcon('next_')}
            style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { customStyle, titleFormat, tickDates, todayMs } = this.props;
    const { currentMonth, selectedDate } = this.state;

    const monthsToRender = this._getMonthsToRender(currentMonth);
    const tickDatesMap = this._prepareTickDates(tickDates);
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
          onDateSelect={::this._selectDate}
        />
      );
    });

    return (
      <View style={[styles.calContainer, customStyle.calContainer]}>
        { this._renderTopBar() }
        { this._renderHeading(titleFormat) }
        <ScrollView
          ref={calendar => this._calendar = calendar}
          horizontal
          pagingEnabled
          scrollEventThrottle={1000}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets
          onMomentumScrollEnd={::this._scrollEnded}>
          { monthViews }
        </ScrollView>
      </View>
    );
  }
}
