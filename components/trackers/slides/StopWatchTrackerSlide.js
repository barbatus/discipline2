'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';

import {
  trackerDef,
  trackerStyles
} from '../styles/trackerStyles';

import {slideWidth} from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

export default class StopWatchTrackerSlide extends TrackerSlide {
  constructor(props) {
    super(props);

    this.state = {
      leftBtnText: 'START',
      rightBtnText: 'LAP'
    };
  }

  componentWillMount() {
    super.componentWillMount();
    let { tracker } = this.props;
    tracker.onTicking(::this.onTicking);
    tracker.onStop(::this.onStop);
    tracker.onStart(::this.onStart);
  }

  onChange() {
    let { tracker } = this.props;
    this.setState({
      iconId: tracker.iconId,
      title: tracker.title,
      time: tracker.value
    });
  }

  onTick() {}

  onStart() {
    this.setState({
      leftBtnText: 'STOP'
    });
  }

  onTicking(value) {
    this.refs.time.setNativeProps({
      text: time.formatTimeMs(value)
    });
  }

  onStop() {
    this.setState({
      leftBtnText: 'START'
    });
  }

  get controls() {
    let { editable } = this.props;

    return (
      <View style={trackerStyles.controls}>
        <View style={styles.controls}>
          <View style={styles.textContainer}>
            <View>
              <TextInput
                ref='time'
                style={styles.timeTextInput}
                value={time.formatTimeMs(this.state.time)}
                editable={false}>
              </TextInput>
            </View>
          </View>
        </View>
      </View>
    );
  }

  get footer() {
    let { editable } = this.props;

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.button}
          disabled={!editable}
          onPress={::this._onStartStop}>
          <Text style={styles.btnText}>
            {this.state.leftBtnText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          disabled={!editable}
          onPress={::this._onLap}>
          <Text style={styles.btnText}>
            {this.state.rightBtnText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  _onStartStop() {
    let { tracker } = this.props;

    if (tracker.isTicking) {
      tracker.stop();
      return;
    }
    tracker.tick();
  }

  _onLap() {

  }
};

const styles = StyleSheet.create({
  controls: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeText: {
    fontSize: 56,
    textAlign: 'center',
    color: '#4A4A4A',
    fontWeight: '200'
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
  },
  timeTextInput: {
    height: 40,
    width: slideWidth,
    fontSize: 52,
    color: '#4A4A4A',
    textAlign: 'center',
    fontWeight: '100'
  }
});
