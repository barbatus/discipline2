import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { Tick } from 'app/model/Tracker';
import { combineTicksMonthly } from 'app/model/utils';

import Calendar from '../calendar/Calendar';

export default class TrackerCal extends PureComponent {
  static propTypes = {
    trackerType: PropTypes.object,
    ticks: PropTypes.arrayOf(PropTypes.instanceOf(Tick)),
    metric: PropTypes.bool.isRequired,
    // TODO: if only ViewPropTypes.style left it curses
    // that opacity is not part of ViewPropTypes.style
    style: PropTypes.arrayOf(PropTypes.object),
    onDateSelect: PropTypes.func,
    shown: PropTypes.bool,
  };

  static defaultProps = {
    ticks: [],
    trackerType: null,
    style: null,
    onDateSelect: null,
    shown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      ticksMap: new Map(),
    };
  }

  static getDerivedStateFromProps({ ticks, trackerType, metric }, prevState) {
    if (ticks !== prevState.ticks) {
      return { ticksMap: combineTicksMonthly(ticks, trackerType, metric), ticks };
    }
    return null;
  }

  scrollToPrevMonth() {
    this.calendar.scrollToPrevMonth();
  }

  scrollToNextMonth() {
    this.calendar.scrollToNextMonth();
  }

  render() {
    const { style, shown } = this.props;
    const { ticksMap } = this.state;

    return (
      <Animated.View style={style}>
        <Calendar
          {...this.props}
          ref={(el) => (this.calendar = el)}
          scrollEnabled
          showControls
          shown={shown}
          ticks={ticksMap}
          titleFormat="MMMM YYYY"
          prevButtonText="Prev"
          nextButtonText="Next"
          onDateSelect={this.props.onDateSelect}
        />
      </Animated.View>
    );
  }
}
