import React, { PureComponent } from 'react';

import { Animated } from 'react-native';

import moment from 'moment';

import { TrackerType } from 'app/depot/consts';

import { formatDistance } from 'app/utils/format';

import time from 'app/time/utils';

import Calendar from '../calendar/Calendar';

import ScreenSlideUpDownAnim from '../animation/ScreenSlideUpDownAnim';

export default class TrackerCal extends PureComponent {
  opacity = new Animated.Value(0);

  upDown = new ScreenSlideUpDownAnim();

  constructor(props) {
    super(props);
    this.state = {
      selDateMs: null,
    };
    this.upDown.setOut();
    this.onDateSelect = ::this.onDateSelect;
  }

  setShown(value: number) {
    this.opacity.setValue(value);
    if (value === 0) {
      this.upDown.setOut();
      this.onDateSelect(null);
      return;
    }
    this.upDown.setIn();
  }

  onDateSelect(selDateMs) {
    this.setState({ selDateMs });
  }

  scrollToPrevMonth() {
    this.calendar.scrollToPrevMonth();
  }

  scrollToNextMonth() {
    this.calendar.scrollToNextMonth();
  }

  prepareTicks() {
    const { ticks } = this.props;
    const dates = new Map();
    ticks.forEach((tick) => {
      const tickDate = moment(tick.dateTimeMs);
      const month = tickDate.month();
      const date = tickDate.date() - 1;
      dates[month] = dates[month] || new Map();
      dates[month][date] = dates[month][date] || [];
      dates[month][date].push({
        dateMs: tick.dateTimeMs,
        desc: this.printTick(tick),
      });
    });
    return dates;
  }

  printTick(tick) {
    const { tracker } = this.props;
    switch (tracker.type) {
      case TrackerType.GOAL:
        return 'The goal was achieved';
      case TrackerType.COUNTER:
        return 'The target increased';
      case TrackerType.SUM:
        return `$${tick.value} added`;
      case TrackerType.DISTANCE: {
        const distFmt = formatDistance(tick.value);
        const timeFmt = time.formatTimeMs(tick.time);
        return `${distFmt.format()}${distFmt.unit} in ${timeFmt.format(false)}`;
      }
      default:
        throw new Error('Tracker type is not supported');
    }
  }

  render() {
    const { style, tracker, todayMs, dateMs, onMonthChanged } = this.props;
    const { selDateMs } = this.state;

    const tickMap = this.prepareTicks();
    const calStyle = [style, this.upDown.style, { opacity: this.opacity }];
    return (
      <Animated.View style={calStyle}>
        <Calendar
          ref={(el) => (this.calendar = el)}
          todayMs={todayMs}
          dateMs={dateMs}
          scrollEnabled
          showControls
          selDateMs={selDateMs}
          ticks={tickMap}
          titleFormat="MMMM YYYY"
          prevButtonText="Prev"
          nextButtonText="Next"
          onDateSelect={this.onDateSelect}
          onMonthChanged={onMonthChanged}
        />
      </Animated.View>
    );
  }
}
