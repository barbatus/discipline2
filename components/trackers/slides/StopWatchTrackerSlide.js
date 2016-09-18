'use strict';

import React, {Component} from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration
} from 'react-native';

import {
  trackerDef,
  trackerStyles
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

export default class StopWatchTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      lapTimeMs: 0
    };
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TimeLabel
            ref='time'
            width={200}
            timeLapMs={this.state.lapTimeMs}
            timeMs={this.state.timeMs} />
        </View>
      </View>
    );
  }

  get footer() {
    let { editable } = this.props;

    let renderBtn = (label, onPress) => {
      return (
        <TouchableOpacity
          style={styles.button}
          disabled={!editable}
          onPress={this::onPress}>
          <Text style={styles.btnText}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    };

    let active = this.state.active;
    return (
      <View style={styles.footerContainer}>
        { active ? renderBtn('STOP', this._onStopBtn) :
                   renderBtn('START', this._onStartBtn) }
        { renderBtn('LAP', this._onLap) }
      </View>
    );
  }

  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      timeMs: tracker.value
    });
  }

  onTick() {
    Vibration.vibrate();

    this.setState({
      active: true
    });
  }

  onValue(value) {
    this.refs.time.setTime(value);
    this.state.timeMs = value;
  }

  onStop() {
    this.setState({
      active: false
    });
  }

  _onStartBtn() {
    let { tracker } = this.props;
    tracker.tick();
  }

  _onStopBtn() {
    let { tracker } = this.props;
    tracker.stop();
  }

  _onLap() {
    let lapTimeMs = this.state.timeMs;
    this.refs.time.setTimeLap(lapTimeMs);
    this.state.lapTimeMs = lapTimeMs;
  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerContainer: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100'
  }
});
