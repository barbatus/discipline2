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

import {trackerStyles} from '../styles/trackerStyles';

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

  onTick() {
    let { tracker } = this.props;
    this.setState({
      count: tracker.count
    });
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TouchableOpacity
            disabled={!editable}
            onPress={this._onMinus.bind(this)}>
            <Image
              source={getIcon('minus')}
              style={trackerStyles.circleBtn}
            />
          </TouchableOpacity>
          <Text style={styles.countText} numberOfLines={1}>
            {this.state.count}
          </Text>
          <TouchableOpacity
            disabled={!editable}
            onPress={this._onPlus.bind(this)}>
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
    tracker.tick();
  }

  _onMinus() {
    let { count } = this.state;
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
    fontSize: 56,
    fontWeight: '200',
    color: '#4A4A4A'
  }
});
