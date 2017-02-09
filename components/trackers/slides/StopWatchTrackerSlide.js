'use strict';

import React, {Component} from 'react';

import {caller} from '../../../utils/lang';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';

import {
  trackerDef,
  trackerStyles,
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

import TimeLabel from './TimeLabel';

import Timers from '../../../time/Timers';

export default class StopWatchTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);

    const { tracker } = props;
    this._timer = Timers.get(tracker.id, 1000);
    this._timer.events.on('onTimer', ::this._onTimer);
  }

  shouldComponentUpdate(props, state) {
    const should = super.shouldComponentUpdate(props, state);
    return should || this.state.active !== state.active;
  }

  componentWillUnmount() {
    const { tracker } = this.props;
    Timers.dispose(tracker.id);
    this._timer = null;
  }

  onEdit() {
    if (this._timer.active) return;
    super.onEdit();
  }

  get controls() {
    const { tracker } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <TimeLabel
            ref='time'
            width={200}
            timeMs={tracker.value}
          />
        </View>
      </View>
    );
  }

  get footer() {
    const { editable } = this.props;

    const renderBtn = (label, onPress) => {
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

    const active = this._timer.active;
    return (
      <View style={styles.footerContainer}>
        {
          active ?
            renderBtn('STOP', this._onStop) :
            renderBtn('START', this._onTick)
        }
        { renderBtn('LAP', this._onLap) }
      </View>
    );
  }

  _onTick() {
    Vibration.vibrate();

    const { tracker } = this.props;
    this._timer.start(tracker.value);
    caller(this.props.onTick);
  }

  _onTimer(timeMs: number) {
    this.refs.time.setTime(timeMs);
  }

  _onStop() {
    this._timer.stop();
    caller(this.props.onStop, this._timer.timeMs);
  }

  _onLap() {
    const { tracker } = this.props;
    const timeMs = this._timer.active ? this._timer.timeMs : 0;
    const lapTimeMs = tracker.value + timeMs;
    this.refs.time.setTimeLap(lapTimeMs);
  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1,
    width: slideWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '200',
  },
});
