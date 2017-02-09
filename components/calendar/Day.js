import React, {Component, PropTypes} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    hasEvent: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    usingEvents: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, hasEvent) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircle, customStyle.dayCircle];

    if (isToday) {
      dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
    }

    if (isSelected) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
    }

    if (hasEvent) {
      dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle)
    }

    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, hasEvent) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (!isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    }

    if (isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    }

    if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }

    if (hasEvent) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText)
    }

    return dayTextStyle;
  }

  render() {
    const { caption, customStyle } = this.props;
    const {
      outDay, 
      hasEvent,
      isWeekend,
      isSelected,
      isToday,
    } = this.props;

    return outDay ? (
        <TouchableWithoutFeedback>
          <View style={[styles.outDayButton, customStyle.outDayButton]}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      ) : (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.dayButton, customStyle.dayButton]}>
          <View style={this.dayCircleStyle(isWeekend, isSelected, isToday, hasEvent)}>
            <Text style={this.dayTextStyle(isWeekend, isSelected, isToday, hasEvent)}>
              {caption}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
