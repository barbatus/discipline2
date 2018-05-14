import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  dayButton: {
    alignItems: 'center',
    padding: 0,
  },
  dayText: {
    fontSize: 18,
    color: 'white',
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
    color: 'white',
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
    onPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    hasTicks: false,
    isSelected: false,
    isToday: false,
    isOutDay: false,
  };

  constructor(props) {
    super(props);
    this.onPress = ::this.onPress;
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

  render() {
    const {
      value,
      isOutDay,
      hasTicks,
      isSelected,
      isToday,
    } = this.props;

    return isOutDay ?
      <TouchableWithoutFeedback>
        <View style={styles.dayButton}>
          <View style={styles.dayCircle}>
            <Text style={[styles.dayText, styles.outDayText]}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      :
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.dayButton}>
          <View style={this.getDayCircleStyle(isSelected, isToday)}>
            {hasTicks ? <View style={styles.tickPoint} /> : null}
            <Text style={this.getDayTextStyle(isSelected, isToday)}>
              {value}
            </Text>
          </View>
        </View>
      </TouchableOpacity>;
  }
}
