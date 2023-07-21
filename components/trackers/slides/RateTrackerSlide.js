import React from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Vibration,
  StyleSheet,
} from 'react-native';

import { getIcon } from 'app/icons/icons';
import { caller } from 'app/utils/lang';

import { trackerStyles, trackerDef } from '../styles/trackerStyles';
import TrackerSlide from './TrackerSlide';

const styles = StyleSheet.create({
  controls: {
    ...trackerDef.controls,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  row: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rateBtn: {
    ...trackerDef.checkBtn,
    height: 50,
    width: 50,
    borderWidth: 1,
    marginRight: 5,
    borderColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateText: {
    fontSize: 16,
  },
  checkedText: {
    color: 'white',
    fontSize: 18,
  },
});

const RateBtn = (props: {
  value: number,
  checked: boolean,
  disabled: boolean,
  last: Boolean,
  onUndo: (value) => void,
  onTick: () => void,
}) => {
  const lastStyle = props.last ? { marginRight: 0 } : null;
  return (
    <TouchableOpacity
      style={
        props.checked
          ? [styles.rateBtn, trackerStyles.filledBtn, lastStyle]
          : [styles.rateBtn, lastStyle]
      }
      disabled={props.disabled}
      onLongPress={() => props.checked && props.onUndo(props.value)}
      onPress={() => props.onTick(props.value)}
    >
      <Text style={props.checked ? styles.checkedText : styles.rateText}>
        {props.value}
      </Text>
    </TouchableOpacity>
  );
};

export default class RateTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);
    this.onTick = ::this.onTick;
    this.onUndo = ::this.onUndo;
  }

  get bodyControls() {
    const { responsive, tracker } = this.props;
    const rates1 = [1, 2, 3, 4, 5];
    const rates2 = [];
    return (
      <View style={styles.controls}>
        <View style={styles.row}>
          {rates1.slice(0, 5).map((value, index) => (
            <RateBtn
              key={value}
              value={value}
              checked={value === tracker.lastValue}
              last={index === 4}
              disabled={!responsive}
              onUndo={this.onUndo}
              onTick={this.onTick}
            />
          ))}
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          {rates2.map((value, index) => (
            <RateBtn
              key={value}
              value={value}
              checked={value === tracker.lastValue}
              last={index === 4}
              disabled={!responsive}
              onUndo={this.onUndo}
              onTick={this.onTick}
            />
          ))}
        </View>
      </View>
    );
  }

  get footerControls() {
    return <Text style={trackerStyles.footerText}>Rate it!</Text>;
  }

  onUndo() {
    const { tracker } = this.props;
    caller(this.props.onUndo);
  }

  onTick(value) {
    const { tracker } = this.props;
    Vibration.vibrate();
    caller(this.props.onTick, value);
  }
}
