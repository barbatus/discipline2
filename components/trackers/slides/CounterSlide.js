'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration
} from 'react-native';

import {trackerStyles} from '../styles/trackerStyles';

import TrackerSlide from './TrackerSlide';

import {caller} from '../../../utils/lang';

export default class CounterSlide extends TrackerSlide {
  get controls() {
    let { tracker, editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TouchableOpacity
            disabled={!editable}
            onPress={::this._onUndo}>
            <Image
              source={getIcon('minus')}
              style={trackerStyles.circleBtn}
            />
          </TouchableOpacity>
          <Text style={styles.countText} numberOfLines={1}>
            {tracker.count}
          </Text>
          <TouchableOpacity
            disabled={!editable}
            onPress={::this._onTick}>
            <Image
              source={getIcon('plus')}
              style={trackerStyles.circleBtn}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  get footer() {
    return (
      <Text style={trackerStyles.footerText}>
        Tap to count the thing you've done
      </Text>
    );
  }

  _onTick() {
    Vibration.vibrate();
    caller(this.props.onTick);
  }

  _onUndo() {
    caller(this.props.onUndo);
  }
};

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
