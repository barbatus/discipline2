import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import PropTypes from 'prop-types';

import { combineTicksMonthly } from 'app/model/utils';

import Calendar from '../calendar/Calendar';

export default class TrackerCal extends Component {
  static propTypes = {
    selDateMs: PropTypes.number,
    style: Animated.View.propTypes.style,
  };

  static defaultProps = {
    ticks: [],
    selDateMs: null,
    style: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      ticksMap: new Map(),
      selDateMs: null,
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.ticks !== props.ticks) {
      const { tracker } = this.props;
      this.setState({
        ticksMap: combineTicksMonthly(props.ticks, tracker.type),
        selDateMs: null,
      });
    }
    if (this.props.selDateMs !== props.selDateMs) {
      this.setState({ selDateMs: props.selDateMs });
    }
  }

  shouldComponentUpdate(props, state) {
    return this.props.ticks !== props.ticks ||
           this.state.selDateMs !== state.selDateMs;
  }

  scrollToPrevMonth() {
    this.calendar.scrollToPrevMonth();
  }

  scrollToNextMonth() {
    this.calendar.scrollToNextMonth();
  }

  render() {
    const { style } = this.props;
    const { selDateMs, ticksMap } = this.state;

    return (
      <Animated.View style={style}>
        <Calendar
          {...this.props}
          ref={(el) => (this.calendar = el)}
          scrollEnabled
          showControls
          selDateMs={selDateMs}
          ticks={ticksMap}
          titleFormat="MMMM YYYY"
          prevButtonText="Prev"
          nextButtonText="Next"
        />
      </Animated.View>
    );
  }
}
