import React from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';

import { getIcon } from '../../../icons/icons';

import { trackerStyles } from '../styles/trackerStyles';

import TrackerSlide from './TrackerSlide';

import { caller } from '../../../utils/lang';

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countText: {
    fontSize: 56,
    fontWeight: '200',
    color: '#4A4A4A',
  },
});

export default class CounterSlide extends TrackerSlide {
  constructor(props) {
    super(props);
    this.onUndo = ::this.onUndo;
    this.onTick = ::this.onTick;
  }

  get bodyControls() {
    const { tracker, responsive } = this.props;
    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TouchableOpacity disabled={!responsive} onPress={this.onUndo}>
            <Image source={getIcon('minus')} style={trackerStyles.circleBtn} />
          </TouchableOpacity>
          <Text style={styles.countText} numberOfLines={1}>
            {tracker.count}
          </Text>
          <TouchableOpacity disabled={!responsive} onPress={this.onTick}>
            <Image source={getIcon('plus')} style={trackerStyles.circleBtn} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  get footerControls() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap to count the thing you&#39;ve done
      </Text>
    );
  }

  onTick() {
    Vibration.vibrate();
    caller(this.props.onTick);
  }

  onUndo() {
    caller(this.props.onUndo);
  }
}
