'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';

import { trackerStyles } from '../styles/trackerStyles';
import TrackerSlide from './TrackerSlide';

export default class CounterSlide extends TrackerSlide {
  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      count: tracker.count
    });
  }

  get controls() {
    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={this._onMinus.bind(this)}>
            <Image
              source={getIcon('minus')}
              style={trackerStyles.circleBtn}
            />
          </TouchableOpacity>
          <Text style={styles.countText} numberOfLines={1}>
            {this.state.count}
          </Text>
          <TouchableOpacity onPress={this._onPlus.bind(this)}>
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

  _onPlus() {
    let { tracker } = this.props;
    tracker.click();
  }

  _onMinus() {
    let count = this.state.count;
    if (count > 0) {
      let { tracker } = this.props;
      tracker.undo();
    }
  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  countText: {
    fontSize: 54,
    fontWeight: '300',
    color: '#4A4A4A'
  }
});
