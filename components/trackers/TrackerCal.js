import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { Tick } from 'app/model/Tracker';
import { combineTicksMonthly } from 'app/model/utils';
import { caller } from 'app/utils/lang';

import Calendar from '../calendar/Calendar';

export default class TrackerCal extends PureComponent {
  static propTypes = {
    trackerType: PropTypes.object,
    ticks: PropTypes.arrayOf(PropTypes.instanceOf(Tick)),
    // TODO: if only ViewPropTypes.style left it curses
    // that opacity is not part of ViewPropTypes.style
    style: PropTypes.object,
  };

  static defaultProps = {
    ticks: [],
    trackerType: null,
    style: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ticksMap: new Map(),
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.ticks !== props.ticks) {
      const { trackerType } = this.props;
      this.setState({
        ticksMap: combineTicksMonthly(props.ticks, trackerType),
      });
    }
  }

  scrollToPrevMonth() {
    this.calendar.scrollToPrevMonth();
  }

  scrollToNextMonth() {
    this.calendar.scrollToNextMonth();
  }

  render() {
    const { style } = this.props;
    const { ticksMap } = this.state;

    return (
      <Animated.View style={style}>
        <Calendar
          {...this.props}
          ref={(el) => (this.calendar = el)}
          scrollEnabled
          showControls
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
