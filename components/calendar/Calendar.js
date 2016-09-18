import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import Day from './Day';

import moment from 'moment';
import styles from './styles';

const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 2;

export default class Calendar extends Component {
  state = {
    currentMonthMoment: this.props.startDate ? moment(this.props.startDate) : null,
    selectedMoment: this.props.selectedDate ? moment(this.props.selectedDate) : null
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.string,
    onDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.string,
    scrollEnabled: PropTypes.bool,
    selectedDate: PropTypes.any,
    startDate: PropTypes.any,
    titleFormat: PropTypes.string,
    today: PropTypes.any,
    weekStart: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    dayHeadings: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    eventDates: [],
    monthNames: ['January,', 'February,', 'March,', 'April,', 'May,', 'June,',
                 'July,', 'August,', 'September,', 'October,', 'November,', 'December,'],
    scrollEnabled: false,
    showControls: false,
    startDate: moment().format('YYYY-MM-DD'),
    titleFormat: 'MMMM YYYY',
    today: moment(),
    weekStart: 1,
  };

  componentDidMount() {
    this._scrollToItem(VIEW_INDEX);
  }

  componentDidUpdate() {
    this._scrollToItem(VIEW_INDEX);
  }

  _getMonthStack(currentMonth) {
    if (this.props.scrollEnabled) {
      const res = [];
      for (let i = -VIEW_INDEX; i <= VIEW_INDEX; i++) {
        res.push(moment(currentMonth).add(i, 'month'));
      }
      return res;
    }
    return [moment(currentMonth)];
  }

  _prepareEventDates(eventDates) {
    const parsedDates = {};

    eventDates.forEach(event => {
      const date = moment(event);
      const month = moment(date).startOf('month').format();
      if (!parsedDates[month]) {
        parsedDates[month] = {};
      }
      parsedDates[month][date.date() - 1] = true;
    })
    return parsedDates;
  }

  _selectDate(date) {
    this.setState({ selectedMoment: date });
    this.props.onDateSelect && this.props.onDateSelect(date.format());
  }

  _onPrev = () => {
    const newMoment = moment(this.state.currentMonthMoment).subtract(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
  }

  _onNext = () => {
    const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchNext && this.props.onTouchNext(newMoment);
  }

  _scrollToItem(itemIndex) {
    const scrollToX = itemIndex * DEVICE_WIDTH;
    if (this.props.scrollEnabled) {
      this._calendar.scrollTo({ y: 0, x: scrollToX, animated: false });
    }
  }

  _scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / DEVICE_WIDTH;
    const newMoment = moment(this.state.currentMonthMoment).add(
      currentPage - VIEW_INDEX, 'month');
    this.setState({ currentMonthMoment: newMoment });

    if (currentPage < VIEW_INDEX) {
      this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
    } else if (currentPage > VIEW_INDEX) {
      this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
    }
  }

  _renderMonthView(argMoment, eventDatesMap) {
    const { eventDates, customStyle, weekStart, today } = this.props;

    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOf('month');

    const
      selectedMoment = this.state.selectedMoment,
      todayMoment = moment(today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSame(todayMoment, 'month'),
      selectedIndex = selectedMoment ? selectedMoment.date() - 1 : -1,
      selectedMonthIsArg = selectedMoment ? selectedMoment.isSame(argMoment, 'month') : false;

    const events = (eventDatesMap !== null) ?
      eventDatesMap[argMoment.startOf('month').format()] : null;

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;

      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
        days.push((
          <Day
            startOfMonth={startOfArgMonthMoment}
            isWeekend={isoWeekday === 0 || isoWeekday === 6}
            key={`${renderIndex}`}
            onPress={() => {
              this._selectDate(moment(startOfArgMonthMoment).set('date', dayIndex + 1));
            }}
            caption={`${dayIndex + 1}`}
            isToday={argMonthIsToday && (dayIndex === todayIndex)}
            isSelected={selectedMonthIsArg && (dayIndex === selectedIndex)}
            hasEvent={events && events[dayIndex] === true}
            usingEvents={eventDates.length > 0}
            customStyle={customStyle}
          />
        ));
      } else {
        days.push(<Day key={`${renderIndex}`} filler customStyle={customStyle} />);
      }

      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            style={[styles.weekRow, customStyle.weekRow]}>
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true)

    const containerStyle = [styles.monthContainer, customStyle.monthContainer];
    return <View key={argMoment.month()} style={containerStyle}>{weekRows}</View>;
  }

  _renderHeading() {
    const { customStyle } = this.props;

    let headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={j === 0 || j === 6 ?
            [styles.weekendHeading, customStyle.weekendHeading] :
            [styles.dayHeading, customStyle.dayHeading]}>
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }

  _renderTopBar() {
    let { customStyle, monthNames } = this.props;

    let localizedMonth = monthNames[this.state.currentMonthMoment.month()];
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
          {localizedMonth} {this.state.currentMonthMoment.year()}
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
    const { eventDates, customStyle, scrollEnabled, titleFormat } = this.props;

    const calendarDates = this._getMonthStack(this.state.currentMonthMoment);
    const eventDatesMap = this._prepareEventDates(eventDates);

    return (
      <View style={[styles.calendarContainer, customStyle.calendarContainer]}>
        {this._renderTopBar()}
        {this._renderHeading(titleFormat)}
        {
          scrollEnabled ?
            <ScrollView
              ref={calendar => this._calendar = calendar}
              horizontal
              scrollEnabled
              pagingEnabled
              removeClippedSubviews
              scrollEventThrottle={1000}
              showsHorizontalScrollIndicator={false}
              automaticallyAdjustContentInsets
              onMomentumScrollEnd={(event) => this._scrollEnded(event)}>
              {calendarDates.map((date) => this._renderMonthView(moment(date), eventDatesMap))}
            </ScrollView> :
            <View ref={calendar => this._calendar = calendar}>
              {calendarDates.map((date) => this._renderMonthView(moment(date), eventDatesMap))}
            </View>
        }
      </View>
    );
  }
}
