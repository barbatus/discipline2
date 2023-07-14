import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import { caller } from 'app/utils/lang';

import { WHITE_COLOR } from '../styles/common';

const styles = StyleSheet.create({
  dayButton: {
    alignItems: 'center',
    padding: 0,
  },
  dayText: {
    fontSize: 18,
    color: WHITE_COLOR,
    fontWeight: '300',
  },
  outDayText: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
  dayCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 33,
    height: 33,
    borderRadius: 16,
  },
  currentDayCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  currentDayText: {
    color: WHITE_COLOR,
  },
  selectedDayCircle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  selectedDayText: {
    color: 'white',
  },
  tickPoint: {
    position: 'absolute',
    width: 5,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    left: 27,
    top: 3,
  },
});

export default class Day extends PureComponent {
  static propTypes = {
    value: PropTypes.number.isRequired,
    hasTicks: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isOutDay: PropTypes.bool,
    copilot: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func,
  };

  static defaultProps = {
    hasTicks: false,
    isSelected: false,
    isToday: false,
    isOutDay: false,
    copilot: null,
  };

  constructor(props) {
    super(props);
    this.onPress = ::this.onPress;
    this.onLongPress = ::this.onLongPress;
  }

  getDayCircleStyle(isSelected, isToday) {
    const dayCircleStyle = [styles.dayCircle];

    if (isToday) {
      dayCircleStyle.push(styles.currentDayCircle);
    }

    if (isSelected) {
      dayCircleStyle.push(styles.selectedDayCircle);
    }

    return dayCircleStyle;
  }

  getDayTextStyle(isSelected) {
    const dayTextStyle = [styles.dayText];

    if (!isSelected) {
      dayTextStyle.push(styles.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(styles.selectedDayText);
    }

    return dayTextStyle;
  }

  onPress() {
    const { value, onPress } = this.props;
    onPress(value);
  }

  onLongPress() {
    const { value, onLongPress } = this.props;
    caller(onLongPress, value);
  }

  render() {
    const { value, isOutDay, hasTicks, isSelected, isToday, copilot } =
      this.props;

    return isOutDay ? (
      <TouchableWithoutFeedback>
        <View style={styles.dayButton}>
          <View style={styles.dayCircle}>
            <Text style={[styles.dayText, styles.outDayText]}>{value}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <TouchableOpacity onPress={this.onPress} onLongPress={this.onLongPress}>
        <View style={styles.dayButton}>
          <View
            {...copilot}
            style={this.getDayCircleStyle(isSelected, isToday)}
          >
            {hasTicks ? <View style={styles.tickPoint} /> : null}
            <Text style={this.getDayTextStyle(isSelected, isToday)}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
