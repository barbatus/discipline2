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

  shouldComponentUpdate(props, state) {
    return this.props.isSelected !== props.isSelected ||
           this.props.isToday !== props.isToday;
  }

  dayCircleStyle = (isSelected, isToday) => {
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

  dayTextStyle = (isSelected, isToday) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.dayText];

    if (!isSelected) {
      dayTextStyle.push(styles.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(styles.selectedDayText);
    }

    return dayTextStyle;
  }

  render() {
    const { caption, outDay, hasTick, isSelected, isToday } = this.props;

    return outDay ? (
        <TouchableWithoutFeedback>
          <View style={styles.dayButton}>
            <View style={styles.dayCircle}>
              <Text style={[styles.dayText, styles.outDayText]}>
                { caption }
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      ) : (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.dayButton}>
          <View style={this.dayCircleStyle(isSelected, isToday)}>
            { hasTick ? <View style={styles.tickPoint} /> : null }
            <Text style={this.dayTextStyle(isSelected, isToday)}>
              { caption }
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
