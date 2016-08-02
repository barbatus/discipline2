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
    let digits = value.split('');
    let align = [{textAlign: 'center'}];
    return (
      <View style={styles.slotStyle}>
        <Text style={[{ width }, align]}>
          <Text style={style}>
            {digits[0]}
          </Text>
        </Text>
        <Text style={[{ width }, align]}>
          <Text style={style}>
            {digits[1]}
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
      timeMs: props.time
    };
  }

  setTime(timeMs) {
    this.setState({
      timeMs
    });
  }

  shouldComponentUpdate(props, state) {
    if (props.time != this.props.time) {
      this.state.timeMs = props.time;
      return true;
    }

    return this.state.timeMs != state.timeMs;
  }

  render() {
    let { style, width } = this.props;

    let { hh, mm, ss } = time.formatTimeMs(
      this.state.timeMs);
    let digWidth = width / 6;
    let delimStyle = [styles.timeText, styles.delimStyle, style];
    let digitStyle = [styles.timeText, style];
    return (
      <View style={styles.textContainer}>
        { hh ? <TimeDigit style={digitStyle} width={digWidth} value={hh} /> : null }
        { hh ? <Text style={delimStyle}>:</Text> : null }
        <TimeDigit style={digitStyle} width={digWidth} value={mm} />
        <Text style={delimStyle}>:</Text>
        <TimeDigit style={digitStyle} width={digWidth} value={ss} />
      </View>
    );
  }
}

export default TimeLabel;

const styles = StyleSheet.create({
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
  }
});
