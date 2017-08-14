'use strict';

import React, { PureComponent, PropTypes } from 'react';

import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import { screenWidth } from '../styles/common';

import { calWidth } from './styles';

import Tooltip from '../tooltip/Tooltip';

export default class Day extends PureComponent {
  static propTypes = {
    caption: PropTypes.any,
    hasTick: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      tooltipShown: false,
    };
  }

  render() {
    const {
      caption,
      outDay,
      hasTick,
      isSelected,
      isToday,
      onPress,
    } = this.props;

    const { tooltipShown } = this.state;

    return outDay
      ? <TouchableWithoutFeedback>
          <View style={styles.dayButton}>
            <View style={styles.dayCircle}>
              <Text style={[styles.dayText, styles.outDayText]}>
                {caption}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      : <TouchableOpacity onPress={::this._onPress}>
          <View style={styles.dayButton}>
            <Tooltip shown={tooltipShown}>
              <Text>tooltip</Text>
            </Tooltip>
            <View style={this._dayCircleStyle(isSelected, isToday)}>
              {hasTick ? <View style={styles.tickPoint} /> : null}
              <Text style={this._dayTextStyle(isSelected, isToday)}>
                {caption}
              </Text>
            </View>
          </View>
        </TouchableOpacity>;
  }

  _onPress(event) {
    const { hasTick, onPress } = this.props;
    this.setState({
      tooltipShown: true,
    });
    onPress();
  }

  _dayCircleStyle(isSelected, isToday) {
    const dayCircleStyle = [styles.dayCircle];

    if (isToday) {
      dayCircleStyle.push(styles.currentDayCircle);
    }

    if (isSelected) {
      dayCircleStyle.push(styles.selectedDayCircle);
    }

    return dayCircleStyle;
  }

  _dayTextStyle(isSelected, isToday) {
    const dayTextStyle = [styles.dayText];

    if (!isSelected) {
      dayTextStyle.push(styles.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(styles.selectedDayText);
    }

    return dayTextStyle;
  }
}

const styles = StyleSheet.create({
  dayButton: {
    alignItems: 'center',
    padding: 0,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
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
