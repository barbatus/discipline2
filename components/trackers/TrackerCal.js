import React, { PureComponent } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { EnumSymbol } from 'app/depot/Enum';
import { TrackerType } from 'app/depot/consts';
import { Tick } from 'app/model/Tracker';
import { combineTicksMonthly } from 'app/model/ticks';

import Calendar from '../calendar/Calendar';

const styles = StyleSheet.create({});

export default class TrackerCal extends PureComponent {
  static propTypes = {
    trackerType: PropTypes.instanceOf(EnumSymbol),
    ticks: PropTypes.arrayOf(PropTypes.instanceOf(Tick)),
    formatTickValue: PropTypes.func.isRequired,
    // TODO: if only ViewPropTypes.style left it curses
    // that opacity is not part of ViewPropTypes.style
    style: PropTypes.arrayOf(PropTypes.object),
    onDateSelect: PropTypes.func,
    shown: PropTypes.bool,
    monthDateMs: PropTypes.number,
    todayMs: PropTypes.number,
  };

  static defaultProps = {
    ticks: [],
    trackerType: null,
    style: null,
    onDateSelect: null,
    shown: false,
  };

  calendar = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      ticksMap: new Map(),
      formatTickValue: props.formatTickValue,
    };
  }

  static getDerivedStateFromProps({ ticks, trackerType, formatTickValue }, prevState) {
    if (ticks !== prevState.ticks) {
      return {
        ticksMap: combineTicksMonthly(ticks, trackerType, prevState.formatTickValue),
        ticks,
        formatTickValue,
      };
    }
    if (formatTickValue !== prevState.formatTickValue) {
      return { formatTickValue };
    }
    return null;
  }

  scrollToPrevMonth() {
    this.calendar.current.scrollToPrevMonth();
  }

  scrollToNextMonth() {
    this.calendar.current.scrollToNextMonth();
  }

  render() {
    const { trackerType, style, shown } = this.props;
    const { ticksMap } = this.state;

    const showTotal = trackerType !== TrackerType.STOPWATCH;
    return (
      <Animated.View style={[styles.container, style]}>
        <Calendar
          {...this.props}
          ref={this.calendar}
          scrollEnabled
          showControls
          showTotal={showTotal}
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
