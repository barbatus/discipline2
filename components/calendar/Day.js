'use strict';

import React, {Component, PropTypes} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  PixelRatio,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    hasTick: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircle];

    if (isToday) {
      dayCircleStyle.push(styles.currentDayCircle);
    }

    if (isSelected) {
      dayCircleStyle.push(styles.selectedDayCircle);
    }

    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.dayText];

    if (!isSelected) {
      dayTextStyle.push(styles.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(styles.selectedDayText);
    }

    if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText);
    }

    return dayTextStyle;
  }

  render() {
    const { caption, customStyle } = this.props;
    const {
      outDay, 
      hasTick,
      isWeekend,
      isSelected,
      isToday,
    } = this.props;

    return outDay ? (
        <TouchableWithoutFeedback>
          <View style={styles.dayButton}>
            <View style={styles.dayCircle}>
              <Text style={[styles.dayText, styles.outDayText]}>
                {caption}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.dayButton}>
          <View style={this.dayCircleStyle(isWeekend, isSelected, isToday)}>
            { hasTick ? <View style={styles.tickPoint} /> : null }
            <Text style={this.dayTextStyle(isWeekend, isSelected, isToday)}>
              {caption}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
