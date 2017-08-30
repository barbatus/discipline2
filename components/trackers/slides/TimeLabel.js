import React, { PureComponent } from 'react';

import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 52,
    fontWeight: '100',
    color: '#4A4A4A',
    textAlign: 'center',
  },
  slotStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  delimStyle: {
    paddingLeft: 3,
    paddingRight: 3,
  },
  lapText: {
    fontSize: 20,
    color: '#9B9B9B',
    fontWeight: '100',
    textAlign: 'right',
  },
});

class TimeDigit extends PureComponent {
  render() {
    const { style, value, width } = this.props;
    const align = [{ textAlign: 'center' }];
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

export default class TimeLabel extends PureComponent {
  static defaultProps = {
    lapTimeMs: 0,
  };

  render() {
    const { style, width, timeMs, lapTimeMs } = this.props;
    const { hh, mm, ss } = time.formatTimeMs(timeMs);

    const timeLap = time.formatTimeMs(lapTimeMs);
    const digWidth = width / 6;
    const delimStyle = [styles.timeText, styles.delimStyle, style];
    const digitStyle = [styles.timeText, style];
    const trueWidth = hh ? width : 4 * digWidth;
    const lapStyle = [{ width: trueWidth }, styles.lapText];
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          {hh ? <TimeDigit style={digitStyle} width={digWidth} value={hh} /> : null}
          {hh ? <Text style={delimStyle}>:</Text> : null}
          <TimeDigit style={digitStyle} width={digWidth} value={mm} />
          <Text style={delimStyle}>:</Text>
          <TimeDigit style={digitStyle} width={digWidth} value={ss} />
        </View>
        <View style={styles.textContainer}>
          {
            lapTimeMs ?
              <Text style={lapStyle}>
                {timeLap.format()}
              </Text>
              : null
          }
        </View>
      </View>
    );
  }
}
