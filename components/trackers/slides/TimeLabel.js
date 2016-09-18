'use strict';

import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

class TimeDigit extends Component {
  shouldComponentUpdate(props) {
    return props.value != this.props.value;
  }

  render() {
    let { style, value, width } = this.props;
    let align = [{textAlign: 'center'}];
    return (
      <View style={styles.slotStyle}>
        <Text style={[{ width }, align]}>
          <Text style={style}>
            {value[0]}
          </Text>
        </Text>
        <Text style={[{ width }, align]}>
          <Text style={style}>
            {value[1]}
          </Text>
        </Text>
      </View>
    );
  }
}

class TimeLabel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeMs: props.timeMs,
      timeLapMs: props.timeLapMs
    };
  }

  setTime(timeMs) {
    this.setState({
      timeMs
    });
  }

  setTimeLap(timeLapMs) {
    this.setState({
      timeLapMs
    });
  }

  shouldComponentUpdate(props, state) {
    if (props.timeMs !== this.props.timeMs ||
        props.timeLapMs !== this.props.timeLapMs) {
      this.state.timeMs = props.timeMs;
      this.state.timeLapMs = props.timeLapMs;
      return true;
    }

    return this.state.timeMs !== state.timeMs ||
           this.state.timeLapMs !== state.timeLapMs;
  }

  render() {
    let { style, width } = this.props;

    let { hh, mm, ss } = time.formatTimeMs(this.state.timeMs);
    let timeLap = time.formatTimeMs(this.state.timeLapMs);
    let digWidth = width / 6;
    let delimStyle = [styles.timeText, styles.delimStyle, style];
    let digitStyle = [styles.timeText, style];
    let trueWidth = hh ? width : 4 * digWidth;
    let lapStyle = [{ width: trueWidth }, styles.lapText];
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          { hh ? <TimeDigit style={digitStyle} width={digWidth} value={hh} /> : null }
          { hh ? <Text style={delimStyle}>:</Text> : null }
          <TimeDigit style={digitStyle} width={digWidth} value={mm} />
          <Text style={delimStyle}>:</Text>
          <TimeDigit style={digitStyle} width={digWidth} value={ss} />
        </View>
        <View style={styles.textContainer}>
          {
            this.state.timeLapMs ?
              <Text style={lapStyle}>
                { timeLap.format() }
              </Text>
            : null
          }
        </View>
      </View>
    );
  }
}

TimeLabel.defaultProps = {
  timeLapMs: 0
};

export default TimeLabel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeText: {
    fontSize: 52,
    fontWeight: '100',
    color: '#4A4A4A',
    textAlign: 'center'
  },
  slotStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  delimStyle: {
    paddingLeft: 3,
    paddingRight: 3
  },
  lapText: {
    fontSize: 20,
    color: '#9B9B9B',
    fontWeight: '100',
    textAlign: 'right'
  }
});
