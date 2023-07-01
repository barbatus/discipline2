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
    marginBottom: 10,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateBtn: {
    ...trackerDef.checkBtn,
    height: 40,
    width: 40,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateText: {
    color: 'white',
  },
});

const RateBtn = (props: {
  value: number,
  checked: boolean,
  disabled: boolean,
  onUndo: (value) => void,
  onTick: () => void,
}) => {
  return (
    <TouchableOpacity
      style={
        props.checked
          ? [styles.rateBtn, trackerStyles.filledBtn]
          : styles.rateBtn
      }
      disabled={props.disabled}
      onLongPress={() => props.checked && props.onUndo(props.value)}
      onPress={() => props.onTick(props.value)}
    >
      <Text style={props.checked ? styles.rateText : null}>{props.value}</Text>
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
    const rates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
      <View style={styles.controls}>
        <View style={styles.row}>
          {rates.slice(0, 5).map((value) => (
            <RateBtn
              key={value}
              value={value}
              checked={value === tracker.lastValue}
              disabled={!responsive}
              onUndo={this.onUndo}
              onTick={this.onTick}
            />
          ))}
        </View>
        <View style={styles.row}>
          {rates.slice(5).map((value) => (
            <RateBtn
              key={value}
              value={value}
              checked={value === tracker.lastValue}
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
